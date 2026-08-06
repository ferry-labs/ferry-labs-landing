export const STAGES = Object.freeze({
  READY: 'ready',
  SYNCING: 'syncing',
  REVIEW: 'review',
  PROPOSED: 'proposed',
  APPROVED: 'approved',
});

const changes = Object.freeze([
  Object.freeze({
    id: 'cap-bank',
    source: 'Altium C.14',
    title: 'DC-link capacitor bank',
    detail: 'Moved 18 mm toward cold plate',
  }),
  Object.freeze({
    id: 'gate-connector',
    source: 'Altium C.14',
    title: 'Gate-driver connector J17',
    detail: 'Rotated 90° clockwise',
  }),
  Object.freeze({
    id: 'mount-h4',
    source: 'Altium C.14',
    title: 'Mounting hole H4',
    detail: 'Shifted 6 mm on X axis',
  }),
]);

const findings = Object.freeze([
  Object.freeze({
    id: 'cold-plate',
    severity: 'conflict',
    label: 'Physical interference',
    title: 'Capacitor bank intersects cold plate',
    measure: '4.2 mm',
    expected: 'No overlap',
    source: 'C14 · capacitor move',
    constraint: 'M08 · cold plate envelope',
    description:
      'The revised capacitor position enters the reserved cold-plate volume. Closest geometry is highlighted in the assembly.',
    modelPart: 'capacitor',
  }),
  Object.freeze({
    id: 'service-access',
    severity: 'review',
    label: 'Access constraint',
    title: 'Connector service access reduced',
    measure: '8.0 mm',
    expected: '≥ 15.0 mm',
    source: 'C14 · connector rotation',
    constraint: 'M08 · service envelope',
    description:
      'The rotated connector leaves insufficient room for the specified service tool. An engineer should confirm the access envelope.',
    modelPart: 'connector',
  }),
  Object.freeze({
    id: 'standoff',
    severity: 'conflict',
    label: 'Reference mismatch',
    title: 'Mounting hole no longer meets standoff',
    measure: '6.0 mm',
    expected: '≤ 0.5 mm',
    source: 'C14 · H4 move',
    constraint: 'M08 · standoff axis',
    description:
      'Hole H4 moved away from its linked mechanical reference. The proposed return change restores the shared axis.',
    modelPart: 'mount',
  }),
]);

export function createInitialState() {
  return {
    stage: STAGES.READY,
    changes: [...changes],
    findings: [],
    approvedByEngineer: false,
  };
}

export function transition(state, event) {
  if (event === 'RESET') return createInitialState();

  const nextStage = {
    [`${STAGES.READY}:START_SYNC`]: STAGES.SYNCING,
    [`${STAGES.SYNCING}:COMPLETE_SYNC`]: STAGES.REVIEW,
    [`${STAGES.REVIEW}:CREATE_PROPOSAL`]: STAGES.PROPOSED,
    [`${STAGES.PROPOSED}:APPROVE`]: STAGES.APPROVED,
  }[`${state.stage}:${event}`];

  if (!nextStage) return state;

  return {
    ...state,
    stage: nextStage,
    findings:
      nextStage === STAGES.REVIEW ||
      nextStage === STAGES.PROPOSED ||
      nextStage === STAGES.APPROVED
        ? [...findings]
        : state.findings,
    approvedByEngineer: nextStage === STAGES.APPROVED,
  };
}
