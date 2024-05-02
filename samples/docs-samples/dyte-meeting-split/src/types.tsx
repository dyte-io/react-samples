import type { States } from "@dytesdk/ui-kit";

export type CustomStates = States;

export type SetStates = (newStates: Partial<CustomStates>) => void;