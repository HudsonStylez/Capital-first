// One-command Android APK builder (zero cost, cross-platform).
//
//   npm run android:apk
//
// Steps: build the web app -> copy it into the Capacitor Android project ->
// assemble a signed release APK. If android/keystore.properties exists it is
// signed with YOUR key; otherwise it falls back to the debug key so a
// shareable, installable APK is always produced.

import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const isWin = process.platform === 'win32';

function run(cmd, args, cwd = root) {
  console.log(`\n$ ${cmd} ${args.join(' ')}`);
  const r = spawnSync(cmd, args, { cwd, stdio: 'inherit', shell: isWin });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

run('npm', ['run', 'build']);
run('npx', ['cap', 'sync', 'android']);

const gradle = isWin ? 'gradlew.bat' : './gradlew';
run(gradle, ['assembleRelease'], resolve(root, 'android'));

const outDir = resolve(root, 'android/app/build/outputs/apk/release');
const signed = resolve(outDir, 'app-release.apk');
const unsigned = resolve(outDir, 'app-release-unsigned.apk');

console.log('\n=== APK build complete ===');
if (existsSync(signed)) console.log(`Signed APK:   ${signed}`);
else if (existsSync(unsigned)) console.log(`Unsigned APK: ${unsigned}  (add android/keystore.properties to sign)`);
else console.log(`Look in: ${outDir}`);
