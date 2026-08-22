import mediaData from '../data/media.json';

export const MEDIA_TYPES = ['web', 'print'] as const;
export type MediaType = (typeof MEDIA_TYPES)[number];

export interface MediaEntry {
  outlet: string;
  title: string;
  date: string;
  type: MediaType;
  url?: string;
  featured: boolean;
}

/**
 * media.json は Content Collections ではないので zod の検証が走らない。
 * JSON からの型推論では `type` が string に広がってしまうため、ここで絞る。
 * 同時に不正な値をビルド時に落とし、誤った媒体種別が静かに公開されるのを防ぐ。
 */
export const media: MediaEntry[] = mediaData.map(entry => {
  if (!(MEDIA_TYPES as readonly string[]).includes(entry.type)) {
    throw new Error(
      `src/data/media.json: "${entry.outlet}" の type が不正です（"${entry.type}"）。` +
        `${MEDIA_TYPES.join(' / ')} のいずれかにしてください。`
    );
  }
  return entry as MediaEntry;
});

/** 掲載日の新しい順に並べ替えた全件。 */
export function sortedMedia(): MediaEntry[] {
  return [...media].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** トップページ用。featured のものを新しい順に最大 limit 件返す。 */
export function featuredMedia(limit: number): MediaEntry[] {
  return sortedMedia()
    .filter(m => m.featured)
    .slice(0, limit);
}
