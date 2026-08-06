import {
  AGENTS,
  CHANGE_TRACES,
  STAGES,
  createInitialState,
  transition,
} from './hyperscale-bridge-state.mjs';

const root = document.documentElement;
const runStatus = document.querySelector('[data-run-status]');
const activeAgentCopy = document.querySelector('[data-active-agent-copy]');
const actionButtons = [...document.querySelectorAll('[data-action]')];
const changeButtons = [...document.querySelectorAll('[data-change]')];
const agentNodes = [...document.querySelectorAll('[data-agent]')];
const contextNodes = [...document.querySelectorAll('[data-context-record]')];
const impactNodes = [...document.querySelectorAll('[data-impact]')];

const traceFields = {
  title: document.querySelector('[data-trace-title]'),
  code: document.querySelector('[data-trace-code]'),
  sourceDetail: document.querySelector('[data-trace-source]'),
  mapping: document.querySelector('[data-trace-mapping]'),
  constraint: document.querySelector('[data-trace-constraint]'),
  impact: document.querySelector('[data-trace-impact]'),
  resolution: document.querySelector('[data-trace-resolution]'),
};

const statusByStage = {
  [STAGES.READY]: '3 source changes ready',
  [STAGES.REVIEW]: '3 impacts ready for review',
  [STAGES.PROPOSED]: 'Return set R.01 awaiting approval',
  [STAGES.APPROVED]: 'Decision recorded in context',
};

const actionEvents = new Set([
  'START_RUN',
  'CREATE_PROPOSAL',
  'APPROVE',
  'RESET',
]);

let state = createInitialState();
let runTimer;

function selectedTrace() {
  return CHANGE_TRACES.find(({ id }) => id === state.selectedChangeId);
}

function renderTrace() {
  const trace = selectedTrace();
  if (!trace) return;

  traceFields.title.textContent = trace.change;
  traceFields.code.textContent = trace.code;
  traceFields.sourceDetail.textContent = trace.sourceDetail;
  traceFields.mapping.textContent = trace.mapping;
  traceFields.constraint.textContent = trace.constraint;
  traceFields.impact.textContent = trace.impact;
  traceFields.resolution.textContent = trace.resolution;

  changeButtons.forEach((button) => {
    button.setAttribute(
      'aria-selected',
      String(button.dataset.change === state.selectedChangeId)
    );
  });

  impactNodes.forEach((node) => {
    node.dataset.selected = String(
      node.dataset.impact === state.selectedChangeId
    );
  });
}

function renderAgents() {
  const activeAgent = AGENTS[state.activeAgentIndex];
  root.dataset.activeAgent = activeAgent?.id ?? '';

  agentNodes.forEach((node) => {
    const agentId = node.dataset.agent;
    const isActive = activeAgent?.id === agentId;
    const isComplete = state.completedAgentIds.includes(agentId);
    const agentState = isActive ? 'active' : isComplete ? 'complete' : 'queued';
    const stateNode = node.querySelector('[data-agent-state]');

    node.dataset.state = agentState;
    stateNode.textContent =
      agentState === 'active'
        ? 'Working'
        : agentState === 'complete'
          ? 'Complete'
          : 'Queued';
  });

  contextNodes.forEach((node) => {
    const agent = AGENTS.find(
      ({ contextKey }) => contextKey === node.dataset.contextRecord
    );
    const isActive = agent?.id === activeAgent?.id;
    const isComplete = state.completedAgentIds.includes(agent?.id);
    const recordState = isActive ? 'active' : isComplete ? 'complete' : 'queued';
    const stateNode = node.querySelector('[data-record-state]');

    node.dataset.state = recordState;
    stateNode.textContent =
      recordState === 'active'
        ? 'Writing'
        : recordState === 'complete'
          ? 'Linked'
          : 'Waiting';
  });

  if (activeAgentCopy && activeAgent) {
    activeAgentCopy.textContent = `${activeAgent.name} is working`;
  }
}

function render() {
  root.dataset.stage = state.stage;
  renderTrace();
  renderAgents();

  const activeAgent = AGENTS[state.activeAgentIndex];
  runStatus.textContent =
    state.stage === STAGES.RUNNING && activeAgent
      ? `${activeAgent.name} · ${state.activeAgentIndex + 1} of ${AGENTS.length}`
      : statusByStage[state.stage];

  actionButtons.forEach((button) => {
    button.disabled = state.stage === STAGES.RUNNING;
  });
}

function runAgentSequence() {
  window.clearTimeout(runTimer);
  state = transition(state, 'START_RUN');
  render();

  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  const interval = reducedMotion ? 30 : 420;

  const advance = () => {
    state = transition(state, 'ADVANCE_AGENT');
    render();

    if (state.stage === STAGES.RUNNING) {
      runTimer = window.setTimeout(advance, interval);
    }
  };

  runTimer = window.setTimeout(advance, interval);
}

function dispatch(event) {
  if (event === 'START_RUN') {
    runAgentSequence();
    return;
  }

  if (event === 'RESET') window.clearTimeout(runTimer);
  state = transition(state, event);
  render();
}

actionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const event = button.dataset.action;
    if (actionEvents.has(event)) dispatch(event);
  });
});

changeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    dispatch({ type: 'SELECT_CHANGE', changeId: button.dataset.change });
  });
});

render();
