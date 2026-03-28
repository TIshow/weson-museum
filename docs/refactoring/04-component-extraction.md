# [Refactor] 共通 Astro コンポーネントの抽出

**優先度**: MEDIUM
**難易度**: 中
**影響ファイル数**: 4〜8ファイル

## 何が問題か

複数ページで同一の HTML 構造が inline で繰り返されており、
コンポーネント化されていない。

### パターン1：MuseumCard

`src/pages/index.astro` と `src/pages/en/index.astro` の両方で
美術館カードグリッドのロジックと HTML が重複している。

```js
// ロジック（両ファイルで同一）
const topPageOrder = ['01', '03', '02', '04'];
const museums = topPageOrder.map((num, i) => {
  const m = museumsData.find(x => x.num === num)!;
  return { ...m, displayNum: String(i + 1).padStart(2, '0'), anchor: `museum-${m.num}` };
});
```

```html
<!-- HTML（両ファイルで同一、リンク先パスのみ異なる）-->
<a href={`/exhibitions/#${m.anchor}`} class="museum-card">
  <div class="museum-img-wrap">
    <img src={...} alt={m.ja} loading="lazy" decoding="async" />
    <div class="museum-overlay">
      <span class="museum-num mono-label">{m.displayNum}</span>
      <div class="museum-names">
        <span class="museum-name-ja">{m.ja}</span>
        <span class="museum-name-en mono-label">{m.en}</span>
      </div>
    </div>
  </div>
</a>
```

### パターン2：SectionHeader（アクセントライン + 見出し）

5ページ以上で以下の構造が繰り返されている。

```html
<div class="section-header">
  <span class="accent-line"></span>
  <div>
    <h2 class="section-title">{title}</h2>
    <p class="section-sub mono-label">{subtitle}</p>
  </div>
</div>
```

### パターン3：ValueCard グリッド

`about.astro` と `artlink.astro` の両方で以下のカードパターンが使われている。

```html
<ul class="value-list">
  {values.map(v => (
    <li class="value-item">
      <span class="value-num mono-label">{v.num}</span>
      <h3 class="value-en">{v.en}</h3>
      <p class="value-ja mono-label">{v.ja}</p>
      <p class="value-body">{v.body}</p>
    </li>
  ))}
</ul>
```

## なぜ問題か

- カードの見た目を変えたい場合、複数ファイルを手動で同期修正する必要がある
- `MuseumCard` のリンク先パスが ja/en で異なり、バグの温床になっている
  （実際に `exhibitions.astro` の anchor ID が ja/en で不一致になっている）
- テストや Storybook 等でコンポーネント単体を確認できない

## どう解決するか

### 1. `src/components/MuseumCard.astro`

```astro
---
interface Props {
  museum: { num: string; ja: string; en: string };
  displayNum: string;
  lang: 'ja' | 'en';
}
const { museum, displayNum, lang } = Astro.props;
const base = import.meta.env.BASE_URL;
const prefix = lang === 'en' ? '/en' : '';
---
<a href={`${prefix}/exhibitions/#museum-${museum.num}`} class="museum-card">
  <div class="museum-img-wrap">
    <img
      src={`${base}images/museums/museum${museum.num}.jpg`}
      alt={museum.ja}
      loading="lazy"
      decoding="async"
    />
    <div class="museum-overlay">
      <span class="museum-num mono-label">{displayNum}</span>
      <div class="museum-names">
        <span class="museum-name-ja">{museum.ja}</span>
        <span class="museum-name-en mono-label">{museum.en}</span>
      </div>
    </div>
  </div>
</a>
```

### 2. `src/components/SectionHeader.astro`

```astro
---
interface Props {
  title: string;
  sub?: string;
}
const { title, sub } = Astro.props;
---
<div class="section-header">
  <span class="accent-line"></span>
  <div>
    <h2 class="section-title">{title}</h2>
    {sub && <p class="section-sub mono-label">{sub}</p>}
  </div>
</div>
```

### 注意点

- `MuseumCard` を先に作ることで、Issue #1（ja/en 統合）の実装がしやすくなる
- Issue #3（CSS 統合）と合わせて、カードの CSS も `MuseumCard.astro` 内の `<style>` に集約する
- `SectionHeader` は汎用性が高いため、prop の設計を慎重に行う
