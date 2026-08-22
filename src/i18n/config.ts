/**
 * 対応ロケールの単一の情報源。
 *
 * 言語を追加するときに触るのは、このファイルと辞書（ui.ts）だけで済むようにしてある。
 *
 *   1. LOCALES に追加する
 *   2. LOCALE_META にエントリを追加する
 *   3. src/i18n/ui.ts の各辞書にキーを追加する（漏れは型エラーで分かる）
 *   4. src/content/config.ts の i18nText にキーを追加する
 *   5. src/pages/<locale>/ にページを追加する
 *   6. astro.config.mjs の i18n.locales に追加する
 *
 * ページ側に `isEn ? A : B` を書かないこと。増やすと言語追加のたびに全ページを触ることになる。
 */

export const LOCALES = ['ja', 'en'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'ja';

export interface LocaleMeta {
  /** 言語スイッチャーに出す短いラベル */
  label: string;
  /** html lang 属性 */
  htmlLang: string;
  /** og:locale */
  ogLocale: string;
  /** 書字方向。アラビア語を足すときは 'rtl' */
  dir: 'ltr' | 'rtl';
  /** Intl.DateTimeFormat に渡すロケール */
  dateLocale: string;
}

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  ja: { label: 'JA', htmlLang: 'ja', ogLocale: 'ja_JP', dir: 'ltr', dateLocale: 'ja-JP' },
  en: { label: 'EN', htmlLang: 'en', ogLocale: 'en_US', dir: 'ltr', dateLocale: 'en-US' },
};

/**
 * ロケール非依存のパス（例 '/artists/'）を、そのロケールの実際のパスに変換する。
 * デフォルトロケールは prefix を付けない（prefixDefaultLocale: false）。
 */
export function localizedPath(lang: Locale, path = '/'): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return lang === DEFAULT_LOCALE ? clean : `/${lang}${clean}`;
}

/** 実際のパスからロケール prefix を外して、ロケール非依存のパスに戻す。 */
export function stripLocale(pathname: string): string {
  for (const locale of LOCALES) {
    if (locale === DEFAULT_LOCALE) continue;
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      return pathname.slice(locale.length + 1) || '/';
    }
  }
  return pathname;
}

/** URL から現在のロケールを判定する。 */
export function getLangFromUrl(url: URL): Locale {
  const segment = url.pathname.split('/')[1];
  const match = LOCALES.find(locale => locale !== DEFAULT_LOCALE && locale === segment);
  return match ?? DEFAULT_LOCALE;
}

/**
 * コンテンツ側の多言語テキスト。ja は必須、それ以外は任意。
 * 未翻訳のロケールでは ja にフォールバックする。
 */
export type I18nText = Partial<Record<Locale, string>> & { ja: string };

/** 多言語テキストから、そのロケールの文字列を取り出す（無ければ ja）。 */
export function pick(text: I18nText, lang: Locale): string;
export function pick(text: I18nText | undefined, lang: Locale): string | undefined;
export function pick(text: I18nText | undefined, lang: Locale): string | undefined {
  if (!text) return undefined;
  return text[lang] ?? text[DEFAULT_LOCALE];
}

/** 多言語テキストの配列をまとめて解決する。 */
export function pickAll(texts: I18nText[] | undefined, lang: Locale): string[] {
  return (texts ?? []).map(text => pick(text, lang));
}

/** そのロケールの表記で日付を整形する。 */
export function formatDate(date: Date, lang: Locale): string {
  return date.toLocaleDateString(LOCALE_META[lang].dateLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
