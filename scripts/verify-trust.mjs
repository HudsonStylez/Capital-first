// Verifies every technical trust/PWA signal a deployed site needs to (a) install
// cleanly and (b) pass a Safe Browsing review.
//
//   node scripts/verify-trust.mjs https://your-site.workers.dev
//
// Exit code 0 = all checks passed (for the technical criteria).

const base = (process.argv[2] || 'https://capitalone.hudson-ofccl.workers.dev').replace(/\/$/, '');

const results = [];
function check(name, ok, detail = '') {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  — ${detail}` : ''}`);
}

async function get(path) {
  try {
    const res = await fetch(base + path, { redirect: 'follow' });
    return res;
  } catch (e) {
    return { ok: false, status: 0, headers: new Headers(), _err: String(e?.message || e) };
  }
}

function hasHeader(res, key, mustInclude) {
  const v = (res.headers?.get(key) || '').toLowerCase();
  return mustInclude ? v.includes(mustInclude) : v.length > 0;
}

(async () => {
  console.log(`\nVerifying trust signals for: ${base}\n`);

  // --- Security headers ---
  const home = await get('/');
  check('HTTPS + site reachable (200)', home.status === 200, `status ${home.status}`);
  check('Content-Security-Policy', hasHeader(home, 'content-security-policy'), home.headers?.get('content-security-policy') || 'missing');
  check('Strict-Transport-Security', hasHeader(home, 'strict-transport-security', 'max-age'), home.headers?.get('strict-transport-security') || 'missing');
  check('X-Content-Type-Options: nosniff', hasHeader(home, 'x-content-type-options', 'nosniff'));
  check('X-Frame-Options', hasHeader(home, 'x-frame-options'));
  check('Referrer-Policy', hasHeader(home, 'referrer-policy'));
  check('Permissions-Policy', hasHeader(home, 'permissions-policy'));

  // --- Trust files ---
  const sec = await get('/.well-known/security.txt');
  check('security.txt', sec.status === 200, `status ${sec.status}`);

  const robots = await get('/robots.txt');
  check('robots.txt', robots.status === 200);

  const sitemap = await get('/sitemap.xml');
  check('sitemap.xml', sitemap.status === 200);

  // --- PWA install criteria ---
  const manifestRes = await get('/manifest.json');
  let manifest = null;
  try {
    manifest = await manifestRes.json();
  } catch {}
  check('manifest.json reachable', manifestRes.status === 200 && !!manifest);
  if (manifest) {
    check('manifest: name', !!manifest.name);
    check('manifest: short_name', !!manifest.short_name);
    check('manifest: start_url', !!manifest.start_url);
    check('manifest: display standalone', manifest.display === 'standalone');
    const icons = manifest.icons || [];
    check('manifest: 192 icon', icons.some((i) => String(i.sizes || '').includes('192')));
    check('manifest: 512 icon', icons.some((i) => String(i.sizes || '').includes('512')));
    check('manifest: maskable icon', icons.some((i) => String(i.purpose || '').includes('maskable')));
  }

  const sw = await get('/sw.js');
  const swText = sw.status === 200 ? await sw.text() : '';
  check('service worker served', sw.status === 200);
  check('service worker has fetch handler', swText.includes("addEventListener('fetch'") || swText.includes('addEventListener("fetch"'));

  const icon192 = await get('/icons/icon-192.png');
  check('icon-192.png', icon192.status === 200);
  const icon512 = await get('/icons/icon-512.png');
  check('icon-512.png', icon512.status === 200);
  const apple = await get('/icons/apple-touch-icon.png');
  check('apple-touch-icon.png (iOS)', apple.status === 200);

  // --- TWA digital asset links (address-bar killer) ---
  const al = await get('/.well-known/assetlinks.json');
  check('assetlinks.json reachable', al.status === 200, `status ${al.status}`);
  const alType = (al.headers?.get('content-type') || '').toLowerCase();
  check('assetlinks.json Content-Type: application/json', alType.includes('application/json'), alType || 'missing');
  if (al.status === 200) {
    try {
      const data = await al.json();
      const fp = JSON.stringify(data);
      check(
        'assetlinks.json has real fingerprint (not placeholder)',
        !/REPLACE_WITH/i.test(fp)
      );
    } catch {
      check('assetlinks.json is valid JSON', false);
    }
  }

  // --- Disclaimer present in served HTML (crawler-visible) ---
  const homeHtml = home.status === 200 && home.text ? await home.text() : '';
  check(
    'non-affiliation disclosure in served HTML',
    /not affiliated with|independent demonstration/i.test(homeHtml)
  );

  // --- Summary ---
  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed.`);
  if (failed.length) {
    console.log('\nFailed checks:');
    failed.forEach((f) => console.log(`  - ${f.name}`));
  }

  console.log(`
──────────────────────────────────────────────────────────────
REPUTATION (cannot be automated here — you must action these):
  1. Google Search Console → Security & Manual Actions → Request Review
     https://search.google.com/search-console
  2. Bing Webmaster Tools
     https://www.bing.com/webmasters
  3. Microsoft SmartScreen report
     https://www.microsoft.com/en-us/wdsi/support/report-unsafe-site
  4. Prefer a custom domain over *.workers.dev (shared reputation).
──────────────────────────────────────────────────────────────
`);

  process.exit(failed.length ? 1 : 0);
})();
