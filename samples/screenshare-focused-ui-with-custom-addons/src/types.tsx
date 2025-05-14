import type { States } from '@cloudflare/realtimekit-ui';
import { RtkSidebarSection } from '@cloudflare/realtimekit-ui/dist/types/components/rtk-sidebar/rtk-sidebar';

export type CustomSideBarTabs = RtkSidebarSection | 'warnings';

export type CustomStates = States & { activeMediaPreviewModal?: boolean, customSidebar?: CustomSideBarTabs }

export type SetStates = React.Dispatch<React.SetStateAction<CustomStates>>;