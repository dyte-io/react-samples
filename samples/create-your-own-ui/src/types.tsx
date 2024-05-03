import type { States } from "@dytesdk/ui-kit";

export type CustomStates = States & { activeMediaPreviewModal?: boolean }

export type SetStates = React.Dispatch<React.SetStateAction<CustomStates>>;