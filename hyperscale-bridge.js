import {
  STAGES,
  createInitialState,
  transition,
} from './hyperscale-bridge-state.mjs';

const root = document.documentElement;
const model = document.querySelector('.model-canvas');
const statusCopy = document.querySelector('[data-status-copy]');
const reviewStatus = document.querySelector('[data-review-status]');
const syncIndex = document.querySelector('[data-sync-index]');
const syncLabel = document.querySelector('[data-sync-label]');
const syncMeter = document.querySelector('[data-sync-meter]');
const findingTabs = [...document.querySelectorAll('[data-finding]')];
const actionButtons = [...document.querySelectorAll('[data-action]')];

const findingFields = {
  label: document.querySelector('[data-finding-label]'),
  title: document.querySelector('[data-finding-title]'),
  description: document.querySelector('[data-finding-description]'),
  measure: document.querySelector('[data-finding-measure]'),
  expected: document.querySelector('[data-finding-expected]'),
  source: document.querySelector('[data-finding-source]'),
  constraint: document.querySelector('[data-finding-constraint]'),
};

const syncOperations = [
  'Reading PCB revision C.14',
  'Aligning shared references',
  'Updating cabinet assembly M.08',
  'Evaluating mechanical constraints',
];

const statusByStage = {
  [STAGES.READY]: ['3 changes ready', 'Waiting'],
  [STAGES.SYNCING]: ['Synchronizing', 'In progress'],
  [STAGES.REVIEW]: ['Assembly updated', 'Review required'],
  [STAGES.PROPOSED]: ['Return set prepared', 'Approval required'],
  [STAGES.APPROVED]: ['Decision recorded', 'Approved'],
};

let state = createInitialState();
let selectedFindingId = 'cold-plate';
let syncTimeout;

function renderFinding() {
  const finding = state.findings.find(({ id }) => id === selectedFindingId);
  if (!finding) {
    model.removeAttribute('data-active-part');
    return;
  }

  for (const [key, node] of Object.entries(findingFields)) {
    node.textContent = finding[key];
  }

  model.dataset.activePart = finding.modelPart;
  findingTabs.forEach((tab) => {
    tab.setAttribute(
      'aria-selected',
      String(tab.dataset.finding === selectedFindingId)
    );
  });
}

function render() {
  root.dataset.stage = state.stage;
  const [bridgeCopy, reviewCopy] = statusByStage[state.stage];
  statusCopy.textContent = bridgeCopy;
  reviewStatus.textContent = reviewCopy;

  actionButtons.forEach((button) => {
    button.disabled = state.stage === STAGES.SYNCING;
  });

  renderFinding();
}

function setSyncOperation(index) {
  syncIndex.textContent = `${String(index + 1).padStart(2, '0')} / 04`;
  syncLabel.textContent = syncOperations[index];
  syncMeter.style.width = `${(index + 1) * 25}%`;

  document.querySelectorAll('[data-sync-step]').forEach((step, stepIndex) => {
    step.classList.toggle('is-active', stepIndex <= index);
  });
}

function completeSynchronization() {
  state = transition(state, 'COMPLETE_SYNC');
  selectedFindingId = 'cold-plate';
  render();
}

function runSynchronization() {
  window.clearTimeout(syncTimeout);
  state = transition(state, 'START_SYNC');
  render();

  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  const interval = reducedMotion ? 20 : 400;
  let operationIndex = 0;

  setSyncOperation(operationIndex);

  const advance = () => {
    operationIndex += 1;
    if (operationIndex >= syncOperations.length) {
      syncTimeout = window.setTimeout(completeSynchronization, interval);
      return;
    }
    setSyncOperation(operationIndex);
    syncTimeout = window.setTimeout(advance, interval);
  };

  syncTimeout = window.setTimeout(advance, interval);
}

function dispatch(event) {
  if (event === 'START_SYNC') {
    runSynchronization();
    return;
  }

  window.clearTimeout(syncTimeout);
  state = transition(state, event);

  if (event === 'RESET') {
    selectedFindingId = 'cold-plate';
    setSyncOperation(0);
  }

  render();
}

actionButtons.forEach((button) => {
  button.addEventListener('click', () => dispatch(button.dataset.action));
});

findingTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    selectedFindingId = tab.dataset.finding;
    renderFinding();
  });
});

render();
