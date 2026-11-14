// Generates PWA PNG icons with a unique "IMF" mark (192, 512, maskable 512, apple, favicon).
// Zero dependencies (built-in zlib). Run: node scripts/generate-icons.mjs
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'public', 'icons');
mkdirSync(outDir, { recursive: true });

// --- CRC32 / PNG encoder ---
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
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}
function encodePNG(width, height, rgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
}

// --- 5x7 block glyphs ---
const GLYPHS = {
  I: ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
  M: ['10001', '11011', '10101', '10001', '10001', '10001', '10001'],
  F: ['11111', '10000', '10000', '11110', '10000', '10000', '10000'],
};
const LETTERS = ['I', 'M', 'F'];

const BLUE_TOP = [0x00, 0x5c, 0x9d];
const BLUE_BOT = [0x00, 0x2f, 0x5e];
const RED = [0xda, 0x29, 0x1c];
const WHITE = [0xff, 0xff, 0xff];

function drawIcon(size, contentScale = 1) {
  const buf = Buffer.alloc(size * size * 4);
  // background gradient
  for (let y = 0; y < size; y++) {
    const t = y / size;
    const r = Math.round(BLUE_TOP[0] + (BLUE_BOT[0] - BLUE_TOP[0]) * t);
    const g = Math.round(BLUE_TOP[1] + (BLUE_BOT[1] - BLUE_TOP[1]) * t);
    const b = Math.round(BLUE_TOP[2] + (BLUE_BOT[2] - BLUE_TOP[2]) * t);
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      buf[i] = r;
      buf[i + 1] = g;
      buf[i + 2] = b;
      buf[i + 3] = 255;
    }
  }

  const setPx = (x, y, col) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    const i = (y * size + x) * 4;
    buf[i] = col[0];
    buf[i + 1] = col[1];
    buf[i + 2] = col[2];
    buf[i + 3] = 255;
  };
  const fillRect = (x0, y0, w, h, col) => {
    for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) setPx(x, y, col);
  };

  // layout metrics
  const gw = 5;
  const gh = 7;
  const gap = 1;
  const totalUnitsW = LETTERS.length * gw + (LETTERS.length - 1) * gap; // 17
  const scale = Math.max(1, Math.floor(Math.min((size * 0.6 * contentScale) / totalUnitsW, (size * 0.4 * contentScale) / gh)));
  const textW = totalUnitsW * scale;
  const textH = gh * scale;
  const startX = Math.floor((size - textW) / 2);
  const startY = Math.floor((size - textH) / 2) - Math.floor(size * 0.05 * contentScale);

  LETTERS.forEach((letter, li) => {
    const glyph = GLYPHS[letter];
    const lx = startX + li * (gw + gap) * scale;
    for (let r = 0; r < gh; r++) {
      for (let c = 0; c < gw; c++) {
        if (glyph[r][c] === '1') {
          fillRect(lx + c * scale, startY + r * scale, scale, scale, WHITE);
        }
      }
    }
  });

  // unique red swoosh underline accent beneath the IMF mark
  const swooshY = startY + textH + Math.floor(size * 0.06 * contentScale);
  const swooshH = Math.max(2, Math.floor(size * 0.035 * contentScale));
  const swooshW = Math.floor(textW * 0.9);
  const swooshX = Math.floor((size - swooshW) / 2);
  for (let x = 0; x < swooshW; x++) {
    // slight arc: shift each column vertically a touch
    const arc = Math.round(Math.sin((x / swooshW) * Math.PI) * size * 0.02 * contentScale);
    fillRect(swooshX + x, swooshY + arc, 1, swooshH, RED);
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
