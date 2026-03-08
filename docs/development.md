# 開発ガイド

日常的な開発フローと規約をまとめます。

## 日常の開発フロー

```bash
# 1. 最新の main を取得
git pull origin main

# 2. 作業ブランチを切る
git checkout -b feature/page-exhibitions

# 3. 開発サーバーを起動
pnpm dev

# 4. 変更を加えてビルドが通ることを確認
pnpm build

# 5. コミット・プッシュ
git add -p
git commit -m "feat: 展示一覧ページを追加"
git push origin feature/page-exhibitions

# 6. Pull Request を作成して main にマージ
```

## ブランチ運用

| ブランチ名パターン | 用途 |
|-------------------|------|
| `main` | 本番（GitHub Pages にデプロイされる） |
| `feature/<名前>` | 新機能追加 |
| `fix/<名前>` | バグ修正 |
| `content/<名前>` | 記事・コンテンツのみの変更 |
| `docs/<名前>` | ドキュメントのみの変更 |

- `main` への直接プッシュは避ける（小さい修正は例外として許容）
- 大きな変更は必ず PR を経由する

## コミットメッセージ規約

[Conventional Commits](https://www.conventionalcommits.org/) に準じる:

```
feat:     新機能
fix:      バグ修正
content:  記事・展示コンテンツの追加・更新
docs:     ドキュメントのみの変更
style:    スタイル（見た目）の変更
refactor: リファクタリング
chore:    ツール・設定の変更
```

例:
```
feat: 展示一覧ページを追加
content: 2025年 Spring Exhibition の記事を追加
fix: モバイルでナビゲーションが崩れる問題を修正
```

## ファイル追加の考え方

### ページを追加する

`src/pages/` 以下にファイルを作るだけで URL が生成されます。

```
src/pages/about.astro        → /about/
src/pages/exhibitions/index.astro → /exhibitions/
src/pages/exhibitions/[slug].astro → /exhibitions/<slug>/
```

### コンポーネントを追加する

`src/components/` 以下に `.astro` ファイルを作成します。
1ファイル = 1コンポーネントを基本とします。

```
src/components/
├── BaseHead.astro          # <head> 共通
├── ArticleCard.astro       # 記事カード
├── ExhibitionCard.astro    # 展示カード
└── ThreeScene.astro        # 将来: Three.js シーン
```

### スタイルを追加する

- グローバルに使うトークン（色・フォント・スペース）は `src/styles/global.css` の CSS カスタムプロパティに追加する
- コンポーネント固有のスタイルは `.astro` ファイルの `<style>` タグ内に書く（スコープが自動的に限定される）
- 外部 CSS ライブラリ（Tailwind 等）は今のところ導入しない

### 記事・コンテンツを追加する

詳細は [content-strategy.md](content-strategy.md) を参照してください。

## 3D 実装（Three.js）を追加するとき

> 現時点では未着手です。将来的に特定の展示ページに Three.js を導入する予定です。

追加時の注意点:

1. **Islands として追加する**: Astro の `client:load` または `client:visible` ディレクティブを使い、Three.js は必要なページ・コンポーネントだけで動かす。全ページに Three.js を読み込まない。
2. **静的ページを壊さない**: Three.js なしでも意味のあるコンテンツが表示されるようにする（プログレッシブエンハンスメント）。
3. **SEO を壊さない**: 展示の説明テキストは HTML に直接書く。3D ビューアはあくまで補助的な表現。
4. **パフォーマンス**: Three.js は重いので `import` は動的に（`import()` を使う）、かつ `client:visible` で遅延ロードする。

詳細は [docs/architecture.md](architecture.md#three-js-導入計画) を参照してください。

## SEO を壊さない実装原則

- ページタイトル（`<title>`）と説明（`<meta name="description">`）を必ず設定する
- `BaseHead.astro` コンポーネントを通じて一元管理する
- 重要なテキストコンテンツは JavaScript に依存しない HTML として出力する
- URL に日本語は使わない（スラッグは英数字・ハイフンのみ）
- 画像には必ず `alt` 属性を付ける
- 見出し階層（h1 → h2 → h3）を正しく使う（h1 は1ページ1つ）
- `canonical` URL を必ず設定する（`BaseHead.astro` で自動設定済み）

## コードフォーマット

```bash
# フォーマット実行
pnpm exec prettier --write src/

# フォーマット確認のみ（CI 用）
pnpm exec prettier --check src/
```

設定は `.prettierrc` を参照してください。
