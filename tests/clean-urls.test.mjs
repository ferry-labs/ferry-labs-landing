import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const landingOuter = read('../index.html');
const landingMatch = landingOuter.match(
  /<script type="__bundler\/template">\s*([\s\S]*?)\s*<\/script>/
);

assert.ok(landingMatch, 'landing template exists');

const generatedPages = [
  JSON.parse(landingMatch[1]),
  read('../case-studies.html'),
  read('../ferry-platform.html'),
  read('../hyperscale-bridge.html'),
];

test('generated first-party links use clean URLs', () => {
  for (const page of generatedPages) {
    assert.doesNotMatch(page, /href=(?:"|\{?['"])[^\n>]*\.html(?:['"]|\})/);
  }
});

test('clean navigation routes are present', () => {
  const combined = generatedPages.join('\n');
  for (const route of ['/', '/case-studies', '/ferry-platform']) {
    assert.match(combined, new RegExp(`href=(?:"|\\{?['"])${route.replace('/', '\\/')}`));
  }
});
