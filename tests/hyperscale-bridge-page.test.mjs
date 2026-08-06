import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(
  new URL('../hyperscale-bridge.html', import.meta.url),
  'utf8'
);
const css = readFileSync(
  new URL('../hyperscale-bridge.css', import.meta.url),
  'utf8'
);
const behavior = readFileSync(
  new URL('../hyperscale-bridge.js', import.meta.url),
  'utf8'
);

test('discloses simulated data and exposes the full review workflow', () => {
  assert.match(html, /Simulated design data/i);
  assert.match(html, /HSP-SST \/ Power Module A/);
  assert.match(html, /Altium Designer/);
  assert.match(html, /Autodesk Inventor/);

  for (const action of ['START_SYNC', 'CREATE_PROPOSAL', 'APPROVE', 'RESET']) {
    assert.match(html, new RegExp(`data-action="${action}"`));
  }
});

test('renders a CSS-authored cabinet model with named engineering parts', () => {
  assert.doesNotMatch(html, /<svg\b/i);

  for (const part of [
    'cabinet',
    'pcb',
    'cold-plate',
    'capacitor',
    'connector',
    'mount',
  ]) {
    assert.match(html, new RegExp(`data-model-part="${part}"`));
  }

  assert.match(html, /4\.2 mm/);
  assert.match(html, /18 mm/);
  assert.match(html, /6 mm/);
});

test('keeps engineer review explicit and provides one final CTA', () => {
  assert.match(html, /Engineer approval required/i);
  assert.match(html, /Review with your design engineer/i);
  assert.match(html, /mailto:contact@ferrylabs\.ai/);
  assert.equal((html.match(/class="final-cta"/g) ?? []).length, 1);
});

test('uses the restrained industrial visual system', () => {
  assert.match(css, /--paper:\s*#f2f0e9/i);
  assert.match(css, /--ink:\s*#171b1c/i);
  assert.match(css, /font-variant-numeric:\s*tabular-nums/);
  assert.match(css, /grid-template-columns:/);
  assert.match(css, /@media \(max-width:\s*760px\)/);
  assert.match(css, /:focus-visible/);
  assert.doesNotMatch(css, /linear-gradient|radial-gradient|backdrop-filter/i);
  assert.doesNotMatch(html, /sparkle|chatbot|AI-powered|magic/i);
});

test('loads the controller and connects findings to the shared inspector', () => {
  assert.match(
    html,
    /<script type="module" src="hyperscale-bridge\.js\?v=20260805"><\/script>/
  );
  assert.equal((html.match(/data-finding="/g) ?? []).length, 3);
  assert.equal((html.match(/class="finding-detail"/g) ?? []).length, 1);
  assert.match(behavior, /from '\.\/hyperscale-bridge-state\.mjs'/);
  assert.match(behavior, /data-finding-title/);
  assert.match(behavior, /COMPLETE_SYNC/);
});

test('controller retains explicit engineer control and reset behavior', () => {
  assert.match(behavior, /dispatch\(button\.dataset\.action\)/);
  assert.match(behavior, /RESET/);
  assert.match(behavior, /prefers-reduced-motion/);
  assert.doesNotMatch(behavior, /fetch\(|XMLHttpRequest|WebSocket/);
});
