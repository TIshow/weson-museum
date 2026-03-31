# [Refactor] CSS の重複を global.css に統合

**ステータス**: ✅ 完了（2026-03-31、GitHub #6）
**優先度**: MEDIUM
**難易度**: 小
**影響ファイル数**: 6ファイル以上

## 何が問題か

`.breadcrumb`、`.cta-block`、`.section-layout` といった共通 UI パターンの CSS が、
ページごとの `<style>` ブロックにコピーされ続けている。

### パターン1：`.breadcrumb`（6ファイル以上に重複）

以下のスタイルが `exhibitions.astro`、`about.astro`、`artlink.astro`、
および各 `en/` 版に全く同じ内容で存在する。

```css
.breadcrumb ol {
  list-style: none;
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-wide);
  color: var(--color-text-subtle);
  margin-bottom: var(--space-12);
}

.breadcrumb li + li::before {
  content: '/';
  margin-right: var(--space-2);
  color: var(--color-border-bright);
}

.breadcrumb a { color: var(--color-text-subtle); }
.breadcrumb a:hover { color: var(--color-main); }
```

### パターン2：`.cta-block` 関連（4ページ以上に重複）

```css
.cta-divider { width: 40px; height: 1px; background: var(--color-border-bright); }
.cta-lead    { color: var(--color-text-muted); margin-bottom: var(--space-8); }
.cta-links   { display: flex; flex-wrap: wrap; gap: var(--space-4); }
.cta-link-sub { font-size: var(--text-sm); color: var(--color-text-subtle); }
```

### パターン3：`.section-layout`（4ページに重複）

```css
.section-layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: var(--space-16);
  align-items: start;
}
```

`about.astro`、`artlink.astro`、`en/about.astro`、`en/artlink.astro` に存在。

## なぜ問題か

- デザイントークンを変更しても、このスタイルブロックは `global.css` とは別管理のため変更漏れが起きる
- パンくずのホバー色を変えたい場合、6ファイルを修正する必要がある
- コードレビューで差分が埋もれやすい

## どう解決するか

### 方針：`src/styles/global.css` に共通クラスとして追加

Astro の `<style>` はコンポーネントスコープのため、`global.css` に書くことで全ページに適用される。

```css
/* src/styles/global.css に追加 */

/* ---- Breadcrumb ---- */
.breadcrumb ol {
  list-style: none;
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-wide);
  color: var(--color-text-subtle);
  margin-bottom: var(--space-12);
}
.breadcrumb li + li::before {
  content: '/';
  margin-right: var(--space-2);
  color: var(--color-border-bright);
}
.breadcrumb a { color: var(--color-text-subtle); }
.breadcrumb a:hover { color: var(--color-main); }

/* ---- CTA Block ---- */
.cta-divider { width: 40px; height: 1px; background: var(--color-border-bright); margin-block: var(--space-8); }
.cta-lead    { color: var(--color-text-muted); margin-bottom: var(--space-8); }
.cta-links   { display: flex; flex-wrap: wrap; gap: var(--space-4); }

/* ---- Section Layout ---- */
.section-layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: var(--space-16);
  align-items: start;
}
@media (max-width: 768px) {
  .section-layout { grid-template-columns: 1fr; }
}
```

各ページの `<style>` ブロックから該当箇所を削除する。

### 注意点

- `<style>` ブロック内のクラスは Astro のスコープ CSS のため、
  `global.css` に移す場合はクラス名の衝突がないか確認する
- ページ固有の上書きが必要な場合は `:where(.page-name) .breadcrumb` などで対応する
- `section-layout` の `220px` カラム幅はページによって異なる可能性があるため、移行前に全ページの実装を確認する
