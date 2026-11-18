// Writes public/.well-known/assetlinks.json for a TWA (Trusted Web Activity).
//
//   node scripts/gen-assetlinks.mjs --package com.hudson.capitalone --sha256 "AB:CD:...:EF"
//
// Get the SHA-256 fingerprint from the PWABuilder zip (assetlinks.json or
// signing-key-info.txt) or run: keytool -list -v -keystore signing.keystore
//
// This is the "address bar killer": without it, the TWA opens with a URL bar.

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function arg(name) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? process.argv[i + 1] : undefined;
}

const pkg = arg('package');
let sha256 = arg('sha256');

if (!pkg || !sha256) {
  console.error(`
Usage: node scripts/gen-assetlinks.mjs --package <id> --sha256 <fingerprint>

  --package  Android application id, e.g. com.hudson.capitalone
  --sha256   SHA-256 signing cert fingerprint, e.g.
             AB:CD:EF:... (colon-separated hex). Quotes recommended.
`);
  process.exit(1);
}

// Normalise: uppercase, single colon separators.
sha256 = sha256.trim().toUpperCase().replace(/[^0-9A-F]/g, '');
if (sha256.length !== 64) {
  console.error(`Invalid SHA-256 fingerprint: expected 64 hex chars, got ${sha256.length}.`);
  process.exit(1);
}
const fingerprint = sha256.match(/../g).join(':');

const data = [
  {
    relation: ['delegate_permission/common.handle_all_urls'],
    target: {
      namespace: 'android_app',
      package_name: pkg,
      sha256_cert_fingerprints: [fingerprint],
    },
  },
];

const out = resolve(root, 'public/.well-known/assetlinks.json');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(data, null, 2) + '\n');

console.log(`Wrote ${out}`);
console.log(JSON.stringify(data, null, 2));
console.log('\nNext: npm run build && npx wrangler deploy, then verify the URL');
console.log('returns Content-Type: application/json with NO redirects.');
