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
    sectionProfile: string;
    sectionWorks: string;
    /** 履歴は作家履歴書の慣例にあわせて3区分で出す */
    sectionCareer: string;
    sectionSolo: string;
    sectionGroup: string;
    sectionUpcoming: string;
    sectionLinks: string;
    sectionInquiry: string;

    worksNote: string;
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
  /** ARTLINK の開催回ブロック。年・日付は src/lib/artlink.ts から埋めるので、ここには書かない */
  artlinkEdition: {
    /** 回ごとのページ */
    eyebrow: string;
    period: string;
    venue: string;
    hours: string;
    format: string;
    formatVr: string;
    formatHybrid: string;
    admission: string;
    talks: string;
    artists: string;
    /** {n} = 人数 */
    artistCount: string;
    organizer: string;
    enterButton: string;
    records: string;
    announcementLink: string;
    reportLink: string;
    previous: string;
    next: string;
    backToProgram: string;
    /** 回のページのセクション（お祭りイベント風の構成） */
    jumpSchedule: string;
    sectionNavAria: string;
    scheduleKicker: string;
    scheduleHeading: string;
    scheduleLead: string;
    weekdays: string[];
    legendPeriod: string;
    legendTalk: string;
    outsidePeriod: string;
    talkLabel: string;
    talkJoin: string;
    /** 時刻の注記（en のみ JST を添える） */
    timeZoneNote: string;
    statusLive: string;
    statusPast: string;
    statusToday: string;
    artistsKicker: string;
    artistsHeading: string;
    artistsOrder: string;
    artistPage: string;
    howtoKicker: string;
    howtoHeading: string;
    /** body の {search} にワールド検索名が入る */
    howtoSteps: { title: string; body: string }[];
    infoKicker: string;
    infoHeading: string;
    recordsKicker: string;
    /** /artlink/ の最新回案内とアーカイブ */
    latestEyebrow: string;
    /** {title} = 「ARTLINK 2026」 */
    viewEdition: string;
    archiveIntro: string;
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

    sectionProfile: 'プロフィール',
    sectionWorks: '作品',
    sectionCareer: '経歴',
    sectionSolo: '個展',
    sectionGroup: '団体・グループ展',
    sectionUpcoming: '今後の展示',
    sectionLinks: 'リンク',
    sectionInquiry: 'お問い合わせ',

    worksNote: '購入・制作依頼のご相談は、下記よりご連絡ください。',
    backToIndex: '← 参加作家一覧へ',

    availability: {
      available: '購入可',
      reserved: '商談中',
      sold: '売約済',
      'not-for-sale': '非売品',
      inquire: '応相談',
    },
    priceOnRequest: '価格応相談',


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
  artlinkEdition: {
    eyebrow: 'Group VR Art Exhibition',
    period: '会期',
    venue: '会場',
    hours: '開場',
    format: '形式',
    formatVr: 'VR（VRChat）',
    formatHybrid: 'VR とリアル会場のハイブリッド',
    admission: '入場料',
    talks: '作家在廊',
    artists: '参加作家',
    artistCount: '{n}名',
    organizer: '主催',
    enterButton: 'VRChat で会場を開く',
    records: '記録',
    announcementLink: '開催のお知らせ',
    reportLink: '開催報告',
    previous: '前の回',
    next: '次の回',
    backToProgram: '← ARTLINK について',
    jumpSchedule: 'スケジュールを見る',
    sectionNavAria: 'このページの内容',
    scheduleKicker: 'Schedule',
    scheduleHeading: '作家在廊スケジュール',
    scheduleLead: '会期中、参加作家が VR 会場に在廊して作品解説を行います。作品の前で、作家に直接質問できます。',
    weekdays: ['日', '月', '火', '水', '木', '金', '土'],
    legendPeriod: '会期',
    legendTalk: '作家在廊',
    outsidePeriod: '会期外',
    talkLabel: '作家在廊・作品解説',
    talkJoin: '会場へ',
    timeZoneNote: '',
    statusLive: '開催中',
    statusPast: '終了',
    statusToday: '本日',
    artistsKicker: 'Artists',
    artistsHeading: '参加作家',
    artistsOrder: '50音順',
    artistPage: '作家ページ',
    howtoKicker: 'How to Join',
    howtoHeading: '参加方法',
    howtoSteps: [
      { title: 'VRChat にログイン', body: 'VRChat（無料）をインストールし、アカウントでログインします。' },
      { title: '会場ワールドを開く', body: '「VRChat で会場を開く」から開くか、ワールド検索で「{search}」と検索します。' },
      { title: '会場を歩いて鑑賞する', body: 'アバターの姿で会場を巡ります。在廊の日時に来ると、作家から直接作品の話を聞けます。' },
    ],
    infoKicker: 'Information',
    infoHeading: '開催概要',
    recordsKicker: 'Records',
    latestEyebrow: '最新回',
    viewEdition: '{title} を見る',
    archiveIntro: '各回の会期・会場・参加作家・在廊・報告を、年ごとのページにまとめています。',
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

    sectionProfile: 'Profile',
    sectionWorks: 'Works',
    sectionCareer: 'Career',
    sectionSolo: 'Solo Exhibitions',
    sectionGroup: 'Group Exhibitions',
    sectionUpcoming: 'Upcoming',
    sectionLinks: 'Links',
    sectionInquiry: 'Inquiries',

    worksNote: 'For purchases and commissions, please get in touch below.',
    backToIndex: '← All artists',

    availability: {
      available: 'Available',
      reserved: 'Reserved',
      sold: 'Sold',
      'not-for-sale': 'Not for sale',
      inquire: 'Inquire',
    },
    priceOnRequest: 'Price on request',


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
  artlinkEdition: {
    eyebrow: 'Group VR Art Exhibition',
    period: 'Dates',
    venue: 'Venue',
    hours: 'Hours',
    format: 'Format',
    formatVr: 'VR (VRChat)',
    formatHybrid: 'Hybrid: VR and a physical gallery',
    admission: 'Admission',
    talks: 'Artist talks',
    artists: 'Artists',
    artistCount: '{n} artists',
    organizer: 'Organizer',
    enterButton: 'Open the venue in VRChat',
    records: 'Records',
    announcementLink: 'Announcement',
    reportLink: 'Exhibition report',
    previous: 'Previous',
    next: 'Next',
    backToProgram: '← About ARTLINK',
    jumpSchedule: 'See the schedule',
    sectionNavAria: 'On this page',
    scheduleKicker: 'Schedule',
    scheduleHeading: 'Artist Talk Schedule',
    scheduleLead: 'During the run, participating artists will be in the VR venue to talk about their work. You can ask them questions directly, in front of the work.',
    weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    legendPeriod: 'Exhibition',
    legendTalk: 'Artist talk',
    outsidePeriod: 'Outside the run',
    talkLabel: 'Artist talk',
    talkJoin: 'Go to the venue',
    timeZoneNote: 'All times are Japan Standard Time (JST, UTC+9).',
    statusLive: 'Live now',
    statusPast: 'Ended',
    statusToday: 'Today',
    artistsKicker: 'Artists',
    artistsHeading: 'Participating Artists',
    artistsOrder: '',
    artistPage: 'Artist page',
    howtoKicker: 'How to Join',
    howtoHeading: 'How to Join',
    howtoSteps: [
      { title: 'Log in to VRChat', body: 'Install VRChat (free) and log in with your account.' },
      { title: 'Open the venue world', body: 'Use “Open the venue in VRChat”, or search for “{search}” in world search.' },
      { title: 'Walk through the exhibition', body: 'Explore the venue as an avatar. Come during an artist talk to hear about the work from the artist directly.' },
    ],
    infoKicker: 'Information',
    infoHeading: 'Overview',
    recordsKicker: 'Records',
    latestEyebrow: 'Latest edition',
    viewEdition: 'View {title}',
    archiveIntro: 'Each edition has its own page with dates, venues, artists, artist talks, and the exhibition report.',
  },
};

const dictionaries: Record<Locale, UIStrings> = { ja, en };

export function useTranslations(lang: Locale): UIStrings {
  return dictionaries[lang] ?? dictionaries[DEFAULT_LOCALE];
}
