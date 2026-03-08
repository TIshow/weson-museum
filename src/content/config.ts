import { defineCollection, z } from 'astro:content';

// ニュース記事のスキーマ
const newsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    ogImage: z.string().optional(),
  }),
});

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

export const collections = {
  news: newsCollection,
  exhibitions: exhibitionsCollection,
};
