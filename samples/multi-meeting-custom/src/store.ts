import { getInitialStates, States } from '@cloudflare/realtimekit-ui';
import { create } from 'zustand';
import { CustomStates } from './types';

type StatesStore = {
  states: States;
  setStates: (states: States) => void;
};

type CustomStatesStore = {
  states: CustomStates;
  setCustomStates: (states: CustomStates) => void;
};

// Factory function to create isolated state stores per meeting
export const createStatesStore = () => create<StatesStore>((set) => ({
  states: getInitialStates(),
  setStates: (states) => set({ states }),
}));

// Factory function to create isolated custom state stores per meeting
export const createCustomStatesStore = () => create<CustomStatesStore>((set) => ({
  states: {},
  setCustomStates: (states) => set({ states }),
}));

// Store registry to manage multiple store instances
const storeRegistry = new Map<string, ReturnType<typeof createStatesStore>>();
const customStoreRegistry = new Map<string, ReturnType<typeof createCustomStatesStore>>();

// Get or create a store instance for a specific meeting
export const getStatesStore = (meetingId: string) => {
  console.log(`[STORE] getStatesStore called for meeting: ${meetingId}`);
  if (!storeRegistry.has(meetingId)) {
    console.log(`[STORE] Creating new states store for meeting: ${meetingId}`);
    const newStore = createStatesStore();
    storeRegistry.set(meetingId, newStore);
    console.log(`[STORE] Store registry now has ${storeRegistry.size} stores`);
  } else {
    console.log(`[STORE] Reusing existing store for meeting: ${meetingId}`);
  }
  return storeRegistry.get(meetingId)!;
};

// Get or create a custom store instance for a specific meeting
export const getCustomStatesStore = (meetingId: string) => {
  console.log(`[STORE] getCustomStatesStore called for meeting: ${meetingId}`);
  if (!customStoreRegistry.has(meetingId)) {
    console.log(`[STORE] Creating new custom states store for meeting: ${meetingId}`);
    const newStore = createCustomStatesStore();
    customStoreRegistry.set(meetingId, newStore);
    console.log(`[STORE] Custom store registry now has ${customStoreRegistry.size} stores`);
  } else {
    console.log(`[STORE] Reusing existing custom store for meeting: ${meetingId}`);
  }
  return customStoreRegistry.get(meetingId)!;
};

// Cleanup function to remove stores when meetings are destroyed
export const cleanupStores = (meetingId: string) => {
  console.log(`[STORE] Cleaning up stores for meeting: ${meetingId}`);
  const hadStore = storeRegistry.delete(meetingId);
  const hadCustomStore = customStoreRegistry.delete(meetingId);
  console.log(`[STORE] Cleanup result - states store: ${hadStore}, custom store: ${hadCustomStore}`);
  console.log(`[STORE] Remaining stores - states: ${storeRegistry.size}, custom: ${customStoreRegistry.size}`);
};
