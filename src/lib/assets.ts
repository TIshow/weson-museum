/**
 * コンテンツ側に書かれた画像パスを、ベースパスを尊重した URL に変換する。
 *
 * コンテンツでは `/images/artists/foo.jpg` のように書いてよい。
 * 外部 URL（http/https）とデータ URI はそのまま通す。
 */
export function assetUrl(path: string | undefined): string | undefined {
  if (!path) return undefined;
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path;

  const base = import.meta.env.BASE_URL; // 例: '/'
  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}
