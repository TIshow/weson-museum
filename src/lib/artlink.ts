import { getCollection, type CollectionEntry } from 'astro:content';
import { localizedPath, type Locale } from '@i18n/config';

/**
 * ARTLINK の開催回。データは src/content/artlink/<年>.yaml（ファイル名が年 = URL）。
 *
 * 日付・時刻はすべて日本時間（JST）の文字列で持つ。
 * サイトは push 時にしかビルドされないため、「開催中」「終了」のような
 * 時刻に依存する状態は導出しないこと（ビルド時点で固定されて古くなる）。
 */
export type Edition = CollectionEntry<'artlink'>;
export type EditionTalk = Edition['data']['talks'][number];

/** 公開中の開催回を新しい順に返す。 */
export async function getEditions(): Promise<Edition[]> {
  const editions = await getCollection('artlink', ({ data }) => !data.draft);
  return editions.sort((a, b) => b.data.startDate.localeCompare(a.data.startDate));
}

/** 最新の開催回（トップのバナーや /artlink/ の案内に使う）。 */
export async function getLatestEdition(): Promise<Edition> {
  const [latest] = await getEditions();
  if (!latest) throw new Error('src/content/artlink/ に公開中の開催回がありません');
  return latest;
}

export function editionTitle(edition: Edition): string {
  return `ARTLINK ${edition.id}`;
}

export function editionPath(lang: Locale, edition: Edition): string {
  return localizedPath(lang, `/artlink/${edition.id}/`);
}

/** 参加作家数。名前の記録があればその件数、なければ artistCount。 */
export function artistTotal(edition: Edition): number | undefined {
  return edition.data.artists.length > 0 ? edition.data.artists.length : edition.data.artistCount;
}

/** VRChat の会場 URL（VR 会場に url があるときだけ）。 */
export function worldUrl(edition: Edition): string | undefined {
  return edition.data.venues.find(v => v.kind === 'vr' && v.url)?.url;
}

/**
 * 開催回が参照する news 記事が実在するか確かめる。リンク切れを本番に出さないため、
 * getStaticPaths から呼んでビルド時に落とす。
 */
export async function assertNewsLinks(editions: Edition[]): Promise<void> {
  const ja = new Set((await getCollection('news')).map(n => n.slug));
  const en = new Set((await getCollection('news-en')).map(n => n.slug));
  for (const edition of editions) {
    for (const slug of [edition.data.announcementSlug, edition.data.reportSlug]) {
      if (slug && !(ja.has(slug) && en.has(slug))) {
        throw new Error(
          `src/content/artlink/${edition.id}.yaml: news 記事 "${slug}" が news と news-en の両方にありません`
        );
      }
    }
  }
}

// ------------------------------------------------------------
// 日付の整形。ビルド環境（CI は UTC）に左右されないよう常に JST で解釈する。
// ------------------------------------------------------------

const TZ = 'Asia/Tokyo';

/** YYYY-MM-DD と HH:MM を JST の ISO 8601 文字列にする（JSON-LD 用）。 */
export function toJstIso(date: string, time = '00:00'): string {
  return `${date}T${time}:00+09:00`;
}

export function dateParts(date: string, lang: Locale) {
  const d = new Date(toJstIso(date, '12:00'));
  const get = (opts: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(lang === 'ja' ? 'ja-JP' : 'en-US', { timeZone: TZ, ...opts }).format(d);
  return {
    year: get({ year: 'numeric' }).replace(/\D/g, ''),
    month: get({ month: 'numeric' }).replace(/\D/g, ''),
    monthName: get({ month: 'short' }),
    day: get({ day: 'numeric' }).replace(/\D/g, ''),
    weekday: get({ weekday: 'short' }),
  };
}

/** 「11月1日（日）」/「Sun, Nov 1」 */
export function formatDay(date: string, lang: Locale): string {
  const p = dateParts(date, lang);
  return lang === 'ja' ? `${p.month}月${p.day}日（${p.weekday}）` : `${p.weekday}, ${p.monthName} ${p.day}`;
}

/** 「2026年11月1日（日）〜11月14日（土）」/「Sun, Nov 1 – Sat, Nov 14, 2026」 */
export function formatPeriod(start: string, end: string, lang: Locale): string {
  const year = dateParts(start, lang).year;
  return lang === 'ja'
    ? `${year}年${formatDay(start, lang)}〜${formatDay(end, lang)}`
    : `${formatDay(start, lang)} – ${formatDay(end, lang)}, ${year}`;
}

/** 一覧やバナー用の短い表記「2026.11.01 — 11.14」 */
export function formatPeriodCompact(start: string, end: string): string {
  const [y, m1, d1] = start.split('-');
  const [, m2, d2] = end.split('-');
  return `${y}.${m1}.${d1} — ${m2}.${d2}`;
}

/** 「11月1日（日）21:00–23:00」/「Sun, Nov 1 · 21:00–23:00 JST」 */
export function formatTalk(talk: EditionTalk, lang: Locale): string {
  const time = `${talk.start}–${talk.end}`;
  return lang === 'ja' ? `${formatDay(talk.date, lang)} ${time}` : `${formatDay(talk.date, lang)} · ${time} JST`;
}

// ------------------------------------------------------------
// スケジュール用のカレンダー
// ------------------------------------------------------------

export interface CalendarDay {
  date: string;
  day: number;
  /** 会期内か（会期外の在廊日も表示はする） */
  inPeriod: boolean;
  talks: EditionTalk[];
}

/** 文字列の暦日を UTC の Date として扱う（タイムゾーンを持ち込まずに日付だけ進めるため） */
const utc = (date: string) => {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};
const iso = (d: Date) => d.toISOString().slice(0, 10);

/**
 * 会期を日曜始まりの週ごとに並べる。在廊日が会期外にあれば、その日まで範囲を広げる。
 * 週の頭と末尾の空きは null で埋める（7列のグリッドにそのまま流せる）。
 */
export function buildCalendar(edition: Edition): (CalendarDay | null)[][] {
  const { startDate, endDate, talks } = edition.data;
  const dates = [startDate, endDate, ...talks.map(t => t.date)].sort();
  const first = utc(dates[0]);
  const last = utc(dates[dates.length - 1]);

  const cells: (CalendarDay | null)[] = Array(first.getUTCDay()).fill(null);
  for (const d = new Date(first); d <= last; d.setUTCDate(d.getUTCDate() + 1)) {
    const date = iso(d);
    cells.push({
      date,
      day: d.getUTCDate(),
      inPeriod: date >= startDate && date <= endDate,
      talks: talks.filter(t => t.date === date),
    });
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (CalendarDay | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}
