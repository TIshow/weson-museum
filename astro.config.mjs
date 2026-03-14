import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// GitHub Pages の設定
// - site: 公開URLのルート（カスタムドメイン使用時は変更する）
// - base: リポジトリ名のサブパス（カスタムドメイン使用時は '/' に変更する）
//
// カスタムドメイン設定例:
//   site: 'https://museum.weson.jp'
//   base: '/'
//
// GitHub Pages（サブパス）設定例:
//   site: 'https://<your-github-username>.github.io'
//   base: '/weson-museum'

export default defineConfig({
  // TODO: デプロイ前に自分の GitHub ユーザー名に変更してください
  // 例: 'https://your-username.github.io'
  // カスタムドメイン使用時: 'https://museum.weson.jp'
  site: 'https://weson-museum.com',
  base: '/',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()],
  i18n: {
    defaultLocale: 'ja',
    locales: ['ja', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
