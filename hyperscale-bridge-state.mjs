export const STAGES = Object.freeze({
  READY: 'ready',
  RUNNING: 'running',
  REVIEW: 'review',
  PROPOSED: 'proposed',
  APPROVED: 'approved',
});

export const AGENTS = Object.freeze([
  Object.freeze({
    id: 'altium',
    name: 'Altium Change Agent',
    action: 'Captures revision C.14 and its three changed objects.',
    contextKey: 'revision',
  }),
  Object.freeze({
    id: 'mapping',
    name: 'Context Mapping Agent',
    action: 'Links electrical objects to mechanical geometry and rules.',
    contextKey: 'mapping',
  }),
  Object.freeze({
    id: 'inventor',
    name: 'Inventor Assembly Agent',
    action: 'Stages the mapped geometry in assembly revision M.08.',
    contextKey: 'geometry',
  }),
  Object.freeze({
    id: 'impact',
    name: 'Constraint & Impact Agent',
    action: 'Evaluates clearance, access, and alignment constraints.',
    contextKey: 'constraint',
  }),
  Object.freeze({
    id: 'return',
    name: 'Review & Return Agent',
    action: 'Builds a traceable Altium return proposal for review.',
    contextKey: 'decision',
  }),
]);

export const CHANGE_TRACES = Object.freeze([
  Object.freeze({
    id: 'capacitor',
    code: 'C1',
    change: 'Capacitor bank moved 18 mm',
    sourceDetail: 'DC-link bank · X +18.0 mm',
    mapping: 'Cold-plate relationship',
    constraint: 'No physical overlap',
    impact: '4.2 mm interference',
    severity: 'conflict',
    resolution: 'Move capacitor bank 7 mm away from cold plate',
  }),
  Object.freeze({
    id: 'connector',
    code: 'C2',
    change: 'Connector J17 rotated 90°',
    sourceDetail: 'Gate-driver connector · RZ +90°',
    mapping: 'Service-access envelope',
    constraint: '15 mm minimum access',
    impact: '8 mm available',
    severity: 'review',
    resolution: 'Restore the 15 mm service envelope at J17',
  }),
  Object.freeze({
    id: 'mount',
    code: 'C3',
    change: 'Mounting hole H4 shifted 6 mm',
    sourceDetail: 'Board datum H4 · X +6.0 mm',
    mapping: 'Cabinet standoff axis',
    constraint: '≤ 0.5 mm alignment',
    impact: '6 mm misalignment',
    severity: 'conflict',
    resolution: 'Relink H4 to the Inventor standoff axis',
  }),
]);

export function createInitialState() {
  return {
    stage: STAGES.READY,
    activeAgentIndex: -1,
    completedAgentIds: [],
    selectedChangeId: CHANGE_TRACES[0].id,
    approvedByEngineer: false,
  };
}

export function transition(state, event) {
  const type = typeof event === 'string' ? event : event?.type;

  if (type === 'RESET') return createInitialState();

  if (type === 'SELECT_CHANGE') {
    const changeId = event?.changeId;
    if (!CHANGE_TRACES.some(({ id }) => id === changeId)) return state;
    if (state.selectedChangeId === changeId) return state;
    return { ...state, selectedChangeId: changeId };
  }

  if (state.stage === STAGES.READY && type === 'START_RUN') {
    return {
      ...state,
      stage: STAGES.RUNNING,
      activeAgentIndex: 0,
      completedAgentIds: [],
    };
  }

  if (state.stage === STAGES.RUNNING && type === 'ADVANCE_AGENT') {
    const completedAgentIds = AGENTS.slice(0, state.activeAgentIndex + 1).map(
      ({ id }) => id
    );
    const isLastAgent = state.activeAgentIndex === AGENTS.length - 1;

    return {
      ...state,
      stage: isLastAgent ? STAGES.REVIEW : STAGES.RUNNING,
      activeAgentIndex: isLastAgent ? -1 : state.activeAgentIndex + 1,
      completedAgentIds,
    };
  }

  if (state.stage === STAGES.REVIEW && type === 'CREATE_PROPOSAL') {
    return { ...state, stage: STAGES.PROPOSED };
  }

  if (state.stage === STAGES.PROPOSED && type === 'APPROVE') {
    return {
      ...state,
      stage: STAGES.APPROVED,
      approvedByEngineer: true,
    };
  }

  return state;
}
