# [Refactor] 共通 Astro コンポーネントの抽出

**ステータス**: 🔲 未着手（GitHub #7）
**優先度**: MEDIUM
**難易度**: 中

## 現状（Issue #4 完了後の更新）

Issue #4（ja/en ページ統合）の完了により、MuseumCard の重複は解消された。
各共有コンポーネント（`src/components/pages/`）の中にはまだ繰り返しパターンが残っており、
それらをさらに個別コンポーネントに切り出すことが本 Issue の対象。

## 残っている繰り返しパターン

### パターン1：ValueCard グリッド

`AboutPage.astro` の "What we value" と `ArtlinkPage.astro` の "ARTLINKがつなぐもの" で
同一構造のカードグリッドが使われている。

```html
<li class="value-item / connect-item">
  <span class="value-num / connect-num mono-label">{v.num}</span>
  <h3 class="value-en / connect-en">{v.en}</h3>
  <p class="value-ja / connect-ja mono-label">{v.ja}</p>
  <p class="value-body / connect-body">{v.body}</p>
</li>
```

クラス名だけ違うが CSS は同一。共通の `ValueCard.astro` にまとめられる。

### パターン2：SectionHeader（アクセントライン + 見出し）

複数のページコンポーネントで以下の構造が繰り返されている。

```html
<div class="section-header">
  <span class="accent-line"></span>
  <div>
    <h2>...</h2>
  </div>
</div>
```

`SectionHeader.astro` として抽出し、`title` prop を渡す形にできる。
ただし sticky の `section-aside` パターンと混在しているため注意が必要。

### パターン3：MuseumCard（HomePage 内）

`HomePage.astro` の museum-card HTML はコンポーネント化されていない。
現状は1ファイル内に閉じているため緊急度は低いが、将来的には抽出したい。

## 解決方針

### `src/components/ValueCard.astro`

```astro
---
interface Props {
  num: string;
  en: string;
  ja: string;
  body: string;
}
const { num, en, ja, body } = Astro.props;
---
<li class="value-card">
  <span class="value-num mono-label">{num}</span>
  <h3 class="value-en">{en}</h3>
  <p class="value-ja mono-label">{ja}</p>
  <p class="value-body">{body}</p>
</li>
```

CSS は `global.css` に `.value-card` として統合。

### 注意点

- CSS クラス名の統一が必要（`value-item` と `connect-item` を一本化）
- `SectionHeader` は sticky／non-sticky の両パターンがあるため、prop か slot で吸収する
- 無理にすべてコンポーネント化しなくてもよい。繰り返しが3箇所以上あるものを優先する
