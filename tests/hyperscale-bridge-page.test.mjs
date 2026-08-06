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

test('centers Ferry between the two engineering systems', () => {
  assert.match(html, /Simulated design data/i);
  assert.match(html, /Altium Designer/);
  assert.match(html, /Autodesk Inventor/);
  assert.match(html, /Ferry Unified Engineering Context Layer/);
  assert.match(html, /Electrical source of truth/i);
  assert.match(html, /Mechanical source of truth/i);
  assert.doesNotMatch(html, /HSP-SST|story-brief|class="workbench"|ferry-method/i);
});

test('shows the five named agents as working system roles', () => {
  for (const name of [
    'Altium Change Agent',
    'Context Mapping Agent',
    'Inventor Assembly Agent',
    'Constraint &amp; Impact Agent',
    'Review &amp; Return Agent',
  ]) {
    assert.match(html, new RegExp(name));
  }
  assert.equal((html.match(/data-agent="/g) ?? []).length, 5);
});

test('shows the three Altium changes that trigger the workflow', () => {
  for (const change of [
    'Capacitor bank moved 18 mm',
    'Connector J17 rotated 90°',
    'Mounting hole H4 shifted 6 mm',
  ]) {
    assert.match(html, new RegExp(change));
  }
  assert.equal((html.match(/data-change="/g) ?? []).length, 3);
});

test('makes each change traceable from source through resolution', () => {
  for (const label of [
    'Source change',
    'Mapped object',
    'Design constraint',
    'Measured impact',
    'Proposed resolution',
  ]) {
    assert.match(html, new RegExp(label, 'i'));
  }
  assert.match(html, /4\.2 mm interference/);
  assert.match(html, /8 mm available/);
  assert.match(html, /6 mm misalignment/);
});

test('shows what the context layer accumulates', () => {
  for (const record of [
    'Object identities',
    'Revision changes',
    'Geometry mappings',
    'Design constraints',
    'Decisions &amp; provenance',
  ]) {
    assert.match(html, new RegExp(record));
  }
  assert.equal((html.match(/data-context-record="/g) ?? []).length, 5);
});

test('keeps one run action and explicit engineer approval', () => {
  assert.match(html, /data-action="START_RUN"/);
  assert.match(html, /Run design coordination/);
  assert.equal((html.match(/data-action="START_RUN"/g) ?? []).length, 1);
  assert.match(html, /Engineer approval required/i);
  assert.match(html, /No source design is changed automatically/i);
  assert.match(html, /data-action="CREATE_PROPOSAL"/);
  assert.match(html, /data-action="APPROVE"/);
  assert.match(html, /data-action="RESET"/);
});

test('ends with Ferry branding instead of a sales CTA', () => {
  assert.doesNotMatch(html, /Review the workflow together|mailto:/i);
  assert.match(
    html,
    /<footer>[\s\S]*class="footer-brand"[\s\S]*href="https:\/\/ferrylabs\.ai\/"[\s\S]*aria-label="Ferry Labs home"/
  );
  assert.equal((html.match(/class="footer-brand"/g) ?? []).length, 1);
});

test('uses a responsive CSS-authored system canvas', () => {
  for (const selector of [
    '.system-canvas',
    '.source-node',
    '.context-core',
    '.target-node',
    '.agent-rail',
    '.trace-panel',
    '.approval-panel',
  ]) {
    assert.match(css, new RegExp(selector.replace('.', '\\.')));
  }
  assert.match(css, /@media \(max-width:\s*760px\)/);
  assert.match(css, /font-variant-numeric:\s*tabular-nums/);
  assert.match(css, /:focus-visible/);
  assert.doesNotMatch(css, /linear-gradient|radial-gradient|backdrop-filter/i);
  assert.doesNotMatch(html, /<svg\b|sparkle|chatbot|AI-powered|magic/i);
});

test('controller drives agents, trace selection, approval, and reset locally', () => {
  assert.match(behavior, /from '\.\/hyperscale-bridge-state\.mjs'/);
  for (const event of [
    'START_RUN',
    'ADVANCE_AGENT',
    'SELECT_CHANGE',
    'CREATE_PROPOSAL',
    'APPROVE',
    'RESET',
  ]) {
    assert.match(behavior, new RegExp(event));
  }
  assert.match(behavior, /prefers-reduced-motion/);
  assert.doesNotMatch(behavior, /fetch\(|XMLHttpRequest|WebSocket/);
});
