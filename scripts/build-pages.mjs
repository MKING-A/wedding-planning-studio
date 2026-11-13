import { copyFile, mkdir, rm, readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Cloudflare Pages expects static assets inside a build output directory.
// Keep the root-level functions/ directory OUTSIDE this folder so that Pages
// deploys it as server-side API code instead of exposing it as static assets.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(root, 'dist');
const assets = [
  'index.html',
  'app.js',
  'styles.css',
  'toronto.js',
  'toronto.css',
  'shared-sync.js',
  'shared-sync.css',
];

const html = await readFile(join(root, 'index.html'), 'utf8');
for (const asset of assets.filter(x => x !== 'index.html')) {
  if (!html.includes(`./${asset}`)) {
    throw new Error(`Expected asset reference missing from index.html: ${asset}`);
  }
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const asset of assets) {
  await copyFile(join(root, asset), join(output, asset));
}
console.log(`Cloudflare Pages: copied ${assets.length} static files into dist/; functions/ remains at the project root.`);
