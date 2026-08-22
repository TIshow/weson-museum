import { DEFAULT_LOCALE, type Locale } from './config';

/**
 * UI 文字列の型。ロケールを追加すると、埋めていないキーが型エラーになる。
 * 「言語追加＝データ追加」を成立させるための要。
 */
export interface UIStrings {
  nav: {
    artists: string;
    exhibitions: string;
    news: string;
    media: string;
    about: string;
    contact: string;
    homeAria: string;
    footerAria: string;
    socialAria: string;
    goods: string;
    tagline: string;
  };
  common: {
    home: string;
    breadcrumbAria: string;
    langAria: string;
  };
  artists: {
    eyebrow: string;
    title: string;
    subline: string;
    lead: string[];
    metaTitle: string;
    metaDescription: string;
    empty: string;
    gridAria: string;

    /** 一覧・詳細で共通のラベル */
    based: string;
    disciplines: string;
    affiliations: string;
    vrResidency: string;
    vrResidencyNote: string;

    /** 詳細ページのセクション見出し */
    sectionStatement: string;
    sectionWorks: string;
    sectionExhibitions: string;
    sectionUpcoming: string;
    sectionLinks: string;
    sectionInquiry: string;

    worksNote: string;
    exhibitionsEmpty: string;
    backToIndex: string;

    /** 販売ステータス */
    availability: {
      available: string;
      reserved: string;
      sold: string;
      'not-for-sale': string;
      inquire: string;
    };
    priceOnRequest: string;

    /** 展示歴の種別 */
    exhibitionKind: {
      solo: string;
      group: string;
      vr: string;
      award: string;
      other: string;
    };

    /** 一覧ページ末尾の導線 */
    ctaArtistTitle: string;
    ctaArtistBody: string;
    ctaArtistButton: string;
    ctaInquiryTitle: string;
    ctaInquiryBody: string;
    ctaInquiryButton: string;

    /** 詳細ページの問い合わせボタン（遷移先は contact ページ） */
    inquiryButton: string;
  };
}

const ja: UIStrings = {
  nav: {
    artists: 'Artists',
    exhibitions: 'Exhibitions',
    news: 'News',
    media: 'Media',
    about: 'About',
    contact: 'Contact',
    homeAria: 'WESON MUSEUM ホームへ',
    footerAria: 'フッターナビゲーション',
    socialAria: 'SNS・外部リンク',
    goods: 'Official Goods',
    tagline: 'Virtual Reality Art Museum',
  },
  common: {
    home: 'Home',
    breadcrumbAria: 'パンくずリスト',
    langAria: 'Language / 言語',
  },
  artists: {
    eyebrow: 'ARTLINK ARTISTS',
    title: '参加作家',
    subline: '作品と、その先にある関係',
    lead: [
      'WESON MUSEUM は、作家の活動を継続的に紹介し、国内外の鑑賞者や購入を検討する人とつなぐ取り組みを続けています。ここに掲載しているのは、その取り組みをともにしている作家です。',
      '展示は接点のひとつであって、終わりではありません。作品の記録、英語での紹介、購入や制作依頼の窓口を、展示の前後にわたって引き受けています。',
    ],
    metaTitle: '参加作家 — WESON MUSEUM',
    metaDescription:
      'WESON MUSEUM / ARTLINK に参加する作家の一覧です。作品、制作の背景、展示歴、購入可能な作品、今後の展示をまとめています。',
    empty: '公開準備中です。',
    gridAria: '参加作家一覧',

    based: '拠点',
    disciplines: '分野',
    affiliations: '所属',
    vrResidency: 'VR在廊あり',
    vrResidencyNote: 'VR空間での在廊に立ち、鑑賞者と直接話す機会を設けています。',

    sectionStatement: '制作について',
    sectionWorks: '作品',
    sectionExhibitions: '展示歴',
    sectionUpcoming: '今後の展示',
    sectionLinks: 'リンク',
    sectionInquiry: 'お問い合わせ',

    worksNote: '購入・制作依頼のご相談は、下記よりご連絡ください。',
    exhibitionsEmpty: '記録を準備中です。',
    backToIndex: '← 参加作家一覧へ',

    availability: {
      available: '購入可',
      reserved: '商談中',
      sold: '売約済',
      'not-for-sale': '非売品',
      inquire: '応相談',
    },
    priceOnRequest: '価格応相談',

    exhibitionKind: {
      solo: '個展',
      group: 'グループ展',
      vr: 'VR展示',
      award: '受賞',
      other: 'その他',
    },

    ctaArtistTitle: '作家の方へ',
    ctaArtistBody:
      '作品の紹介、記録、英語での発信、購入や依頼の窓口をお引き受けしています。まずは作品を見せていただくところから始めます。',
    ctaArtistButton: '参加について相談する',
    ctaInquiryTitle: '作品をお探しの方へ',
    ctaInquiryBody:
      '個人での購入、店舗や宿泊施設への設置、企業コレクション、展示企画など、目的に応じて作家と作品をご紹介します。',
    ctaInquiryButton: '作品について問い合わせる',

    inquiryButton: 'この作家について問い合わせる',
  },
};

const en: UIStrings = {
  nav: {
    artists: 'Artists',
    exhibitions: 'Exhibitions',
    news: 'News',
    media: 'Media',
    about: 'About',
    contact: 'Contact',
    homeAria: 'WESON MUSEUM home',
    footerAria: 'Footer navigation',
    socialAria: 'Social and external links',
    goods: 'Official Goods',
    tagline: 'Virtual Reality Art Museum',
  },
  common: {
    home: 'Home',
    breadcrumbAria: 'Breadcrumb',
    langAria: 'Language / 言語',
  },
  artists: {
    eyebrow: 'ARTLINK ARTISTS',
    title: 'Artists',
    subline: 'The work, and the relationships beyond it',
    lead: [
      'WESON MUSEUM introduces artists on an ongoing basis and connects them with viewers and prospective buyers in Japan and abroad. The artists listed here work with us on that basis.',
      'An exhibition is one point of contact, not an endpoint. We take on the documentation of the work, its introduction in English, and the handling of purchase and commission inquiries — before and after any show.',
    ],
    metaTitle: 'Artists — WESON MUSEUM',
    metaDescription:
      'Artists working with WESON MUSEUM and ARTLINK. Works, background, exhibition history, available pieces, and upcoming shows.',
    empty: 'Coming soon.',
    gridAria: 'List of artists',

    based: 'Based in',
    disciplines: 'Practice',
    affiliations: 'Affiliations',
    vrResidency: 'VR gallery talks',
    vrResidencyNote:
      'This artist attends the VR space in person, speaking directly with visitors in front of the work.',

    sectionStatement: 'On the work',
    sectionWorks: 'Works',
    sectionExhibitions: 'Exhibitions',
    sectionUpcoming: 'Upcoming',
    sectionLinks: 'Links',
    sectionInquiry: 'Inquiries',

    worksNote: 'For purchases and commissions, please get in touch below.',
    exhibitionsEmpty: 'Records are being compiled.',
    backToIndex: '← All artists',

    availability: {
      available: 'Available',
      reserved: 'Reserved',
      sold: 'Sold',
      'not-for-sale': 'Not for sale',
      inquire: 'Inquire',
    },
    priceOnRequest: 'Price on request',

    exhibitionKind: {
      solo: 'Solo',
      group: 'Group',
      vr: 'VR',
      award: 'Award',
      other: 'Other',
    },

    ctaArtistTitle: 'For artists',
    ctaArtistBody:
      'We take on the introduction and documentation of your work, its presentation in English, and the handling of purchase and commission inquiries. It starts with seeing the work.',
    ctaArtistButton: 'Talk to us about joining',
    ctaInquiryTitle: 'Looking for work',
    ctaInquiryBody:
      'Private purchases, installations for shops and hotels, corporate collections, curated shows — tell us the purpose and we will introduce the artists and the work.',
    ctaInquiryButton: 'Inquire about works',

    inquiryButton: 'Inquire about this artist',
  },
};

const dictionaries: Record<Locale, UIStrings> = { ja, en };

export function useTranslations(lang: Locale): UIStrings {
  return dictionaries[lang] ?? dictionaries[DEFAULT_LOCALE];
}
