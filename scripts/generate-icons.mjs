// Generates PWA PNG icons (192, 512, maskable 512) with zero dependencies.
// Run: node scripts/generate-icons.mjs
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'public', 'icons');
mkdirSync(outDir, { recursive: true });

// --- CRC32 ---
const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const body = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}
function encodePNG(width, height, rgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  // raw image data with filter byte per scanline
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0; // filter none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const idat = deflateSync(raw, { level: 9 });
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const BLUE = [0x00, 0x5c, 0x9d];
const RED = [0xda, 0x29, 0x1c];
const WHITE = [0xff, 0xff, 0xff];

function drawIcon(size, contentScale = 1) {
  const buf = Buffer.alloc(size * size * 4);
  const cx = size / 2;
  const cy = size / 2;
  const R = size * 0.32 * contentScale; // main ring radius
  const ringW = size * 0.075 * contentScale;
  const dotR = size * 0.085 * contentScale;
  const dotCx = cx + R * 0.98;
  const dotCy = cy;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      // background: vertical gradient of brand blue
      const t = y / size;
      const r = Math.round(BLUE[0] + (0x00 - BLUE[0]) * t);
      const g = Math.round(BLUE[1] + (0x3a - BLUE[1]) * t);
      const b = Math.round(BLUE[2] + (0x6e - BLUE[2]) * t);
      let col = [r, g, b];

      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      let ang = Math.atan2(dy, dx); // -PI..PI
      if (ang < 0) ang += Math.PI * 2; // 0..2PI

      // White "C" ring, open on the right side (gap around 0 rad)
      const inRing = Math.abs(dist - R) < ringW;
      const gap = ang < 0.55 || ang > Math.PI * 2 - 0.55;
      if (inRing && !gap) col = WHITE;

      // Red swoosh dot at the opening
      const ddx = x - dotCx;
      const ddy = y - dotCy;
      if (Math.sqrt(ddx * ddx + ddy * ddy) < dotR) col = RED;

      buf[i] = col[0];
      buf[i + 1] = col[1];
      buf[i + 2] = col[2];
      buf[i + 3] = 255;
    }
  }
  return encodePNG(size, size, buf);
}

const targets = [
  ['icon-192.png', 192, 1],
  ['icon-512.png', 512, 1],
  ['icon-maskable-512.png', 512, 0.8],
  ['apple-touch-icon.png', 180, 1],
  ['favicon-32.png', 32, 1],
];

for (const [name, size, scale] of targets) {
  const png = drawIcon(size, scale);
  writeFileSync(join(outDir, name), png);
  console.log(`✓ ${name} (${size}x${size}) — ${png.length} bytes`);
}
console.log('Done.');