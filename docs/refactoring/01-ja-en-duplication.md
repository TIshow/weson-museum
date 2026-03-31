# [Refactor] ja/en ページ構造の大規模重複

**ステータス**: ✅ 完了（2026-04-01、commit 60b37f0、GitHub #4）
**優先度**: HIGH
**難易度**: 大
**影響ファイル数**: 12ファイル（6ペア）

## 何が問題か

日本語ページと英語ページがほぼコピー&ペーストで二重管理されている。
テキスト・リンクのロケール差を除けば、HTML 構造・CSS・ロジックは同一。

| ファイルペア | 重複率 |
|---|---|
| `src/pages/index.astro` vs `src/pages/en/index.astro` | ほぼ100% |
| `src/pages/exhibitions.astro` vs `src/pages/en/exhibitions.astro` | ほぼ100% |
| `src/pages/about.astro` vs `src/pages/en/about.astro` | ほぼ100% |
| `src/pages/artlink.astro` vs `src/pages/en/artlink.astro` | ほぼ100% |
| `src/pages/media.astro` vs `src/pages/en/media.astro` | 約95% |
| `src/pages/news/index.astro` vs `src/pages/en/news/index.astro` | 約90% |

## なぜ問題か

- **バグ修正・構造変更のコストが2倍**：片方を直してもう片方を忘れると乖離が起きる
- **実際にすでに乖離が発生している**：exhibition の anchor ID が ja/en で異なる（`museum-heading-{n}` vs `museum-{n}`）
- **CSS フォーマットが不統一**：英語版では一部 CSS が1行に圧縮されており、diff が読みにくい
- **スケールしない**：ページが増えるほど管理コストが線形増加する

## どう解決するか

### 方針：`lang` prop を受け取るシングルページコンポーネントに統合

各ページを「コンテンツオブジェクト」と「テンプレート」に分離する。

```
src/
  pages/
    index.astro          ← lang="ja" でコンポーネント呼び出し
    en/
      index.astro        ← lang="en" でコンポーネント呼び出し
  components/
    pages/
      HomePage.astro     ← 実際のレイアウトとロジック
      ExhibitionsPage.astro
      AboutPage.astro
      ...
```

### 実装例（index.astro）

```astro
---
// src/components/pages/HomePage.astro
interface Props { lang: 'ja' | 'en' }
const { lang } = Astro.props;

const t = {
  ja: {
    heroTitle: 'WESON MUSEUM',
    heroLead: 'VRChatで開かれた美術館',
    exhibitionsLink: '/exhibitions/',
    ...
  },
  en: {
    heroTitle: 'WESON MUSEUM',
    heroLead: 'A virtual art museum on VRChat',
    exhibitionsLink: '/en/exhibitions/',
    ...
  },
}[lang];
---
```

```astro
---
// src/pages/index.astro
import HomePage from '@components/pages/HomePage.astro';
---
<HomePage lang="ja" />
```

```astro
---
// src/pages/en/index.astro
import HomePage from '@components/pages/HomePage.astro';
---
<HomePage lang="en" />
```

### 注意点

- `BaseLayout` への `lang` prop 渡しは現状どおり維持する
- 各ページの CSS は `HomePage.astro` 内の `<style>` に集約する
- Issue #2（データ分離）と Issue #4（コンポーネント抽出）を先に完了させると、この作業がよりスムーズになる
