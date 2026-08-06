# Hyperscale Power ECAD–MCAD Bridge Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a polished, interactive ECAD–MCAD bridge concept that earns a workflow review with Hyperscale Power's design engineer.

**Architecture:** Add one isolated static page to the existing Ferry Labs website. A small deterministic state module drives a four-state interaction, a controller maps state to the DOM, and a bespoke HTML/CSS model visualizes the simulated cabinet and PCB changes without external assets or services.

**Tech Stack:** Semantic HTML, CSS, vanilla JavaScript, Node.js built-in test runner, existing GitHub-hosted Ferry Labs deployment.

## Global Constraints

- Use only simulated data and label it clearly.
- Do not claim completed Altium Designer or Autodesk Inventor integrations.
- Do not include certification functionality or certification claims.
- Avoid gradients, glass effects, oversized pills, chat UI, sparkle iconography, and generic AI language.
- Preserve existing site pages and global behavior.
- Keep the complete workflow keyboard accessible and mobile usable.

---

### Task 1: Deterministic workflow state

**Files:**
- Create: `hyperscale-bridge-state.js`
- Create: `tests/hyperscale-bridge-state.test.js`

**Interfaces:**
- Produces: `HyperscaleBridge.createInitialState()`, `HyperscaleBridge.transition(state, event)`, and `HyperscaleBridge.STAGES`.
- Consumes: no project code.

- [ ] **Step 1: Write failing lifecycle tests**

```js
test('moves from ready through approved', () => {
  let state = bridge.createInitialState();
  state = bridge.transition(state, 'START_SYNC');
  state = bridge.transition(state, 'COMPLETE_SYNC');
  state = bridge.transition(state, 'CREATE_PROPOSAL');
  state = bridge.transition(state, 'APPROVE');
  assert.equal(state.stage, 'approved');
});
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `node --test tests/hyperscale-bridge-state.test.js`

Expected: failure because `hyperscale-bridge-state.js` does not exist.

- [ ] **Step 3: Implement the state module**

Implement the allowed sequence `ready → syncing → review → proposed → approved`, plus `RESET → ready`. Invalid events return the unchanged state. The review state exposes three simulated findings and the approved state records a human approval.

- [ ] **Step 4: Run the state tests**

Run: `node --test tests/hyperscale-bridge-state.test.js`

Expected: all tests pass.

- [ ] **Step 5: Commit the state module**

```bash
git add hyperscale-bridge-state.js tests/hyperscale-bridge-state.test.js
git commit -m "Add Hyperscale bridge workflow state"
```

### Task 2: Technical interface and visual model

**Files:**
- Create: `hyperscale-bridge.html`
- Create: `hyperscale-bridge.css`
- Create: `tests/hyperscale-bridge-page.test.js`

**Interfaces:**
- Consumes: DOM state hooks using `[data-stage]`, `[data-action]`, `[data-finding]`, and `[data-model-part]`.
- Produces: accessible page structure and all visual states needed by the controller.

- [ ] **Step 1: Write failing structural tests**

```js
test('page discloses simulated data and exposes the full workflow', () => {
  assert.match(html, /Simulated design data/i);
  for (const action of ['START_SYNC', 'CREATE_PROPOSAL', 'APPROVE', 'RESET']) {
    assert.match(html, new RegExp(`data-action="${action}"`));
  }
});
```

- [ ] **Step 2: Run the page test and confirm it fails**

Run: `node --test tests/hyperscale-bridge-page.test.js`

Expected: failure because `hyperscale-bridge.html` does not exist.

- [ ] **Step 3: Build the semantic page**

Create a quiet header, project/revision rail, central cabinet cutaway, change list, finding inspector, proposed return change, decision history, and one email CTA. Include a CSS-authored model with named parts for the PCB, cold plate, capacitor bank, connector, mounting hole, and standoff.

- [ ] **Step 4: Apply the industrial visual system**

Use warm white `#f2f0e9`, ink `#171b1c`, steel `#667074`, signal blue `#256b76`, amber `#b86d2d`, and failure red `#b34435`. Use a compact sans-serif stack with tabular numerals, 1px rules, a 12-column desktop grid, and a single-column mobile layout below 760px.

- [ ] **Step 5: Run structural tests and HTML checks**

Run: `node --test tests/hyperscale-bridge-page.test.js`

Expected: all tests pass.

- [ ] **Step 6: Commit the interface**

```bash
git add hyperscale-bridge.html hyperscale-bridge.css tests/hyperscale-bridge-page.test.js
git commit -m "Build Hyperscale ECAD-MCAD concept interface"
```

### Task 3: Interactive synchronization and engineer review

**Files:**
- Create: `hyperscale-bridge.js`
- Modify: `hyperscale-bridge.html`

**Interfaces:**
- Consumes: `window.HyperscaleBridge`, `[data-action]` controls, and DOM state hooks from Task 2.
- Produces: `render(state)`, timed synchronization progress, finding selection, proposal creation, approval, and reset behavior.

- [ ] **Step 1: Add controller contract tests to the structural test**

Assert that the page loads `hyperscale-bridge-state.js` before `hyperscale-bridge.js`, and that every finding button targets an existing detail panel.

- [ ] **Step 2: Run tests and confirm the new controller contract fails**

Run: `node --test tests/hyperscale-bridge-page.test.js`

Expected: failure because `hyperscale-bridge.js` is absent.

- [ ] **Step 3: Implement the controller**

Bind each action button to the state transition module. `START_SYNC` progresses through four visible operations over approximately 1.6 seconds before dispatching `COMPLETE_SYNC`. Finding buttons update the inspector and model highlight. Proposal and approval actions update the workflow ledger without any network calls.

- [ ] **Step 4: Run the complete automated test suite**

Run: `node --test tests/hyperscale-bridge-state.test.js tests/hyperscale-bridge-page.test.js`

Expected: all tests pass.

- [ ] **Step 5: Commit the interaction**

```bash
git add hyperscale-bridge.js hyperscale-bridge.html tests/hyperscale-bridge-page.test.js
git commit -m "Add interactive Hyperscale design review flow"
```

### Task 4: Visual QA, copy QA, and deployment

**Files:**
- Modify if required: `hyperscale-bridge.html`
- Modify if required: `hyperscale-bridge.css`
- Modify if required: `hyperscale-bridge.js`

**Interfaces:**
- Consumes: completed static prototype.
- Produces: verified production URL `https://ferrylabs.ai/hyperscale-bridge.html`.

- [ ] **Step 1: Start the local site**

Run: `python3 -m http.server 4175`

- [ ] **Step 2: Verify desktop and mobile interactions**

Open `http://127.0.0.1:4175/hyperscale-bridge.html`, complete the full lifecycle, reset it, and inspect at desktop and narrow mobile widths. Confirm no console errors, clipped content, unreadable labels, or inaccessible controls.

- [ ] **Step 3: Run copy and automated verification**

Run: `node --test tests/hyperscale-bridge-state.test.js tests/hyperscale-bridge-page.test.js`

Run: `rg -n -i "revolutionary|seamless|cutting-edge|magic|AI-powered|certif" hyperscale-bridge.*`

Expected: tests pass and the copy scan finds no prohibited marketing language or certification claims.

- [ ] **Step 4: Commit any QA refinements**

```bash
git add hyperscale-bridge.html hyperscale-bridge.css hyperscale-bridge.js tests
git commit -m "Polish Hyperscale prototype for sharing"
```

- [ ] **Step 5: Push the production branch**

Run: `git push origin main`

- [ ] **Step 6: Verify the public URL**

Open `https://ferrylabs.ai/hyperscale-bridge.html` and confirm the deployed file matches the tested local experience.
