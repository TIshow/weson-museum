# アーキテクチャ設計メモ

WESON MUSEUM Web サイトの技術構成とその背景をまとめます。

## なぜ Astro を選んだか

### 要件と Astro の適合性

| 要件 | Astro での対応 |
|------|---------------|
| GitHub Pages（静的配信） | `output: 'static'` で完全静的 HTML を生成 |
| SEO | 初期 HTML に全コンテンツが含まれる（クライアント JS 不要） |
| 記事・アーカイブ管理 | Content Collections で Markdown をスキーマ管理 |
| Three.js の将来導入 | Islands Architecture で一部コンポーネントのみ JS を動かせる |
| 保守しやすさ | 設定が少なく、標準的なファイルベースルーティング |
| 0円運用 | 依存が軽量、外部サービス不要 |

### 検討した代替案

| 候補 | 見送った理由 |
|------|-------------|
| Next.js | GitHub Pages との相性が悪い（`output: 'export'` に制限あり）。機能が過剰 |
| Nuxt.js | Next.js と同様の懸念。Vue のエコシステムが必要でない |
| Hugo | Markdown 管理は良いが Three.js の統合が難しい。テンプレート言語が独特 |
| 11ty (Eleventy) | シンプルで良いが、TypeScript や Islands のサポートが弱い |
| 純粋な HTML/CSS | 将来のコンテンツ拡張・コンポーネント再利用が困難 |

Astro は「デフォルトゼロ JS・必要な部分だけ JS」という思想が
このプロジェクトの「SEO + 3D の両立」という目標に最も合致します。

## ディレクトリ設計の方針

```
src/content/    ← コンテンツレイヤー（Markdown で管理）
src/pages/      ← ルーティングレイヤー（URL に対応）
src/layouts/    ← テンプレートレイヤー（共通レイアウト）
src/components/ ← UIレイヤー（再利用部品）
src/styles/     ← スタイルレイヤー（CSS カスタムプロパティ中心）
public/         ← 静的ファイル（ビルドをバイパスして配信）
```

この分離により、コンテンツ担当とコード担当が独立して作業できます。

## Three.js 導入計画

### 方針: Islands として限定的に導入

Three.js は全ページに読み込まず、特定の展示ページの特定エリアのみで動かします。

```astro
<!-- src/pages/exhibitions/[slug].astro -->
{exhibition.data.sceneId && (
  <ThreeScene client:visible sceneId={exhibition.data.sceneId} />
)}
```

`client:visible` を使うことで、ビューポートに入ったときだけ Three.js がロードされます。

### 実装予定の構成

```
src/components/
└── three/
    ├── ThreeScene.astro      # Island ラッパー
    ├── ThreeScene.ts         # Three.js 本体ロジック
    └── scenes/
        └── weson-2025-01.ts  # 展示ごとのシーン定義
```

### SEO との両立

- Three.js シーンは補助的な表現にとどめる
- 展示の説明・タイトルは必ず通常の HTML テキストとして出力する
- `<noscript>` に代替コンテンツを用意する

## GitHub Pages 制約下での注意点

1. **サーバーサイド処理は不可**: API Routes、SSR、Server Actions は使えない
2. **リダイレクトが制限的**: `_redirects` は非対応。リダイレクトは静的ページ（meta refresh）で対応
3. **サブパス配信**: デフォルトでは `/<リポジトリ名>` がベースになる。リンクは相対パスか Astro のパス補助を使う
4. **`CNAME` ファイル**: カスタムドメイン使用時は `public/CNAME` に配置（デプロイ時に自動でルートに置かれる）

## 将来の記事機能の育て方

### フェーズ 1（現在）: 手動 Markdown 管理

- `src/content/news/` に Markdown ファイルを直接コミット
- GitHub の Web UI からも編集可能

### フェーズ 2（将来）: 記事管理の改善

- 記事数が増えたら年別ディレクトリで整理（`src/content/news/2025/`）
- ページネーションを実装

### フェーズ 3（オプション）: Headless CMS

- 記事が月10件以上になったら Headless CMS（Contentful, Notion API など）を検討
- Astro は Content Layer API で外部データソースと統合できる
- ただし、API キーの管理と GitHub Actions のシークレット設定が必要

## Python の位置づけ

Python は現時点で必須ではありません。

将来的に以下のユースケースで `scripts/` 以下に Python スクリプトを追加する可能性があります:

- **画像の一括リサイズ・WebP 変換**: `Pillow` を使ったバッチ処理
- **記事メタデータの集計**: 記事数・タグ一覧の生成
- **外部サービスからのデータ取得**: 展示情報の自動インポートなど

Python を使う場合は `uv` で仮想環境を管理し、Node.js 側とは独立して動かします。
Node.js 側（Astro）はビルドとフロントエンドの責務のみを持ちます。

## SEO と 3D を両立する原則

1. **コンテンツファースト**: HTML テキストを主、Three.js ビジュアルを副とする
2. **プログレッシブエンハンスメント**: JS なし・低スペック端末でも情報が取得できる
3. **Core Web Vitals への配慮**: Three.js の遅延ロード、適切なローディング表示
4. **構造化データ（JSON-LD）**: 将来的に `ExhibitionEvent` や `Article` の Schema.org マークアップを追加することでリッチリザルトを狙える
