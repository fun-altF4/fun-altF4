/**
 * bridges-data.ts
 *
 * Seven bridges + their L3 systems (satellites).
 * Labels and positions for Beat 2 (bridge labels) and Beat 4 (satellites).
 *
 * See SECTION 2 BEAT 2 and BEAT 4 for full content.
 */

export const BRIDGES = [
  {
    id: 0,
    name: 'Neurological',
    description: 'Artificial neurons ↔ biological neurons; attention mechanisms ↔ cortical attention; RLHF ↔ dopamine reward prediction error; embeddings ↔ distributed representations',
    satellites: [
      'Mirror Engine',
      'Memory Architecture',
      'Theory-of-Mind Module',
      'Interpretability Therapist',
      'Predictive Processing Engine',
      'Persona Coherence Engine',
    ],
  },
  {
    id: 1,
    name: 'Psychological',
    description: 'Hallucination ↔ confabulation; sycophancy ↔ people-pleasing; chain-of-thought ↔ System 2; ELIZA effect ↔ projection',
    satellites: [
      'Conditioning Audit Trail',
      'Hallucination/Confabulation Lab',
      'Theory of Mind ↔ Mirror',
      'Externalized Self',
      'Wabi-Sabi Mode',
      'Reverse Interview',
    ],
  },
  {
    id: 2,
    name: 'Philosophical',
    description: 'Other-minds problem; hard problem of consciousness; Parfit identity puzzles in checkpointing; determinism symmetry',
    satellites: [
      'Stochastic Parrot Debate',
      'Consciousness Symmetry',
      'Identity & Checkpointing',
      'Phenomenal Property',
      'Other-Minds Problem',
      'Determinism Asymmetry',
    ],
  },
  {
    id: 3,
    name: 'Sociological',
    description: 'Training data as cultural transmission; consensus bias; aggregate as collective unconscious',
    satellites: [
      'Training Data Genealogy',
      'Consensus Bias',
      'Collective Unconscious',
      'Cultural Transmission',
      'Power Asymmetry',
      'Echo Chambers',
    ],
  },
  {
    id: 4,
    name: 'Contemplative',
    description: 'Stateless inference ↔ no-self; pure present ↔ mindfulness; karma as conditioning',
    satellites: [
      'Stateless Anatta',
      'Present Moment',
      'Suffering & Attachment',
      'Conditioning Karma',
      'Emptiness vs Fullness',
      'Liberation Engine',
    ],
  },
  {
    id: 5,
    name: 'Ethical',
    description: 'Alignment ↔ moral development; reward hacking ↔ Goodhart\'s law; specification gaming ↔ legal loopholes',
    satellites: [
      'Moral Development',
      'Alignment by Default',
      'Reward Hacking',
      'Goodhart\'s Law',
      'Specification Gaming',
      'Ethical Gradient',
    ],
  },
  {
    id: 6,
    name: 'Mathematical',
    description: 'Free-energy principle unifying brain and AI; emergence as phase transitions',
    satellites: [
      'Free-Energy Principle',
      'Phase Transitions',
      'Information Theory',
      'Gradient Descent',
      'Gödel Limits',
      'Emergence Science',
    ],
  },
];

// Helper to get bridge by index
export const getBridge = (index: number) => BRIDGES[index];

// Get all bridge names (for Beat 2 labels)
export const getBridgeLabels = () => BRIDGES.map((b) => b.name);
