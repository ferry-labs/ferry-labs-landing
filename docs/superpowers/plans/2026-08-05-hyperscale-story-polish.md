# Hyperscale Prototype Story and Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the live ECAD–MCAD prototype explain the problem, Ferry's build scope, systems touched, engineering outcome, and reason to work with Ferry while improving the page's visual refinement.

**Architecture:** Preserve the existing static HTML/CSS/JavaScript interaction. Add an editorial briefing before the existing connection strip, add contextual annotations inside the workflow, and replace the generic principle strip with an outcome-led Ferry engagement section. No state logic or external services change.

**Tech Stack:** Semantic HTML, CSS, vanilla JavaScript, Node.js built-in test runner, existing GitHub Pages deployment.

## Global Constraints

- Remove `HSP-SST / Power Module A` everywhere.
- Name Altium Designer and Autodesk Inventor as the systems of record.
- Describe Ferry as the coordination layer, not a replacement CAD system.
- State that the data is simulated and do not imply a completed integration.
- Keep engineer approval explicit.
- Use no gradients, glass effects, generic AI language, or unsupported outcome claims.

---

### Task 1: Product narrative and workflow annotations

**Files:**
- Modify: `hyperscale-bridge.html`
- Test: `tests/hyperscale-bridge-page.test.mjs`

**Interfaces:**
- Consumes: existing static page structure and `data-action` workflow controls.
- Produces: semantic sections `story-brief`, `workflow-context`, and `ferry-method` without changing JavaScript selectors.

- [ ] **Step 1: Write failing copy and structure tests**

Add assertions that the old label is absent and the page includes the exact framing labels `The problem`, `Systems in the loop`, `What Ferry builds`, `Engineering outcome`, and `Why Ferry`.

```js
test('explains the engineering case and Ferry engagement model', () => {
  assert.doesNotMatch(html, /HSP-SST \/ Power Module A/);
  for (const label of [
    'The problem',
    'Systems in the loop',
    'What Ferry builds',
    'Engineering outcome',
    'Why Ferry',
  ]) assert.match(html, new RegExp(label, 'i'));
  assert.match(html, /Altium Designer/);
  assert.match(html, /Autodesk Inventor/);
  assert.match(html, /engineer approval/i);
});
```

- [ ] **Step 2: Run the page test and verify RED**

Run: `node --test tests/hyperscale-bridge-page.test.mjs`

Expected: FAIL because the old label remains and the briefing sections do not exist.

- [ ] **Step 3: Implement the narrative in semantic HTML**

Replace the old eyebrow with `Design coordination workspace`. Add a four-part briefing immediately after the hero. Add short contextual copy to the source-change, model, and review regions. Replace the principle strip with a Ferry method section that explains workflow discovery, existing-tool integration, company-specific rules, narrow-pilot validation, and retained decision history.

- [ ] **Step 4: Run the page test and verify GREEN**

Run: `node --test tests/hyperscale-bridge-page.test.mjs`

Expected: all page tests pass.

- [ ] **Step 5: Commit**

```bash
git add hyperscale-bridge.html tests/hyperscale-bridge-page.test.mjs
git commit -m "Explain the Hyperscale engineering workflow"
```

### Task 2: Editorial industrial polish

**Files:**
- Modify: `hyperscale-bridge.css`
- Test: `tests/hyperscale-bridge-page.test.mjs`

**Interfaces:**
- Consumes: the semantic section classes added in Task 1.
- Produces: responsive editorial briefing, annotated workbench, and Ferry method layout using the existing visual tokens.

- [ ] **Step 1: Write failing visual-system tests**

Assert the new classes exist in CSS, the mobile breakpoint includes them, and prohibited effects remain absent.

```js
test('styles the editorial briefing and Ferry method responsively', () => {
  for (const selector of ['.story-brief', '.brief-item', '.workflow-context', '.ferry-method']) {
    assert.match(css, new RegExp(selector.replace('.', '\\\.'), 'i'));
  }
  assert.match(css, /@media \(max-width:\s*760px\)[\s\S]*\.story-brief/);
  assert.doesNotMatch(css, /linear-gradient|radial-gradient|backdrop-filter/i);
});
```

- [ ] **Step 2: Run the page test and verify RED**

Run: `node --test tests/hyperscale-bridge-page.test.mjs`

Expected: FAIL because the new sections are not styled.

- [ ] **Step 3: Implement the visual refinement**

Use larger editorial spacing, sharper type scale, quiet brass accents, consistent one-pixel rules, section numbering, and restrained hover/focus behavior. Keep the technical model dominant and reduce card-like styling. At 1180px and 760px, stack the story and method sections without horizontal overflow or loss of workflow controls.

- [ ] **Step 4: Run the full suite and verify GREEN**

Run: `node --test`

Expected: 0 failures.

- [ ] **Step 5: Commit**

```bash
git add hyperscale-bridge.css tests/hyperscale-bridge-page.test.mjs
git commit -m "Polish the Hyperscale prototype narrative"
```

### Task 3: Release verification

**Files:**
- Verify: `hyperscale-bridge.html`
- Verify: `hyperscale-bridge.css`
- Verify: `hyperscale-bridge.js`

**Interfaces:**
- Consumes: the completed static prototype.
- Produces: a verified public page with unchanged interaction behavior.

- [ ] **Step 1: Run final automated checks**

Run: `node --test`

Run: `rg -n -i "HSP-SST|revolutionary|seamless|cutting-edge|AI-powered|magic" hyperscale-bridge.*`

Run: `git diff --check`

Expected: 0 test failures, no copy-scan matches, no whitespace errors.

- [ ] **Step 2: Verify the interaction manually**

Confirm ready → synchronize → review → return proposal → engineer approval → reset, with no console errors and no overflow at desktop or mobile widths.

- [ ] **Step 3: Merge, publish, and verify**

Merge the feature branch into `main`, publish through the existing Ferry Labs repository, and verify the public HTML, CSS, JavaScript, and state module return HTTP 200.
