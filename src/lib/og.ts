import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * SNS 共有用のサムネイル（og:image / twitter:image）。
 *
 * 以前は全ページの既定が存在しない SVG（/images/favicon-og.svg）を指しており、
 * X・Facebook・LINE・Discord のどれでもサムネイルが出ていなかった。
 * 同じ事故を繰り返さないよう、指定された画像はビルド時に実在と形式を確かめ、
 * 寸法も読み取って og:image:width / height に出す（Facebook は寸法が無いと初回共有で画像を出さないことがある）。
 */

/** 全ページ共通の既定画像（1200×630）。scripts/generate-og-default.py で生成する */
export const DEFAULT_OG_IMAGE = '/images/og/default.jpg';

export interface OgImage {
  url: string;
  alt: string;
  type?: string;
  width?: number;
  height?: number;
}

/** JPEG / PNG のヘッダから寸法を読む。対応外の形式は undefined。 */
function readDimensions(buf: Buffer): { type: string; width: number; height: number } | undefined {
  // PNG: 8 バイトのシグネチャの後の IHDR に幅・高さ
  if (buf.readUInt32BE(0) === 0x89504e47) {
    return { type: 'image/png', width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  // JPEG: SOF マーカー（C0–CF のうち C4 / C8 / CC 以外）に高さ・幅
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let offset = 2;
    while (offset < buf.length) {
      if (buf[offset] !== 0xff) return undefined;
      const marker = buf[offset + 1];
      const isSof = marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker);
      if (isSof) {
        return { type: 'image/jpeg', height: buf.readUInt16BE(offset + 5), width: buf.readUInt16BE(offset + 7) };
      }
      offset += 2 + buf.readUInt16BE(offset + 2);
    }
  }
  return undefined;
}

/**
 * ページに出すサムネイルを決める。指定が無ければ既定画像。
 * public/ 配下の画像は実在・形式（JPEG / PNG）を確かめ、問題があればビルドを止める。
 */
export function resolveOgImage(path: string | undefined, site: URL, alt: string): OgImage {
  const src = path || DEFAULT_OG_IMAGE;

  // 外部 URL はビルド時に読めないので、そのまま出す
  if (/^https?:\/\//.test(src)) return { url: src, alt };

  const file = join(process.cwd(), 'public', src.replace(/^\/+/, ''));
  let buf: Buffer;
  try {
    buf = readFileSync(file);
  } catch {
    throw new Error(`og:image "${src}" が public/ にありません（SNS でサムネイルが出なくなります）`);
  }

  const dims = readDimensions(buf);
  if (!dims) {
    throw new Error(
      `og:image "${src}" は JPEG / PNG ではありません。SVG などは SNS でサムネイルとして表示されないため、JPEG か PNG を指定してください`
    );
  }

  return { url: new URL(src, site).toString(), alt, ...dims };
}
