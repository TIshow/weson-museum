# WESON MUSEUM

VRで体験する現代アートの美術館、**WESON MUSEUM** の公式 Web サイトです。

GitHub Pages で無料公開しており、将来的に記事投稿・展示アーカイブ・Three.js による 3D 表現を予定しています。

## 技術スタック

| 役割 | 技術 |
|------|------|
| フレームワーク | [Astro](https://astro.build/) v5 |
| ホスティング | GitHub Pages |
| パッケージ管理 | pnpm |
| ツールチェイン管理 | asdf |
| 言語 | TypeScript, HTML, CSS |
| 将来予定 | Three.js（一部ページに Islands として導入） |

**Astro を選んだ理由:**
- 静的 HTML を生成するため GitHub Pages と相性が良い
- Markdown / MDX でコンテンツ（記事・展示）を管理できる
- Islands Architecture により、静的ページの一部だけに Three.js などの JS を挿入できる
- SEO に強い（完全な HTML が初期レスポンスに含まれる）
- 設定が少なく保守しやすい

詳細な技術選定の背景は [docs/architecture.md](docs/architecture.md) を参照してください。

## セットアップ手順

詳細は [docs/setup.md](docs/setup.md) を参照してください。

```bash
# asdf でツールバージョンを合わせる
asdf install

# 依存関係インストール
pnpm install

# 開発サーバー起動
pnpm dev
```

## 開発サーバー起動

```bash
pnpm dev
# http://localhost:4321 で起動
```

## ビルド

```bash
pnpm build
# dist/ に静的ファイルが生成される

pnpm preview
# ビルド結果をローカルでプレビュー
```

## GitHub Pages へのデプロイ

`main` ブランチへのプッシュで GitHub Actions が自動実行されます。

初回デプロイ前に GitHub リポジトリの設定が必要です:
1. **Settings > Pages > Source** で `GitHub Actions` を選択
2. `astro.config.mjs` の `site` と `base` を自分のリポジトリに合わせて変更

カスタムドメインを使う場合は [docs/setup.md](docs/setup.md#カスタムドメイン設定) を参照してください。

## ディレクトリ構成

```
weson-museum/
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions 自動デプロイ
├── docs/                     # プロジェクト運用ドキュメント
│   ├── setup.md              # 初回セットアップ手順
│   ├── development.md        # 日常開発フロー
│   ├── content-strategy.md   # コンテンツ運用方針
│   ├── ai-collaboration.md   # AI との協業ルール
│   └── architecture.md       # 技術構成の設計メモ
├── public/                   # 静的ファイル（そのまま配信）
│   └── favicon.svg
├── scripts/                  # ビルド補助スクリプト置き場
├── src/
│   ├── components/           # 再利用可能な UI 部品
│   │   └── BaseHead.astro    # <head> タグ共通コンポーネント
│   ├── content/              # Astro Content Collections
│   │   ├── config.ts         # コレクション定義（スキーマ）
│   │   ├── news/             # ニュース記事（Markdown）
│   │   └── exhibitions/      # 展示情報（Markdown）
│   ├── layouts/              # ページ共通レイアウト
│   │   └── BaseLayout.astro
│   ├── pages/                # URL に対応するページファイル
│   │   └── index.astro       # トップページ
│   └── styles/
│       └── global.css        # グローバルスタイル
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── .editorconfig
├── .gitignore
├── .prettierrc
└── .tool-versions            # asdf バージョン指定
```

## 今後の予定

- [ ] トップページのデザイン実装
- [ ] 展示一覧ページ（`/exhibitions/`）
- [ ] ニュース一覧・詳細ページ（`/news/`）
- [ ] About ページ（`/about/`）
- [ ] Three.js による 3D ビューア（一部展示ページ）
- [ ] サイトマップ自動生成（`@astrojs/sitemap`）
- [ ] OG 画像の自動生成
- [ ] 独自ドメイン設定

## ライセンス

&copy; WESON MUSEUM. All rights reserved.
