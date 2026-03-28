# [Fix] ja/en 間の不整合修正

**優先度**: LOW
**難易度**: 小
**影響ファイル数**: 4ファイル

## 問題一覧

### 問題1：exhibitions の anchor ID が ja/en で不一致

**ファイル**:
- `src/pages/exhibitions.astro`（line 70）
- `src/pages/en/exhibitions.astro`（line 70）

```html
<!-- 日本語版 -->
<h2 id={`museum-heading-${m.num}`} class="museum-ja">{m.ja}</h2>

<!-- 英語版 -->
<h2 id={`museum-${m.num}`} class="museum-name">{m.en}</h2>
```

**影響**: `index.astro` のリンクが `#museum-01` 形式でアンカーしているため、
日本語版 exhibitions の対応セクションへのジャンプが機能しない。

**修正方法**:
```html
<!-- 両ファイルで統一 -->
<h2 id={`museum-${m.num}`}>...</h2>
```

---

### 問題2：`en/media.astro` の不要な型アサション

**ファイル**: `src/pages/en/media.astro`（line 6）

```ts
// 英語版（不要な型アサション）
const sorted = (mediaData as any[]).slice()...

// 日本語版（型推論が正しく効いている）
const sorted = mediaData.slice()...
```

**原因**: TypeScript の型推論がなぜか英語版だけで失敗している。
おそらく import 文の違いが原因。

**修正方法**: 日本語版と同じ import 文に揃える。型アサションは削除する。

---

### 問題3：`en/news/index.astro` の `any` 型アノテーション

**ファイル**: `src/pages/en/news/index.astro`（lines 5, 8）

```ts
// 英語版（不必要な any）
const allNews = await getCollection('news', ({ data }: any) => !data.draft);
const sorted = allNews.sort(
  (a: any, b: any) => b.data.pubDate.getTime() - a.data.pubDate.getTime()
);

// 日本語版（型推論が正しく効いている）
const allNews = await getCollection('news', ({ data }) => !data.draft);
const sorted = allNews.sort(
  (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime()
);
```

**修正方法**: `any` を除去し、日本語版と同じコードに揃える。

---

### 問題4：CSS ブレークポイントの混在

**現状**: ページによってレスポンシブブレークポイントが異なる。

| ページ | ブレークポイント |
|---|---|
| `index.astro`（media grid） | `900px` |
| `exhibitions.astro` | `768px` |
| `about.astro` | `768px` |
| `artlink.astro` | `768px` |
| `news/[slug].astro` | `640px` |
| その他 | `640px` |

**修正方法**: `src/styles/global.css` の `:root` にブレークポイントを定義して統一する。

```css
/* global.css に追加 */
:root {
  --bp-sm: 640px;
  --bp-md: 768px;
}
```

ただし、CSS カスタムプロパティは `@media` クエリの中では直接使えないため、
コメントによる規約定義か、Sass 変数（未使用）への移行が必要になる。
現実的な対応は「768px に統一する」というコーディング規約をドキュメントに記載すること。

---

## まとめ

| # | 修正内容 | ファイル | 工数 |
|---|---|---|---|
| 1 | anchor ID を `museum-{num}` に統一 | exhibitions.astro | 5分 |
| 2 | `as any[]` を削除 | en/media.astro | 5分 |
| 3 | `any` 型アノテーションを削除 | en/news/index.astro | 5分 |
| 4 | ブレークポイント規約を docs に記載 | docs/ | 10分 |
