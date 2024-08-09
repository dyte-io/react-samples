import type { States } from "@dytesdk/ui-kit";
import { DyteSidebarSection } from "@dytesdk/ui-kit/dist/types/components/dyte-sidebar/dyte-sidebar";

export type CustomSideBarTabs = DyteSidebarSection | 'warnings';

export type CustomStates = States & { activeMediaPreviewModal?: boolean, customSidebar?: CustomSideBarTabs }

export type SetStates = React.Dispatch<React.SetStateAction<CustomStates>>;