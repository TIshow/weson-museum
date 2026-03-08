# WESON MUSEUM

VRで体験する現代アートの美術館、**WESON MUSEUM** の公式 Web サイトです。

- **公開URL**: https://TIshow.github.io/weson-museum/
- **英語版**: https://TIshow.github.io/weson-museum/en/
- **VRChat**: 天空・パラオ・森・雨降る の4常設館を運営
- **ARTLINK**: 複数作家によるVR総合美術展（年数回開催）

## 技術スタック

| 役割 | 技術 |
|------|------|
| フレームワーク | [Astro](https://astro.build/) v5 |
| ホスティング | GitHub Pages |
| パッケージ管理 | pnpm |
| ツールチェイン管理 | asdf (Node.js 24.9.0) |
| 言語 | TypeScript, HTML, CSS |
| 3D | Three.js（トップページギャラリー、Astro Islands） |
| 多言語 | Astro i18n（ja / en） |
| サイトマップ | @astrojs/sitemap |

## ページ構成

| URL | 内容 |
|-----|------|
| `/` | トップ（ヒーロー・3Dギャラリー・常設展・ARTLINK・メディア・VRツアー） |
| `/exhibitions/` | 常設4館の詳細・VRChatリンク |
| `/artlink/` | ARTLINK 企画展ページ |
| `/news/` | ニュース一覧 |
| `/news/[slug]/` | ニュース記事詳細 |
| `/media/` | メディア掲載一覧 |
| `/about/` | 美術館について |
| `/en/` | 英語版トップ（各ページ対応） |

## セットアップ

```bash
# ツールバージョンを合わせる
asdf install

# 依存関係インストール
pnpm install

# 開発サーバー起動 → http://localhost:4321
pnpm dev

# 本番ビルド → dist/
pnpm build

# ビルド結果をプレビュー
pnpm preview
```

## デプロイ

`main` ブランチへのプッシュで GitHub Actions が自動実行されます。

初回デプロイ時の設定：
1. GitHub リポジトリの **Settings > Pages > Source** を `GitHub Actions` に変更
2. `astro.config.mjs` の `site` を自分のユーザー名に変更

## ディレクトリ構成

```
weson-museum/
├── .github/workflows/deploy.yml   # GitHub Actions 自動デプロイ
├── docs/                          # 運用ドキュメント
├── public/
│   ├── favicon.svg
│   ├── images/
│   │   ├── museums/               # 各館の写真（4枚）
│   │   └── artworks/              # Three.js用作品画像（8枚）
│   └── video/tour_movie.mp4       # VR在廊ツアー動画
├── src/
│   ├── components/
│   │   ├── BaseHead.astro         # <head>・SEO・JSON-LD・hreflang
│   │   ├── Gallery.astro          # Three.js 3Dギャラリー（Islands）
│   │   ├── LanguageSwitcher.astro # JA/EN 言語切り替え
│   │   ├── MediaCard.astro        # メディア掲載カード
│   │   └── three/GalleryScene.ts  # Three.js 実装
│   ├── content/
│   │   ├── config.ts              # Content Collections スキーマ
│   │   └── news/                  # ニュース記事（Markdown）
│   ├── data/
│   │   └── media.json             # メディア掲載データ
│   ├── layouts/
│   │   └── BaseLayout.astro       # 共通レイアウト・ナビ・フッター
│   ├── pages/
│   │   ├── index.astro            # トップ（ja）
│   │   ├── about.astro
│   │   ├── artlink.astro
│   │   ├── exhibitions.astro
│   │   ├── media.astro
│   │   ├── news/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   └── en/                    # 英語版（全ページ対応）
│   │       ├── index.astro
│   │       ├── about.astro
│   │       ├── artlink.astro
│   │       ├── exhibitions.astro
│   │       ├── media.astro
│   │       └── news/index.astro
│   └── styles/
│       └── global.css             # デザイントークン・共通スタイル
├── astro.config.mjs
├── CLAUDE.md                      # AI開発ガイド
└── .tool-versions                 # asdf バージョン指定
```

## コンテンツ更新

### ニュース記事を追加する

`src/content/news/` に Markdown ファイルを追加するだけで自動的にページが生成されます。

```markdown
---
title: "記事タイトル"
description: "概要文"
pubDate: 2025-01-01
tags: ["ARTLINK", "開催報告"]
draft: false
---

本文...
```

### メディア掲載を追加する

`src/data/media.json` に追記します。`featured: true` にするとトップページに表示されます。

```json
{
  "outlet": "媒体名",
  "title": "記事タイトル",
  "date": "2025-01-01",
  "type": "web",
  "url": "https://...",
  "featured": false
}
```

## 多言語対応

- 日本語: `/`（デフォルト、プレフィックスなし）
- 英語: `/en/`
- 英語圏のブラウザでトップページを開くと `/en/` へ自動リダイレクト
- ナビに `JA｜EN` 切り替えボタンを設置

## ライセンス

&copy; WESON MUSEUM. All rights reserved.
