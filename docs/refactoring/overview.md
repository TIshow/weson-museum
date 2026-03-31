# リファクタリング概要

このドキュメントは、コードベース全体の調査（2026-03-28）で特定された技術的負債と改善点をまとめたものです。
各項目は個別の GitHub Issue として管理されます。

## 問題一覧と進捗

| # | Issue | 優先度 | 難易度 | 状態 |
|---|---|---|---|---|
| 1 | [ja/en ページ構造の大規模重複](./01-ja-en-duplication.md) | HIGH | 大 | ✅ 完了（#4） |
| 2 | [インラインデータの JSON ファイル分離](./02-inline-data-extraction.md) | MEDIUM | 小 | ✅ 完了（#5） |
| 3 | [CSS の重複を global.css に統合](./03-css-duplication.md) | MEDIUM | 小 | ✅ 完了（#6） |
| 4 | [共通 Astro コンポーネントの抽出](./04-component-extraction.md) | MEDIUM | 中 | 🔲 残存（#7） |
| 5 | [ja/en 間の不整合修正](./05-minor-inconsistencies.md) | LOW | 小 | ✅ 完了（#8） |

## 残課題

Issue #7（共通コンポーネント抽出）のみ未着手。
ja/en統合（Issue #4）が完了したため、MuseumCard の重複は `HomePage.astro` 内に限定された。
ValueCard パターン（about/artlink）・SectionHeader パターンが主な対象。
