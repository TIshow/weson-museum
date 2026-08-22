import { getCollection, type CollectionEntry } from 'astro:content';
import { localizedPath, type I18nText, type Locale } from '@i18n/config';

export type Artist = CollectionEntry<'artists'>;
export type Work = Artist['data']['works'][number];

/** 作家をまたいだ作品の横断リスト。買い手側の一覧（Phase 2）で使う。 */
export interface WorkWithArtist extends Work {
  artistId: string;
  artistName: I18nText;
}

/**
 * 公開中の作家を並び順に取得する。
 * order（小さいほど先）→ nameReading → id の順に安定させる。
 */
export async function getPublishedArtists(): Promise<Artist[]> {
  const artists = await getCollection('artists', ({ data }) => !data.draft);
  return artists.sort((a, b) => {
    if (a.data.order !== b.data.order) return a.data.order - b.data.order;
    const reading = (a.data.nameReading ?? '').localeCompare(b.data.nameReading ?? '', 'ja');
    return reading !== 0 ? reading : a.id.localeCompare(b.id);
  });
}

/** 作家詳細ページのパス。 */
export function artistPath(lang: Locale, id: string): string {
  return localizedPath(lang, `/artists/${id}/`);
}

/** 作家一覧ページのパス。 */
export function artistsIndexPath(lang: Locale): string {
  return localizedPath(lang, '/artists/');
}

/** その作家の全作品を、作家情報つきで返す。 */
export function worksOf(artist: Artist): WorkWithArtist[] {
  return artist.data.works.map(work => ({
    ...work,
    artistId: artist.id,
    artistName: artist.data.name,
  }));
}

/**
 * 公開中の作家の作品を、作家をまたいで平坦化して返す。
 * 作品が独立したコレクションに分かれても、呼び出し側はこの関数のままで済む。
 */
export async function getAllWorks(): Promise<WorkWithArtist[]> {
  const artists = await getPublishedArtists();
  return artists.flatMap(worksOf);
}

/** 購入・商談の対象になりうる作品だけを絞り込む。 */
export function purchasable<T extends { availability: Work['availability'] }>(works: T[]): T[] {
  return works.filter(work => work.availability === 'available' || work.availability === 'inquire');
}

/** 価格の表示文字列。非公開・未設定なら undefined を返す。 */
export function formatPrice(work: Work, lang: Locale): string | undefined {
  if (work.priceOnRequest || work.price === undefined) return undefined;
  return new Intl.NumberFormat(lang === 'ja' ? 'ja-JP' : 'en-US', {
    style: 'currency',
    currency: 'JPY',
    maximumFractionDigits: 0,
  }).format(work.price);
}
