# コンテンツ戦略

WESON MUSEUM で扱うコンテンツの設計と運用方針をまとめます。

## コンテンツの種類

| 種別 | 内容 | 管理場所 |
|------|------|----------|
| ニュース | 展覧会の告知、更新情報 | `src/content/news/` |
| 展示 | 展示詳細、アーティスト情報 | `src/content/exhibitions/` |
| 固定ページ | About, アクセスなど | `src/pages/` |

## Astro Content Collections

Astro の Content Collections を使ってコンテンツを管理します。

- 各記事は **Markdown（`.md`）または MDX（`.mdx`）ファイル**で書く
- ファイルの先頭に Frontmatter（YAML）でメタ情報を記述する
- スキーマは `src/content/config.ts` で定義・型チェックされる

## URL 設計方針

| コンテンツ | URL パターン | 例 |
|-----------|-------------|-----|
| トップ | `/` | https://example.com/ |
| ニュース一覧 | `/news/` | https://example.com/news/ |
| ニュース詳細 | `/news/<slug>/` | https://example.com/news/2025-spring-exhibition/ |
| 展示一覧 | `/exhibitions/` | https://example.com/exhibitions/ |
| 展示詳細 | `/exhibitions/<slug>/` | https://example.com/exhibitions/weson-2025-01/ |
| About | `/about/` | https://example.com/about/ |

**URL のルール:**
- 日本語を URL に含めない
- スラッグは英数字・ハイフンのみ（例: `2025-spring-open`）
- 末尾スラッシュあり（`trailingSlash: 'always'`）

## 年別アーカイブ方針

将来的にニュース・展示を年別に整理できるようにします。

```
/news/           # 全記事一覧（最新順、ページネーション付き）
/news/2025/      # 2025年の記事一覧
/news/2026/      # 2026年の記事一覧
```

Astro のダイナミックルーティング（`[year].astro`）で実装できます。

## ファイル命名規則

**ニュース記事（`src/content/news/`）:**

```
YYYY-MM-DD-<slug>.md

例:
2025-04-01-spring-exhibition-open.md
2025-10-15-new-artist-announcement.md
```

**展示（`src/content/exhibitions/`）:**

```
<year>-<number>-<slug>.md

例:
2025-01-presence-and-absence.md
2025-02-virtual-landscape.md
```

## Frontmatter の書き方

### ニュース記事

```markdown
---
title: "Spring Exhibition 2025 開幕のお知らせ"
description: "WESON MUSEUM の春季展示がオープンしました。"
pubDate: 2025-04-01
tags: ["展示", "お知らせ"]
draft: false
---

本文をここに書きます。Markdown 形式です。
```

### 展示情報

```markdown
---
title: "Presence and Absence"
description: "存在と不在をテーマにした VR インスタレーション"
artist: "アーティスト名"
startDate: 2025-04-01
endDate: 2025-06-30
ongoing: false
tags: ["インスタレーション", "VR"]
draft: false
# sceneId: "weson-2025-01"  # Three.js シーンを紐付ける場合（将来）
---

展示の詳細説明をここに書きます。
```

## 下書き管理

- `draft: true` にすると本番ビルドでスキップされる（開発中コンテンツ用）
- Astro では `getCollection('news', ({ data }) => !data.draft)` でフィルタできる

## 画像の扱い

- ページ固有の画像は `public/images/<種別>/<ファイル名>` に配置する
- 例: `public/images/exhibitions/2025-01-cover.jpg`
- 画像の最適化は将来的に `astro:assets` または外部 CDN を検討する
- ファイルサイズは圧縮してコミット（WebP 推奨）

## SEO と静的サイト運用ルール

1. **記事は公開後に URL を変えない**（被リンク・検索順位を守る）
2. **URLが変わる場合は旧URLからリダイレクトを設定する**（GitHub Pages では `_redirects` は非対応のため、meta refresh または JavaScript リダイレクトページを生成する）
3. **定期的に `sitemap.xml` を更新する**（`@astrojs/sitemap` で自動生成予定）
4. **記事には必ず `description` を書く**（検索結果スニペットに使われる）
