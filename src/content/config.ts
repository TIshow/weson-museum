import { defineCollection, z } from 'astro:content';
import type { Locale } from '../i18n/config';

// ニュース記事のスキーマ
const newsSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.date(),
  updatedDate: z.date().optional(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  ogImage: z.string().optional(),
});

const newsCollection = defineCollection({ type: 'content', schema: newsSchema });
const newsEnCollection = defineCollection({ type: 'content', schema: newsSchema });

// 展示のスキーマ
const exhibitionsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    artist: z.string(),
    startDate: z.date(),
    endDate: z.date().optional(),
    ongoing: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    coverImage: z.string().optional(),
    // 将来的に Three.js シーンを紐付けるためのフィールド
    sceneId: z.string().optional(),
  }),
});

// ------------------------------------------------------------
// 作家（ARTLINK ARTISTS）
// ------------------------------------------------------------

/**
 * 多言語テキスト。ja のみ必須で、未翻訳のロケールは ja にフォールバックする。
 *
 * `satisfies Record<Locale, ...>` により、src/i18n/config.ts の LOCALES に
 * 言語を足してここを更新し忘れると型エラーになる（`pnpm check` で検出）。
 */
const i18nShape = {
  ja: z.string(),
  en: z.string().optional(),
} satisfies Record<Locale, z.ZodType<string | undefined>>;

const i18nText = z.object(i18nShape);

/** 販売ステータス。価格を出すかどうかとは独立して持つ。 */
const availability = z.enum(['available', 'reserved', 'sold', 'not-for-sale', 'inquire']);

const workSchema = z.object({
  /** 作家内で一意な識別子。将来 CRM 側の作品IDと突き合わせる想定。 */
  id: z.string(),
  title: i18nText,
  year: z.string().optional(),
  /** 技法・素材（例: 油彩・キャンバス / Oil on canvas） */
  medium: i18nText.optional(),
  /** 表記そのまま（例: "910 × 727 mm"） */
  dimensions: z.string().optional(),
  image: z.string().optional(),
  availability: availability.default('inquire'),
  /** 円。公開したくない場合は priceOnRequest を使う。 */
  price: z.number().optional(),
  priceOnRequest: z.boolean().default(false),
  /** エディション表記（版画・写真など） */
  edition: z.string().optional(),
  /** 展示実績（ARTLINK 2025 / 天空美術館 など） */
  exhibitedAt: z.array(z.string()).default([]),
});

const artistsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    name: i18nText,
    /** ふりがな。一覧の並び順に使う。 */
    nameReading: z.string().optional(),
    /** 明示的な並び順。小さいほど先。 */
    order: z.number().default(999),
    featured: z.boolean().default(false),
    /** 既定で非公開。実データを入れて確認してから false にする。 */
    draft: z.boolean().default(true),

    portrait: z.string().optional(),
    coverImage: z.string().optional(),

    /** 拠点（例: 東京 / Tokyo, Japan） */
    based: i18nText.optional(),
    birthYear: z.number().optional(),
    /** 分野・技法（例: 油彩、版画） */
    disciplines: z.array(i18nText).default([]),
    /** 所属団体（例: 春陽会） */
    affiliations: z.array(i18nText).default([]),

    /** 制作の背景。作家自身の言葉を想定。 */
    statement: i18nText.optional(),
    /** 経歴・プロフィール。 */
    bio: i18nText.optional(),

    exhibitionHistory: z
      .array(
        z.object({
          year: z.string(),
          title: i18nText,
          venue: i18nText.optional(),
          kind: z.enum(['solo', 'group', 'vr', 'award', 'other']).default('group'),
        })
      )
      .default([]),

    upcoming: z
      .array(
        z.object({
          title: i18nText,
          venue: i18nText.optional(),
          startDate: z.date().optional(),
          endDate: z.date().optional(),
          url: z.string().url().optional(),
          note: i18nText.optional(),
        })
      )
      .default([]),

    works: z.array(workSchema).default([]),

    links: z
      .object({
        website: z.string().url(),
        x: z.string().url(),
        instagram: z.string().url(),
        booth: z.string().url(),
        note: z.string().url(),
        youtube: z.string().url(),
        other: z.string().url(),
      })
      .partial()
      .default({}),

    /** VR空間での在廊に立てるか。WESON の差別化要因なので個別に持つ。 */
    vrResidency: z.boolean().default(false),
  }),
});

export const collections = {
  news: newsCollection,
  'news-en': newsEnCollection,
  exhibitions: exhibitionsCollection,
  artists: artistsCollection,
};
