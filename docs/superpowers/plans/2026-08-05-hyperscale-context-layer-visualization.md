# Hyperscale Context Layer Visualization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the dense ECAD–MCAD dashboard with one interactive architecture canvas that shows the triggering Altium changes, Ferry's unified context layer, five named agents, Inventor impact analysis, and engineer-controlled return path.

**Architecture:** Keep the existing static-page delivery and deterministic workflow state. Rebuild the HTML and CSS around a source → Ferry → target canvas, extend state with selectable change traces and active-agent progress, and keep approval as the final explicit transition. No network calls or external libraries.

**Tech Stack:** Semantic HTML, CSS, vanilla JavaScript ES modules, Node.js built-in test runner, existing GitHub Pages deployment.

## Global Constraints

- Altium Designer remains the electrical source of truth.
- Autodesk Inventor remains the mechanical source of truth.
- Ferry's Unified Engineering Context Layer is the visual center.
- Name all five workers as agents.
- Show the three triggering changes before the workflow runs.
- Preserve simulated-data disclosure and engineer approval.
- Do not imply automatic source writes or completed integrations.
- Use no SVG, gradients, glass effects, avatars, robots, chat UI, or generic AI language.

---

### Task 1: Change-trace workflow state

**Files:**
- Modify: `hyperscale-bridge-state.mjs`
- Modify: `tests/hyperscale-bridge-state.test.mjs`

**Interfaces:**
- Produces: `AGENTS`, `CHANGE_TRACES`, `createInitialState()`, and `transition(state, event)`.
- `SELECT_CHANGE` consumes `{ type: 'SELECT_CHANGE', changeId: string }`.
- `ADVANCE_AGENT` consumes `{ type: 'ADVANCE_AGENT' }` and advances `activeAgentIndex` from 0 through 4 before review.

- [ ] **Step 1: Write failing state tests**

Add tests asserting five named agents, three complete source-to-result traces, change selection, sequential agent progress, review readiness, proposal, approval, and reset.

- [ ] **Step 2: Run the state tests and verify RED**

Run: `node --test tests/hyperscale-bridge-state.test.mjs`

Expected: FAIL because agent and trace state are absent.

- [ ] **Step 3: Implement minimal deterministic state**

Define agents in this order: `altium`, `mapping`, `inventor`, `impact`, `return`. Define traces for `capacitor`, `connector`, and `mount`. Keep stages `ready`, `running`, `review`, `proposed`, and `approved`. Invalid transitions return the existing state.

- [ ] **Step 4: Run the state tests and verify GREEN**

Run: `node --test tests/hyperscale-bridge-state.test.mjs`

Expected: all state tests pass.

- [ ] **Step 5: Commit**

```bash
git add hyperscale-bridge-state.mjs tests/hyperscale-bridge-state.test.mjs
git commit -m "Model the Ferry context-layer agent workflow"
```

### Task 2: Single-canvas architecture experience

**Files:**
- Replace: `hyperscale-bridge.html`
- Replace: `hyperscale-bridge.css`
- Modify: `tests/hyperscale-bridge-page.test.mjs`

**Interfaces:**
- Consumes: data attributes `data-agent`, `data-change`, `data-context-record`, and existing `data-action` controls.
- Produces: one `.system-canvas` containing `.source-node`, `.context-core`, `.target-node`, `.agent-rail`, `.trace-panel`, and `.approval-panel`.

- [ ] **Step 1: Write failing page-contract tests**

Assert the five exact agent names, three change values, `Ferry Unified Engineering Context Layer`, five context record labels, three measured impacts, and one primary `Run design coordination` action. Assert old `.story-brief`, `.workbench`, and `.ferry-method` sections are absent.

- [ ] **Step 2: Run the page tests and verify RED**

Run: `node --test tests/hyperscale-bridge-page.test.mjs`

Expected: FAIL because the old dashboard still exists.

- [ ] **Step 3: Build the semantic canvas**

Create a concise hero followed immediately by the architecture canvas. Show Altium revision C.14 and its three selectable changes on the left; the Ferry core and context records in the center; Autodesk Inventor M.08 and compact impact geometry on the right; the five agents along the connecting route; and the selected trace plus approval below.

- [ ] **Step 4: Build the responsive visual system**

Use CSS grid, absolute rails only at desktop widths, and a vertical stack below 760px. Preserve the warm paper, graphite, and brass system with one-pixel rules. Use CSS-authored geometry only.

- [ ] **Step 5: Run the page tests and verify GREEN**

Run: `node --test tests/hyperscale-bridge-page.test.mjs`

Expected: all page tests pass.

- [ ] **Step 6: Commit**

```bash
git add hyperscale-bridge.html hyperscale-bridge.css tests/hyperscale-bridge-page.test.mjs
git commit -m "Center the Hyperscale prototype on Ferry"
```

### Task 3: Agent animation and trace selection

**Files:**
- Replace: `hyperscale-bridge.js`
- Modify: `tests/hyperscale-bridge-page.test.mjs`

**Interfaces:**
- Consumes: state module events `START_RUN`, `ADVANCE_AGENT`, `CREATE_PROPOSAL`, `APPROVE`, `RESET`, and `SELECT_CHANGE`.
- Produces: `data-stage`, `data-active-agent`, `aria-selected`, active context records, trace copy, and visible approval state.

- [ ] **Step 1: Write failing controller-contract tests**

Assert the controller dispatches each event, advances five agents with reduced-motion support, updates the selected trace, and contains no network calls.

- [ ] **Step 2: Run the controller tests and verify RED**

Run: `node --test tests/hyperscale-bridge-page.test.mjs`

Expected: FAIL because the old controller uses the previous synchronization workflow.

- [ ] **Step 3: Implement the controller**

Render the current stage, active agent, accumulated context records, selected change trace, proposal, and approval. Run agents sequentially at approximately 420 ms each, or immediately for reduced-motion users. Keep all source changes selectable at every stage.

- [ ] **Step 4: Run the focused and full tests**

Run: `node --test tests/hyperscale-bridge-page.test.mjs tests/hyperscale-bridge-state.test.mjs`

Run: `node --test`

Expected: 0 failures.

- [ ] **Step 5: Commit**

```bash
git add hyperscale-bridge.js tests/hyperscale-bridge-page.test.mjs
git commit -m "Animate the Ferry agent coordination flow"
```

### Task 4: Release verification

**Files:**
- Verify: `hyperscale-bridge.html`
- Verify: `hyperscale-bridge.css`
- Verify: `hyperscale-bridge.js`
- Verify: `hyperscale-bridge-state.mjs`

- [ ] **Step 1: Run final automated checks**

Run: `node --test`

Run: `rg -n -i "HSP-SST|story-brief|workbench|ferry-method|AI-powered|magic|chatbot" hyperscale-bridge.*`

Run: `git diff --check`

Expected: 0 failures and no scan matches.

- [ ] **Step 2: Verify desktop, mobile, and interaction**

Confirm no horizontal overflow at 1280px and 390px. Run the five-agent sequence, select each source change, prepare the return set, approve it, and reset. Confirm no console errors.

- [ ] **Step 3: Merge, publish, and verify**

Merge into `main`, publish through the existing Ferry Labs repository, and confirm the public HTML, CSS, JavaScript, and state module return HTTP 200 with the new context-layer copy.
