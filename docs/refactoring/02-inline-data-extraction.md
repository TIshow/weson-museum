# [Refactor] インラインデータの JSON ファイル分離

**ステータス**: ✅ 完了（2026-03-31、GitHub #5）
**優先度**: MEDIUM
**難易度**: 小
**影響ファイル数**: 4ファイル（2ペア）

## 何が問題か

ページコンポーネントのフロントマターに、コンテンツ配列がハードコードされている。
同じデータが日本語版・英語版の2ファイルにコピーされており、更新時に同期漏れが起きやすい。

### about.astro / en/about.astro

```js
// src/pages/about.astro（lines 4–36）と src/pages/en/about.astro に同じ構造
const values = [
  { num: '01', en: 'Art in virtual space', ja: 'VR空間での展示', body: '...' },
  { num: '02', en: 'Open to all',          ja: '誰でも入れる',   body: '...' },
  { num: '03', en: 'Free of charge',       ja: '入場無料',       body: '...' },
  { num: '04', en: 'Boundaries dissolved', ja: '境界を越える',   body: '...' },
];

const ahead = [
  { label: '展示アーカイブ', body: '...' },
  // ...
];
```

### artlink.astro / en/artlink.astro

```js
// src/pages/artlink.astro（lines 6–36）と src/pages/en/artlink.astro に同じ構造
const connections = [
  { num: '01', title: 'Artists', body: '...' },
  // ...
];

const archives = [
  { year: '2024', worldId: 'wrld_...', label: 'ARTLINK 2024' },
  // ...
];
```

### index.astro のマジックナンバー

```js
// src/pages/index.astro と en/index.astro の両方
const topPageOrder = ['01', '03', '02', '04'];  // 表示順のハードコード
const featuredMedia = mediaData.filter(...).slice(0, 3);  // 上限3件のハードコード
```

## なぜ問題か

- `values` や `connections` の内容を修正するには 2 ファイルを同時に編集する必要がある
- `archives`（ARTLINK開催記録）は年ごとに追加されるが、2ファイルへの追加を強いられる
- マジックナンバーは設定変更時に複数ファイルを探して修正する必要がある

## どう解決するか

### 1. `src/data/about.json` を作成

```json
{
  "values": [
    { "num": "01", "en": "Art in virtual space", "ja": "VR空間での展示", "body": "..." },
    { "num": "02", "en": "Open to all",           "ja": "誰でも入れる",   "body": "..." },
    { "num": "03", "en": "Free of charge",        "ja": "入場無料",       "body": "..." },
    { "num": "04", "en": "Boundaries dissolved",  "ja": "境界を越える",   "body": "..." }
  ],
  "ahead": [
    { "label": "展示アーカイブ", "labelEn": "Exhibition Archive", "body": "..." }
  ]
}
```

### 2. `src/data/artlink.json` を作成

```json
{
  "connections": [
    { "num": "01", "titleJa": "アーティスト", "titleEn": "Artists", "body": "..." }
  ],
  "archives": [
    { "year": "2024", "worldId": "wrld_...", "labelJa": "ARTLINK 2024", "labelEn": "ARTLINK 2024" }
  ]
}
```

### 3. `src/data/config.json` を作成（マジックナンバー管理）

```json
{
  "homepageMuseumOrder": ["01", "03", "02", "04"],
  "maxFeaturedMedia": 3
}
```

### 4. ページコンポーネントでインポート

```astro
---
import aboutData from '@/data/about.json';
const { values, ahead } = aboutData;
---
```

### 注意点

- `body` テキストは日英共通で1つのフィールドか、`bodyJa` / `bodyEn` に分けるか、実際のデータ内容を見て判断する
- `archives` は今後も追加されるため、JSON 化の恩恵が大きい
