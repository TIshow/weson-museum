# CLAUDE.md — WESON MUSEUM 開発ガイド

このファイルは Claude Code がこのリポジトリで作業する際のコンテキストと規約を定めます。

## プロジェクト概要

WESON MUSEUM の公式 Web サイト。VRChat 上に開かれた美術館のサイトで、GitHub Pages で静的ホスティングされています。

- **公開URL**: https://weson-museum.com/
- **ベースパス**: `/`（カスタムドメイン）
- **言語**: 日本語（デフォルト）/ 英語（`/en/`）

## 技術スタック

- **Astro v5** — 静的サイト生成、Content Collections、Islands Architecture
- **pnpm** — パッケージマネージャ（`npm` は使わない）
- **asdf** — Node.js バージョン管理（`.tool-versions` 参照）
- **Three.js** — トップページの3Dギャラリー（dynamic import で遅延ロード）
- **@astrojs/sitemap** — サイトマップ自動生成

## コマンド

```bash
pnpm dev      # 開発サーバー起動（http://localhost:4321）
pnpm build    # 本番ビルド（dist/ に出力）
pnpm preview  # ビルド結果のプレビュー
```

## アーキテクチャの重要事項

### ベースパスと URL

すべてのアセット・内部リンクは `import.meta.env.BASE_URL` または絶対パス `/weson-museum/` を使うこと。

```astro
<!-- 正しい -->
<img src={`${import.meta.env.BASE_URL}images/foo.jpg`} />
<a href="/about/">About</a>

<!-- 間違い -->
<img src="/images/foo.jpg" />
```

### 多言語（i18n）

Astro i18n を使用。`defaultLocale: 'ja'`、`prefixDefaultLocale: false`。

- 日本語ページ: `src/pages/*.astro` → URL `/`
- 英語ページ: `src/pages/en/*.astro` → URL `/en/`
- `BaseLayout` に `lang="en"` を渡すことで HTML lang・nav リンク・フッターリンクが自動切り替え
- 言語スイッチャーは `LanguageSwitcher.astro` が URL を自動変換して生成

```astro
<!-- 英語ページは必ず lang="en" を渡す -->
<BaseLayout title="..." lang="en">
```

### コンテンツ管理

**ニュース記事**: `src/content/news/*.md`（Astro Content Collections）

```markdown
---
title: "タイトル"
description: "概要"
pubDate: 2025-01-01
tags: ["タグ"]
draft: false
---
```

**メディア掲載**: `src/data/media.json`（配列形式、Content Collections ではない）

```json
{ "outlet": "媒体名", "title": "...", "date": "2025-01-01", "type": "web", "url": "https://...", "featured": false }
```

`featured: true` にするとトップページの Press & Media セクションに最大3件表示される。

### Three.js ギャラリー

`src/components/Gallery.astro` + `src/components/three/GalleryScene.ts`

- IntersectionObserver でビューポートに入ったときだけ初期化（遅延ロード）
- `initGallery(canvas, basePath)` を dynamic import で呼び出す
- 作品画像: `public/images/artworks/artwork1.jpg` 〜 `artwork8.jpg`

## デザインシステム

`src/styles/global.css` にデザイントークンを定義。

| トークン | 値 | 用途 |
|---|---|---|
| `--color-main` | `#34b2aa` | テール（メインカラー） |
| `--color-accent` | `#fcfa0a` | 電気イエロー（アクセント） |
| `--color-bg` | `#050b0a` | 背景 |
| `--font-mono` | JetBrains Mono 系 | サイバーパンク的ラベル |

テーマ: **「高貴な美術館空間 × VR サイバーパンクの光」**

- 宣伝調・誇張表現を避け、静かで説得力のある語り口
- 「最先端」「革新的」などの安易な表現は使わない
- 美術・VRの文脈に合った自然な文体

詳細は `docs/design-system.md` 参照。

## ページ一覧と担当コンテンツ

| ファイル | URL | 内容 |
|---|---|---|
| `pages/index.astro` | `/` | トップ（ja）。英語ブラウザ → `/en/` 自動リダイレクト |
| `pages/exhibitions.astro` | `/exhibitions/` | 常設4館詳細・VRChatリンク |
| `pages/artlink.astro` | `/artlink/` | ARTLINK 企画展 |
| `pages/news/index.astro` | `/news/` | ニュース一覧 |
| `pages/news/[slug].astro` | `/news/[slug]/` | ニュース詳細（Content Collections から自動生成） |
| `pages/media.astro` | `/media/` | メディア掲載一覧 |
| `pages/about.astro` | `/about/` | 美術館について |
| `pages/en/*.astro` | `/en/*` | 上記すべての英語版 |

## 常設館データ

| 番号 | 日本語名 | 英語名 | 状態 | VRChatワールドID |
|---|---|---|---|---|
| 01 | 天空美術館 | Sky Museum | 開館中 | `wrld_a272c878-...` |
| 02 | パラオ美術館 | Palau Museum | 開館中（パラオ大使館後援） | `wrld_5b5a1ca5-...` |
| 03 | 森美術館 | Forest Museum | 開館中 | `wrld_cc87c364-...` |
| 04 | 雨降る美術館 | Rain Museum | 開館中・リニューアル予定 | `wrld_ae3b767b-...` |

## SEO 設定

`src/components/BaseHead.astro` で管理。

- JSON-LD（Organization + Museum スキーマ）を全ページに埋め込み
- `hreflang="ja"` / `hreflang="en"` / `hreflang="x-default"` を全ページに設定
- `og:locale` は lang prop に応じて `ja_JP` / `en_US` を自動切り替え
- サイトマップ: `/weson-museum/sitemap-index.xml`（@astrojs/sitemap で自動生成）

## デプロイ

`main` ブランチへの push で GitHub Actions が自動ビルド・デプロイ。
設定ファイル: `.github/workflows/deploy.yml`

## 注意事項

- `--space-10` はデザイントークンに**存在しない**（`--space-8` または `--space-12` を使う）
- 英語ページの内部リンクは必ず `/en/*` を向けること
- `BaseLayout` に `lang="en"` を渡し忘れると nav リンクが日本語パスになる
- news の Content Collections は配列 JSON ではなく 1ファイル = 1記事の Markdown 形式
- Three.js の dynamic import パスは相対パス `'./three/GalleryScene'` を使う（絶対パス不可）
