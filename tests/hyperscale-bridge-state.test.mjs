import assert from 'node:assert/strict';
import test from 'node:test';

import {
  STAGES,
  createInitialState,
  transition,
} from '../hyperscale-bridge-state.mjs';

test('starts with three Altium changes ready to synchronize', () => {
  const state = createInitialState();

  assert.equal(state.stage, STAGES.READY);
  assert.equal(state.changes.length, 3);
  assert.equal(state.findings.length, 0);
  assert.equal(state.approvedByEngineer, false);
});

test('moves through the complete human-approved workflow', () => {
  let state = createInitialState();

  state = transition(state, 'START_SYNC');
  assert.equal(state.stage, STAGES.SYNCING);

  state = transition(state, 'COMPLETE_SYNC');
  assert.equal(state.stage, STAGES.REVIEW);
  assert.equal(state.findings.length, 3);

  state = transition(state, 'CREATE_PROPOSAL');
  assert.equal(state.stage, STAGES.PROPOSED);

  state = transition(state, 'APPROVE');
  assert.equal(state.stage, STAGES.APPROVED);
  assert.equal(state.approvedByEngineer, true);
});

test('ignores invalid transitions and resets to a clean state', () => {
  const initial = createInitialState();
  const unchanged = transition(initial, 'APPROVE');

  assert.deepEqual(unchanged, initial);

  const review = transition(
    transition(initial, 'START_SYNC'),
    'COMPLETE_SYNC'
  );
  const reset = transition(review, 'RESET');

  assert.deepEqual(reset, createInitialState());
});

test('does not mutate the previous state', () => {
  const initial = createInitialState();
  const next = transition(initial, 'START_SYNC');

  assert.notEqual(next, initial);
  assert.equal(initial.stage, STAGES.READY);
});
