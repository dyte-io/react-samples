import create from 'zustand';
import { persist } from 'zustand/middleware';
import gracefulStorage from './graceful-storage';

export interface DyteStore {
  displayName: string;
  clientSpecificId: string;
  audioTranscriptions: boolean;
  presets: { name: string; id: string }[];
  effects: {
    audio: {
      krisp: boolean;
    };
    video: {
      background: 'none' | 'blur' | 'image';
      backgroundImage: string;
    };
  };
  updateStore: <T extends keyof DyteStore>(key: T, value: DyteStore[T]) => void;
}

export const useDyteStore = create<DyteStore>(
  persist(
    (set, get) => ({
      displayName: '',
      clientSpecificId: Math.random().toString(36).substring(7),
      audioTranscriptions: false,
      presets: [],
      effects: {
        audio: {
          krisp: false,
        },
        video: {
          background: 'none',
          backgroundImage: '',
        },
      },
      updateStore: (key, value) => {
        set((state) => Object.assign({}, state, { [key]: value }));
      },
    }),
    {
      name: 'dyte-store',
      getStorage: () => gracefulStorage,
    }
  )
);

export const storeSelector = (store: DyteStore) => ({
  clientSpecificId: store.clientSpecificId,
  displayName: store.displayName,
  presets: store.presets,
  effects: store.effects,
  updateStore: store.updateStore,
});
