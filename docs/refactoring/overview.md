# リファクタリング概要

このドキュメントは、コードベース全体の調査（2026-03-28）で特定された技術的負債と改善点をまとめたものです。
各項目は個別の GitHub Issue として管理されます。

## 問題一覧と優先度

| # | Issue | 優先度 | 難易度 |
|---|---|---|---|
| 1 | [ja/en ページ構造の大規模重複](./01-ja-en-duplication.md) | HIGH | 大 |
| 2 | [インラインデータの JSON ファイル分離](./02-inline-data-extraction.md) | MEDIUM | 小 |
| 3 | [CSS の重複を global.css に統合](./03-css-duplication.md) | MEDIUM | 小 |
| 4 | [共通 Astro コンポーネントの抽出](./04-component-extraction.md) | MEDIUM | 中 |
| 5 | [ja/en 間の不整合修正](./05-minor-inconsistencies.md) | LOW | 小 |

## 着手順の考え方

Issue 2（データ分離）と Issue 3（CSS統合）は独立した小さな変更であり、
副作用が少ないため最初に着手しやすい。

Issue 1（ja/en 重複解消）は最大の効果があるが、影響範囲が広いため
Issue 2〜4 を先に完了させてから取り組むことを推奨する。

Issue 5 は小さな不整合修正で、いつでも着手できる。
