import { DyteSidebarSection } from '@dytesdk/ui-kit/dist/types/components/dyte-sidebar/dyte-sidebar';

export type CustomSideBarTabs = DyteSidebarSection | 'warnings';

export type CustomStates = {
  activeMediaPreviewModal?: boolean;
};

export type SetStates = React.Dispatch<React.SetStateAction<CustomStates>>;
