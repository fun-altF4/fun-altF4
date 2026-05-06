import { create } from 'zustand';

export type SceneState = 'arrival' | 'cinematic' | 'conversation';
export type VisitorType =
  | 'recruiter'
  | 'founder'
  | 'engineer'
  | 'philosopher'
  | 'curious'
  | 'ambiguous';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isMirror?: boolean;
  timestamp: Date;
}

interface CursorState {
  x: number;
  y: number;
}

interface SceneStore {
  // Scene state
  sceneState: SceneState;
  setSceneState: (state: SceneState) => void;

  // Cinematic progress (0-1)
  scrollProgress: number;
  setScrollProgress: (progress: number) => void;

  // Cursor position normalized to [-1, 1]
  cursor: CursorState;
  setCursor: (x: number, y: number) => void;

  // Time of day
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  setTimeOfDay: (time: 'morning' | 'afternoon' | 'evening' | 'night') => void;

  // Visitor classification
  visitorType: VisitorType;
  visitorConfidence: number;
  setVisitorType: (type: VisitorType, confidence: number) => void;

  // Chat state
  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  isStreaming: boolean;
  setIsStreaming: (streaming: boolean) => void;

  // Persona/Mirror
  showPersonaIndicator: boolean;
  setShowPersonaIndicator: (show: boolean) => void;

  // Audio state
  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;

  // Per-visit randomization
  selectedCluster: number;
  initializeCluster: () => void;

  // Session ID
  sessionId: string;
  initializeSessionId: () => void;
}

const useStore = create<SceneStore>((set, get) => ({
  // Scene state
  sceneState: 'arrival',
  setSceneState: (state) => set({ sceneState: state }),

  // Cinematic progress
  scrollProgress: 0,
  setScrollProgress: (progress) => set({ scrollProgress: progress }),

  // Cursor
  cursor: { x: 0, y: 0 },
  setCursor: (x, y) => set({ cursor: { x, y } }),

  // Time of day
  timeOfDay: 'afternoon',
  setTimeOfDay: (time) => set({ timeOfDay: time }),

  // Visitor classification
  visitorType: 'ambiguous',
  visitorConfidence: 0,
  setVisitorType: (type, confidence) =>
    set({ visitorType: type, visitorConfidence: confidence }),

  // Chat
  messages: [],
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  clearMessages: () => set({ messages: [] }),
  isStreaming: false,
  setIsStreaming: (streaming) => set({ isStreaming: streaming }),

  // Persona
  showPersonaIndicator: false,
  setShowPersonaIndicator: (show) => set({ showPersonaIndicator: show }),

  // Audio
  audioEnabled: false,
  setAudioEnabled: (enabled) => set({ audioEnabled: enabled }),

  // Per-visit cluster randomization
  selectedCluster: -1,
  initializeCluster: () => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('bhavesh-cluster');
      if (stored !== null) {
        set({ selectedCluster: parseInt(stored, 10) });
      } else {
        const cluster = Math.floor(Math.random() * 7);
        sessionStorage.setItem('bhavesh-cluster', String(cluster));
        set({ selectedCluster: cluster });
      }
    }
  },

  // Session ID
  sessionId: '',
  initializeSessionId: () => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('bhavesh-session-id');
      if (stored) {
        set({ sessionId: stored });
      } else {
        const id = `session-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        sessionStorage.setItem('bhavesh-session-id', id);
        set({ sessionId: id });
      }
    }
  },
}));

export default useStore;
