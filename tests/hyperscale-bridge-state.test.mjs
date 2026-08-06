import assert from 'node:assert/strict';
import test from 'node:test';

import * as workflow from '../hyperscale-bridge-state.mjs';

const {
  AGENTS,
  CHANGE_TRACES,
  STAGES,
  createInitialState,
  transition,
} = workflow;

test('defines the five agents that coordinate the engineering loop', () => {
  assert.deepEqual(
    AGENTS?.map(({ id, name }) => ({ id, name })),
    [
      { id: 'altium', name: 'Altium Change Agent' },
      { id: 'mapping', name: 'Context Mapping Agent' },
      { id: 'inventor', name: 'Inventor Assembly Agent' },
      { id: 'impact', name: 'Constraint & Impact Agent' },
      { id: 'return', name: 'Review & Return Agent' },
    ]
  );
});

test('defines three complete source-to-resolution traces', () => {
  assert.equal(CHANGE_TRACES?.length, 3);
  assert.deepEqual(
    CHANGE_TRACES.map(({ id, change, mapping, constraint, impact }) => ({
      id,
      change,
      mapping,
      constraint,
      impact,
    })),
    [
      {
        id: 'capacitor',
        change: 'Capacitor bank moved 18 mm',
        mapping: 'Cold-plate relationship',
        constraint: 'No physical overlap',
        impact: '4.2 mm interference',
      },
      {
        id: 'connector',
        change: 'Connector J17 rotated 90°',
        mapping: 'Service-access envelope',
        constraint: '15 mm minimum access',
        impact: '8 mm available',
      },
      {
        id: 'mount',
        change: 'Mounting hole H4 shifted 6 mm',
        mapping: 'Cabinet standoff axis',
        constraint: '≤ 0.5 mm alignment',
        impact: '6 mm misalignment',
      },
    ]
  );
  assert.ok(CHANGE_TRACES.every(({ resolution }) => resolution.length > 0));
});

test('runs every agent in order before entering review', () => {
  let state = transition(createInitialState(), 'START_RUN');

  assert.equal(state.stage, STAGES.RUNNING);
  assert.equal(state.activeAgentIndex, 0);
  assert.deepEqual(state.completedAgentIds, []);

  for (let index = 1; index < AGENTS.length; index += 1) {
    state = transition(state, 'ADVANCE_AGENT');
    assert.equal(state.stage, STAGES.RUNNING);
    assert.equal(state.activeAgentIndex, index);
    assert.deepEqual(
      state.completedAgentIds,
      AGENTS.slice(0, index).map(({ id }) => id)
    );
  }

  state = transition(state, 'ADVANCE_AGENT');
  assert.equal(state.stage, STAGES.REVIEW);
  assert.equal(state.activeAgentIndex, -1);
  assert.deepEqual(state.completedAgentIds, AGENTS.map(({ id }) => id));
});

test('selects a trace and completes the human-approved return flow', () => {
  let state = createInitialState();
  state = transition(state, { type: 'SELECT_CHANGE', changeId: 'connector' });
  assert.equal(state.selectedChangeId, 'connector');

  state = transition(state, 'START_RUN');
  for (let index = 0; index < AGENTS.length; index += 1) {
    state = transition(state, 'ADVANCE_AGENT');
  }
  state = transition(state, 'CREATE_PROPOSAL');
  assert.equal(state.stage, STAGES.PROPOSED);

  state = transition(state, 'APPROVE');
  assert.equal(state.stage, STAGES.APPROVED);
  assert.equal(state.approvedByEngineer, true);
});

test('ignores invalid events and resets without mutating prior state', () => {
  const initial = createInitialState();
  const invalid = transition(initial, { type: 'SELECT_CHANGE', changeId: 'missing' });
  assert.equal(invalid, initial);

  const running = transition(initial, 'START_RUN');
  assert.notEqual(running, initial);
  assert.equal(initial.stage, STAGES.READY);

  const reset = transition(running, 'RESET');
  assert.deepEqual(reset, createInitialState());
});
