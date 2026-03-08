# AI との協業ガイド

Claude Code や他の AI ツールに作業を依頼するための前提事項と規約をまとめます。

## このドキュメントの目的

このリポジトリは AI による補助開発を積極的に活用します。
AI が正しく文脈を把握してコードや文書を変更できるよう、
ルールとコンテキストを明文化します。

## 最初に AI に伝えるべきこと

AI に作業を依頼するときは、以下を冒頭で共有してください:

```
このリポジトリは WESON MUSEUM の公式 Web サイトです。
- フレームワーク: Astro v5（静的サイト生成）
- ホスティング: GitHub Pages
- パッケージ管理: pnpm
- 詳細は docs/ 以下のドキュメントを参照
```

## コード変更のルール

### やって良いこと

- `src/` 以下のファイルを追加・変更する
- `docs/` の内容を更新・補足する
- `public/` に静的ファイルを追加する
- `src/content/` に記事・展示の Markdown を追加する

### 確認が必要なこと

- `astro.config.mjs` の変更（`site` / `base` は環境依存）
- `package.json` への依存関係追加（重い依存は避ける方針）
- `src/content/config.ts` のスキーマ変更（既存コンテンツに影響する）
- `.github/workflows/` の変更（デプロイフローに影響）

### やってはいけないこと

- `main` ブランチへの直接 force push
- `.env` への秘密情報の書き込みとコミット
- 理由なく依存パッケージを大量に追加する
- スキーマ変更で既存の Markdown ファイルが壊れる変更

## ドキュメント更新ルール

以下の変更を行った場合は、対応するドキュメントも必ず更新してください:

| 変更内容 | 更新すべきドキュメント |
|----------|----------------------|
| 新しいページを追加 | `README.md`（ディレクトリ構成）、`docs/development.md` |
| 依存関係を追加 | `README.md`（技術スタック）、`docs/setup.md` |
| URL 設計を変更 | `docs/content-strategy.md` |
| 新しいコンポーネント規約 | `docs/development.md` |
| セットアップ手順が変わる | `docs/setup.md` |
| 大きなアーキテクチャ変更 | `docs/architecture.md` |

## 大きな変更時の進め方

大きな変更（フレームワーク変更・ルーティング再設計・Three.js 導入など）は:

1. `docs/architecture.md` または新しい `docs/` ファイルに**変更の理由と設計を先に書く**
2. 設計を確認してから実装を進める
3. 変更後に README とドキュメントを更新する

## AI へのヒント

- コンポーネントは `src/components/*.astro`、ページは `src/pages/*.astro`
- コンテンツのスキーマは `src/content/config.ts` で定義されている
- スタイルは CSS カスタムプロパティ（`global.css` の `:root`）を使う
- Three.js は将来的に Astro Islands（`client:visible`）として特定ページに限定して導入する
- GitHub Pages のサブパス（`/weson-museum`）を意識したリンクは `Astro.url.base` または相対パスを使う

## よくある AI の失敗パターン

- `import` パスに `@components/` エイリアスを使わず相対パスを使ってしまう（`tsconfig.json` でエイリアス設定済み）
- GitHub Pages のサブパスを無視した絶対パスを書く（`/images/foo.jpg` → `${base}/images/foo.jpg` にする）
- draft 記事をビルドに含めてしまう（フィルタリングが必要）
- Three.js を `<script>` タグで直接読み込んでしまう（必ず Island コンポーネントにする）
