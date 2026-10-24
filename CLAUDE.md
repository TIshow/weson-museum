# CLAUDE.md — WESON MUSEUM 開発ガイド

このファイルは Claude Code がこのリポジトリで作業する際のコンテキストと規約を定めます。

## プロジェクト概要

WESON MUSEUM の公式 Web サイト。VRChat 上に開かれた美術館のサイトで、GitHub Pages で静的ホスティングされています。

- **公開URL**: https://weson-museum.com/
- **ベースパス**: `/`（カスタムドメイン）
- **言語**: 日本語（デフォルト）/ 英語（`/en/`）

## 技術スタック

- **Astro v5** — 静的サイト生成、Content Collections、Islands Architecture
- **pnpm** — パッケージマネージャ（`npm` は使わない）
- **asdf** — Node.js バージョン管理（`.tool-versions` 参照）

pnpm のバージョンは `package.json` の `packageManager` で固定している（**単一の情報源**）。
pnpm 10 以降は自身がこの値を読んで自動的にそのバージョンへ切り替えるため、
グローバルに別のメジャーバージョンが入っていても揃う。
CI の `pnpm/action-setup` も同じ値を読むので、ワークフロー側に `version:` は書かない。

- バージョンを上げるときは `packageManager` を書き換えるだけでよい
- ただし **lockfileVersion が変わるメジャーバージョンへ上げるときは `pnpm-lock.yaml` の再生成が要る**（現在 9.0）
- Node 25 は corepack を同梱していないため、corepack 経由の強制はかからない
- **Three.js** — トップページの3Dギャラリー（dynamic import で遅延ロード）
- **@astrojs/sitemap** — サイトマップ自動生成

## コマンド

```bash
pnpm dev      # 開発サーバー起動（http://localhost:4321）
pnpm check    # 型チェック（astro check）
pnpm build    # 本番ビルド（dist/ に出力）
pnpm preview  # ビルド結果のプレビュー
```

**`pnpm build` は型チェックをしない。** 型エラーはビルドを素通りするので、
`pnpm check` を別途走らせること。CI では build の前段で実行している。
i18n 辞書の翻訳漏れ検出はこのステップに依存しているため、外すと保証が消える。

## アーキテクチャの重要事項

### ベースパスと URL

すべてのアセット・内部リンクは `import.meta.env.BASE_URL` または絶対パス `/weson-museum/` を使うこと。

```astro
<!-- 正しい -->
<img src={`${import.meta.env.BASE_URL}images/foo.jpg`} />
<a href="/about/">About</a>

<!-- 間違い -->
<img src="/images/foo.jpg" />
```

### 多言語（i18n）

Astro i18n を使用。`defaultLocale: 'ja'`、`prefixDefaultLocale: false`。

- 日本語ページ: `src/pages/*.astro` → URL `/`
- 英語ページ: `src/pages/en/*.astro` → URL `/en/`
- `BaseLayout` に `lang="en"` を渡すことで HTML lang・nav リンク・フッターリンクが自動切り替え
- 言語スイッチャーは `LanguageSwitcher.astro` が `LOCALES` から自動生成

```astro
<!-- 英語ページは必ず lang="en" を渡す -->
<BaseLayout title="..." lang="en">
```

**ロケール定義と UI 文字列は `src/i18n/` に集約する。**

| ファイル | 役割 |
|---|---|
| `src/i18n/config.ts` | `LOCALES` / `LOCALE_META` / `localizedPath()` / `pick()` / `formatDate()` |
| `src/i18n/ui.ts` | UI 文字列の辞書（`UIStrings` 型）と `useTranslations(lang)` |

```astro
---
import { localizedPath, type Locale } from '@i18n/config';
import { useTranslations } from '@i18n/ui';

interface Props { lang: Locale }
const { lang } = Astro.props;
const t = useTranslations(lang);
---
<a href={localizedPath(lang, '/artists/')}>{t.nav.artists}</a>
```

新規ページに `isEn ? A : B` を書かないこと。書くと言語追加のたびに全ページを触ることになる。
`UIStrings` にキーを足せば、未翻訳のロケールは `pnpm check` で型エラーとして検出される。

`LOCALES` にロケールを1つ足すと、更新が必要な箇所が型エラーで列挙される
（`LOCALE_META` / `ui.ts` の辞書 / `content/config.ts` の `i18nText`）。
hreflang・`og:locale:alternate`・言語スイッチャー・nav は `LOCALES` から自動生成されるので手当て不要。

既存ページ（Home / About / Exhibitions / ARTLINK / Media / News）はまだ `isEn` 三項が残っている。
コピー刷新のタイミングで `src/i18n/ui.ts` へ移すこと。

言語を増やす手順は `docs/artists-content.md` の「言語を追加する」を参照。

### コンテンツ管理

**ニュース記事**: `src/content/news/*.md`（Astro Content Collections）

```markdown
---
title: "タイトル"
description: "概要"
pubDate: 2025-01-01
tags: ["タグ"]
draft: false
---
```

**メディア掲載**: `src/data/media.json`（配列形式、Content Collections ではない）

```json
{ "outlet": "媒体名", "title": "...", "date": "2025-01-01", "type": "web", "url": "https://...", "featured": false }
```

`featured: true` にするとトップページの Press & Media セクションに最大3件表示される（件数は `config.json` の `maxFeaturedMedia`）。

読み出しは `src/lib/media.ts` の `sortedMedia()` / `featuredMedia(n)` を使う。
media.json は Content Collections ではなく zod 検証が走らないため、
このモジュールが `type` の値をビルド時に検証している。JSON を直接 import しないこと。

**作家（ARTLINK ARTISTS）**: `src/content/artists/*.yaml`（Content Collections、`type: 'data'`）

作家1人＝1ファイル。作品は同ファイルの `works` 配列に持たせる。
翻訳が必要なフィールドは `{ ja: '...', en: '...' }` の形で書き、`ja` のみ必須。

```yaml
name:
  ja: 田中 花子
  en: Hanako Tanaka
draft: false
works:
  - id: w01
    title: { ja: 作品名, en: Title }
    availability: available
    price: 380000
```

- 呼称は **`ARTLINK ARTISTS` / 「参加作家」** で統一する。契約条件が確定するまで「所属作家」は使わない
- `draft` の既定は `true`。実データを確認してから `false` にする
- 価格は静的サイトの出力に載る。公開したくない価格は `price` に書かず `priceOnRequest: true` を使う
- スキーマ全体と運用手順は `docs/artists-content.md` を参照

**ARTLINK の開催回**: `src/content/artlink/<年>.yaml`（Content Collections、`type: 'data'`）

1回＝1ファイル、ファイル名の年がそのまま URL（`2026.yaml` → `/artlink/2026/`）。
`/artlink/` は企画全体の紹介ページで、ここには回ごとの詳細を書かない。
トップの ARTLINK バナーと `/artlink/` の「最新回」は、開始日が最も新しい回から自動で出る。

- 日付・時刻は **JST の文字列**（`'2026-11-01'` `'21:00'`）で書く。クォートを外すと YAML が日付型にして検証に落ちる
- 静的サイトなので「開催中」「終了」のような時刻依存の表示は出さない。会期前の注意書きは `notice` に書き、会期が終わったら消す
- 長い開催報告は news 記事を正とし、回のファイルからは `reportSlug` / `announcementSlug` で参照する。存在しない slug はビルドで落ちる
- 参加作家名の記録がない回は `artistCount` に人数だけ書く。読みが確認できない名前は `en` を書かない
- 回を追加する手順（会期前）: `<年>.yaml` を作る → 告知記事を news / news-en に書いて `announcementSlug` を設定
- 会期後: `notice` を消す → 報告記事を書いて `reportSlug` を設定

### Three.js ギャラリー

`src/components/Gallery.astro` + `src/components/three/GalleryScene.ts`

- IntersectionObserver でビューポートに入ったときだけ初期化（遅延ロード）
- `initGallery(canvas, basePath)` を dynamic import で呼び出す
- 作品画像: `public/images/artworks/artwork1.jpg` 〜 `artwork8.jpg`

## デザインシステム

`src/styles/global.css` にデザイントークンを定義。

| トークン | 値 | 用途 |
|---|---|---|
| `--color-main` | `#34b2aa` | テール（メインカラー） |
| `--color-accent` | `#fcfa0a` | 電気イエロー（アクセント） |
| `--color-bg` | `#050b0a` | 背景 |
| `--font-mono` | JetBrains Mono 系 | サイバーパンク的ラベル |

テーマ: **「高貴な美術館空間 × VR サイバーパンクの光」**

- 宣伝調・誇張表現を避け、静かで説得力のある語り口
- 「最先端」「革新的」などの安易な表現は使わない
- 美術・VRの文脈に合った自然な文体

詳細は `docs/design-system.md` 参照。

## ページ一覧と担当コンテンツ

| ファイル | URL | 内容 |
|---|---|---|
| `pages/index.astro` | `/` | トップ（ja）。英語ブラウザ → `/en/` 自動リダイレクト |
| `pages/artists/index.astro` | `/artists/` | 参加作家一覧（ARTLINK ARTISTS） |
| `pages/artists/[slug].astro` | `/artists/[slug]/` | 作家詳細（Content Collections から自動生成） |
| `pages/exhibitions.astro` | `/exhibitions/` | 常設4館詳細・VRChatリンク |
| `pages/artlink.astro` | `/artlink/` | ARTLINK 企画展 |
| `pages/artlink/[year].astro` | `/artlink/[year]/` | ARTLINK の各回（会期・会場・参加作家・在廊・報告。Content Collections から自動生成） |
| `pages/news/index.astro` | `/news/` | ニュース一覧 |
| `pages/news/[slug].astro` | `/news/[slug]/` | ニュース詳細（Content Collections から自動生成） |
| `pages/media.astro` | `/media/` | メディア掲載一覧 |
| `pages/about.astro` | `/about/` | 美術館について |
| `pages/en/*.astro` | `/en/*` | 上記すべての英語版 |

## 常設館データ

| 番号 | 日本語名 | 英語名 | 状態 | VRChatワールドID |
|---|---|---|---|---|
| 01 | 天空美術館 | Sky Museum | 開館中 | `wrld_a272c878-...` |
| 02 | パラオ美術館 | Palau Museum | 開館中（パラオ大使館後援） | `wrld_5b5a1ca5-...` |
| 03 | 森美術館 | Forest Museum | 開館中 | `wrld_cc87c364-...` |
| 04 | 雨降る美術館 | Rain Museum | 開館中・リニューアル予定 | `wrld_ae3b767b-...` |

## SEO 設定

`src/components/BaseHead.astro` で管理。

- JSON-LD（Organization + Museum スキーマ）を全ページに埋め込み
- `hreflang="ja"` / `hreflang="en"` / `hreflang="x-default"` を全ページに設定
- `og:locale` は lang prop に応じて `ja_JP` / `en_US` を自動切り替え
- サイトマップ: `/weson-museum/sitemap-index.xml`（@astrojs/sitemap で自動生成）

## デプロイ

`main` ブランチへの push で GitHub Actions が自動ビルド・デプロイ。
設定ファイル: `.github/workflows/deploy.yml`

## 注意事項

- `--space-10` はデザイントークンに**存在しない**（`--space-8` または `--space-12` を使う）
- 英語ページの内部リンクは必ず `/en/*` を向けること
- `BaseLayout` に `lang="en"` を渡し忘れると nav リンクが日本語パスになる
- news の Content Collections は配列 JSON ではなく 1ファイル = 1記事の Markdown 形式
- artists は news と違い `type: 'data'` の YAML（Markdown ではない）。作品も同じファイルに入れる
- 作家画像は `portrait`（3:4 縦）と `coverImage`（4:3 横）の**両方**を用意する。片方だけだと一覧か詳細のどちらかで切れる
- Three.js の dynamic import パスは相対パス `'./three/GalleryScene'` を使う（絶対パス不可）

### CSS クラス名と広告ブロッカー

**`ad-` で始まるクラス名は絶対に使わない。** EasyList（uBlock Origin / AdBlock / AdGuard /
Brave の標準フィルタ）が `##.ad-hero` `##.ad-section` `##.ad-links` などを汎用ルールとして
持っており、該当する要素は**利用者の画面から消える**。HTML には存在するので curl や
拡張機能なしのブラウザでは再現せず、原因の特定が難しい。

過去に作家詳細ページで `ad-`（artist detail の略）を使い、本番でプロフィールが
丸ごと非表示になる不具合を起こしている。現在は `artist-` に統一済み。

`ads-` `advert` `sponsor` `banner` `promo` なども同種のリスクがある。
新しいプレフィックスを導入するときは、ビルド後に照合すること。

```bash
curl -s https://easylist.to/easylist/easylist.txt -o /tmp/easylist.txt
grep -rhoE 'class="[^"]*"' dist --include='*.html' \
  | sed 's/class="//; s/"//' | tr ' ' '\n' | sed 's/^\s*//' \
  | grep -E '^[a-zA-Z]' | sort -u > /tmp/site-classes.txt
grep -E '^##\.[a-zA-Z0-9_-]+$' /tmp/easylist.txt | sed 's/^##\.//' | sort -u > /tmp/el.txt
comm -12 /tmp/site-classes.txt /tmp/el.txt   # 出力があれば衝突
```
