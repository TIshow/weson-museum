import type { I18nText, Locale } from '@i18n/config';

/**
 * ARTLINK の開催回データ。
 *
 * 日付・時刻はすべて日本時間（JST）で書く。
 * サイトは push 時にしかビルドされないため、「開催中」「終了」のような
 * 時刻に依存する状態はここから導出しないこと（ビルド時点で固定されて古くなる）。
 */

/** 作家在廊イベント。date は YYYY-MM-DD、start/end は HH:MM（JST）。 */
export interface ArtlinkTalk {
  date: string;
  start: string;
  end: string;
}

export interface ArtlinkArtist {
  /**
   * 表記は作家の指定どおり。読みが確認できていない名前は en を書かず、
   * 原表記のまま ja にフォールバックさせる（推測でローマ字にしない）。
   */
  name: I18nText;
  /** 作家ページがある場合の slug。公開中の作家ページがあるときだけリンクになる。 */
  slug?: string;
}

export interface ArtlinkEdition {
  year: string;
  /** 会期の初日・最終日（YYYY-MM-DD、JST） */
  startDate: string;
  endDate: string;
  venue: I18nText;
  worldUrl: string;
  admission: I18nText;
  organizer: I18nText;
  talks: ArtlinkTalk[];
  /** 50音順 */
  artists: ArtlinkArtist[];
  /** 開催告知のニュース記事 slug（news / news-en 共通） */
  announcementSlug: string;
}

export const currentEdition: ArtlinkEdition = {
  year: '2026',
  startDate: '2026-11-01',
  endDate: '2026-11-14',
  venue: {
    ja: 'ARTLINK2026会場 ⁄ Venue（VRChat）',
    en: 'ARTLINK2026会場 ⁄ Venue (VRChat)',
  },
  worldUrl: 'https://vrchat.com/home/world/wrld_0ac2766e-de64-4add-a890-3e0dab8dce15',
  admission: { ja: '無料', en: 'Free' },
  organizer: { ja: 'WESON MUSEUM／ARTLINK', en: 'WESON MUSEUM / ARTLINK' },
  talks: [
    { date: '2026-11-01', start: '21:00', end: '23:00' },
    { date: '2026-11-07', start: '21:00', end: '23:00' },
    { date: '2026-11-08', start: '14:00', end: '16:00' },
  ],
  artists: [
    { name: { ja: '植村友哉', en: 'Tomoya Uemura' }, slug: 'tomoya-uemura' },
    { name: { ja: '川端陽子' } },
    { name: { ja: '志村敬子' } },
    { name: { ja: '濵 一蝶' } },
    { name: { ja: 'やぐっか' } },
    { name: { ja: '善也' } },
    { name: { ja: 'ChoN' } },
    { name: { ja: 'H。T。' } },
    { name: { ja: 'iT' } },
    { name: { ja: 'marron chantilly' } },
    { name: { ja: 'Miki Amano' } },
    { name: { ja: 'MIU' } },
  ],
  announcementSlug: 'artlink-2026-announcement',
};

// ------------------------------------------------------------
// 日付の整形。ビルド環境（CI は UTC）に左右されないよう常に JST で解釈する。
// ------------------------------------------------------------

const TZ = 'Asia/Tokyo';

/** YYYY-MM-DD と HH:MM を JST の ISO 8601 文字列にする（JSON-LD 用）。 */
export function toJstIso(date: string, time = '00:00'): string {
  return `${date}T${time}:00+09:00`;
}

function parts(date: string, lang: Locale) {
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
  const p = parts(date, lang);
  return lang === 'ja' ? `${p.month}月${p.day}日（${p.weekday}）` : `${p.weekday}, ${p.monthName} ${p.day}`;
}

/** 「2026年11月1日（日）〜11月14日（土）」/「Sun, Nov 1 – Sat, Nov 14, 2026」 */
export function formatPeriod(edition: ArtlinkEdition, lang: Locale): string {
  const start = parts(edition.startDate, lang);
  return lang === 'ja'
    ? `${start.year}年${formatDay(edition.startDate, lang)}〜${formatDay(edition.endDate, lang)}`
    : `${formatDay(edition.startDate, lang)} – ${formatDay(edition.endDate, lang)}, ${start.year}`;
}

/** バナー用の短い表記「2026.11.01 — 11.14」 */
export function formatPeriodCompact(edition: ArtlinkEdition): string {
  const [y, m1, d1] = edition.startDate.split('-');
  const [, m2, d2] = edition.endDate.split('-');
  return `${y}.${m1}.${d1} — ${m2}.${d2}`;
}

/** 「11月1日（日）21:00–23:00」/「Sun, Nov 1 · 21:00–23:00 JST」 */
export function formatTalk(talk: ArtlinkTalk, lang: Locale): string {
  const time = `${talk.start}–${talk.end}`;
  return lang === 'ja' ? `${formatDay(talk.date, lang)} ${time}` : `${formatDay(talk.date, lang)} · ${time} JST`;
}
