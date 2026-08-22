# 作家コンテンツ（ARTLINK ARTISTS）

作家ページのデータ構造と運用手順。

- 一覧: `/artists/` — `src/components/pages/ArtistsIndexPage.astro`
- 詳細: `/artists/[slug]/` — `src/components/pages/ArtistDetailPage.astro`
- 英語版は `/en/artists/*`。ページ実装は共通で、`lang` prop だけが違う。

呼称は **英語表記 `ARTLINK ARTISTS` / 日本語本文「参加作家」** に統一する。
契約条件と支援範囲が確定するまで「所属作家」は使わない。

## ファイルの置き場所

```
src/content/artists/<slug>.yaml
```

ファイル名がそのまま URL の slug になる（`tanaka-hanako.yaml` → `/artists/tanaka-hanako/`）。
一度公開した slug は変えないこと。変えるとリンクと検索結果が切れる。

`type: 'data'` のコレクションなので、拡張子は `.yaml`（または `.json`）。Markdown ではない。
作品は作家ファイル内の `works` 配列に持たせる。作家1人＝1ファイルで完結する。

## 多言語の持ち方

翻訳が必要なフィールドは、言語コードをキーにしたオブジェクトで書く。

```yaml
name:
  ja: 田中 花子
  en: Hanako Tanaka
```

`ja` は必須。他の言語は任意で、未翻訳なら `ja` にフォールバックして表示される。
つまり**英語が未整備でもページは壊れない**が、英語圏の買い手には日本語が出る。
公開前に `name` / `statement` / `works[].title` の `en` は埋めておくこと。

## フィールド一覧

| フィールド | 必須 | 内容 |
|---|---|---|
| `name` | ✓ | 表示名（多言語） |
| `nameReading` | | ふりがな。一覧の並び順に使う |
| `order` | | 並び順。小さいほど先（既定 999） |
| `featured` | | トップページなどで優先表示する想定のフラグ |
| `draft` | | **既定 true**。実データを確認してから `false` にする |
| `portrait` | | 作家写真。`/images/artists/xxx.jpg` のように書く |
| `coverImage` | | 一覧カード用。未指定なら portrait → 最初の作品画像の順で拾う |
| `based` | | 拠点（多言語） |
| `birthYear` | | 生年（数値） |
| `disciplines` | | 分野・技法の配列（多言語） |
| `affiliations` | | 所属団体の配列（多言語） |
| `statement` | | 制作の背景。作家自身の言葉を想定（多言語） |
| `bio` | | 経歴（多言語） |
| `exhibitionHistory` | | 展示歴。`year` / `title` / `venue` / `kind` |
| `upcoming` | | 今後の展示。`title` / `venue` / `startDate` / `endDate` / `url` / `note` |
| `works` | | 作品の配列（下記） |
| `links` | | `website` / `x` / `instagram` / `booth` / `note` / `youtube` / `other`。URL 形式で検証される |
| `vrResidency` | | VR在廊に立てるか。true なら一覧カードと詳細にバッジが出る |

### works（作品）

| フィールド | 必須 | 内容 |
|---|---|---|
| `id` | ✓ | 作家内で一意（`w01` など）。将来 CRM 側の作品IDと突き合わせる |
| `title` | ✓ | 作品名（多言語） |
| `year` | | 制作年。**文字列で書く**（`'2025'`） |
| `medium` | | 技法・素材（多言語） |
| `dimensions` | | `910 × 727 mm` のように表記そのまま |
| `image` | | 作品画像 |
| `availability` | | `available` / `reserved` / `sold` / `not-for-sale` / `inquire`（既定 `inquire`） |
| `price` | | 円。数値で書く（`380000`） |
| `priceOnRequest` | | true にすると価格を出さず「価格応相談」と表示する |
| `edition` | | `ed. 30` など |
| `exhibitedAt` | | 展示実績の文字列配列（`ARTLINK 2025` など） |

`availability` と価格は独立している。`available` でも `priceOnRequest: true` なら価格は伏せられる。

`available` / `reserved` / `sold` の作品には schema.org の `Offer` が出力される。
`price` を書いた `available` の作品だけが、検索エンジンに価格つきで拾われる。
**公開したくない価格は `price` に書かないこと。** 静的サイトなので出力はすべて公開情報になる。

### 日付

`startDate` / `endDate` はクォートせずに書く（`2026-11-07`）。
クォートすると文字列として扱われて検証に落ちる。

## 作家を追加する

1. `src/content/artists/<slug>.yaml` を作る
2. `name` と `draft: true` だけでも保存できる（他は任意）
3. `pnpm dev` で `/artists/` と `/artists/<slug>/` を確認する
   - `draft: true` のあいだは一覧にも詳細にも出ない。確認したいときは一時的に `false` にする
4. 英語（`en`）を埋める
5. `draft: false` にして公開

## 言語を追加する

パリ・ドバイ・上海に向けて仏語・アラビア語・中国語を足す場合の手順。
**実際に相手が現れてから足すこと**。翻訳の維持コストは言語ごとに継続的に発生する。

1. `src/i18n/config.ts` の `LOCALES` に追加する
2. `pnpm check` を走らせる。**更新が必要な箇所が型エラーとして列挙される**
   - `src/i18n/config.ts` の `LOCALE_META`（アラビア語は `dir: 'rtl'`）
   - `src/i18n/ui.ts` の辞書
   - `src/content/config.ts` の `i18nShape`
3. `src/pages/<locale>/` にページを追加（既存の `src/pages/en/` をそのまま複製し、`lang` を変えるだけ）
4. `astro.config.mjs` の `i18n.locales` に追加
5. 各作家 YAML の翻訳キーを埋める（未翻訳は ja にフォールバックするので段階的でよい）

hreflang、`og:locale:alternate`、言語スイッチャー、nav・フッターのリンクは
`LOCALES` から自動生成されるので、手を入れる必要はない。

ページ本体に `isEn ? A : B` を書かないこと。書くと言語追加のたびに全ページを触ることになる。
文字列は必ず `useTranslations(lang)` 経由で取る。

## 画像の作り方

置き場所は `public/images/artists/`。ファイル名は slug に合わせる。

| フィールド | 用途 | 比率 | 推奨サイズ |
|---|---|---|---|
| `portrait` | 詳細ページのヒーロー（最大 320px 幅で表示） | 3:4 縦位置 | 750 × 1000 |
| `coverImage` | 一覧カード（4:3 の枠に `object-fit: cover`） | 4:3 横位置 | 1200 × 900 |

**両方を用意すること。** `coverImage` が無いと `portrait` が 4:3 の枠にはめられ、頭が切れる。
逆に `portrait` が無いと横位置画像が 3:4 に切られて左右が落ちる。

元画像が1枚しかない場合は、被写体を中心に2通りの比率で切り出す。
`sips` は中心固定でしか切れないので、被写体が中央にない写真は Pillow などでオフセット指定して切る。

公開前に **EXIF を落とす**こと（撮影地の位置情報が残っていることがある）。
Pillow は `exif` を渡さずに `save()` すれば残らない。

```bash
python3 -c "
from PIL import Image, ImageOps
im = ImageOps.exif_transpose(Image.open('src.jpg')).convert('RGB')
W, H = im.size
cx = 900                      # 被写体の中心 x
def crop(rw, rh, ow, oh, out):
    cw = min(round(H * rw / rh), W)
    left = max(0, min(round(cx - cw / 2), W - cw))
    im.crop((left, 0, left + cw, H)).resize((ow, oh), Image.LANCZOS) \
      .save(out, 'JPEG', quality=86, optimize=True, progressive=True)
crop(3, 4, 750, 1000, 'public/images/artists/<slug>.jpg')
crop(4, 3, 1200, 900, 'public/images/artists/<slug>-cover.jpg')
"
```
