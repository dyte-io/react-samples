import {
  DyteChat,
  DyteParticipants,
  DytePlugins,
  DytePolls,
  DyteSidebar,
  DyteSidebarUi,
} from '@dytesdk/react-ui-kit';
import { useState } from 'react';
import { DyteSidebarView } from '@dytesdk/ui-kit/dist/types/components/dyte-sidebar-ui/dyte-sidebar-ui';
import { useCustomStatesStore, useStatesStore } from '../store';

function SidebarPreBuilt() {
  const states = useStatesStore((s) => s.states);

  if (!states.activeSidebar) {
    return null;
  }

  return <DyteSidebar />;
}

const tabs = [
  { id: 'chat', name: 'chat' },
  { id: 'polls', name: 'polls' },
  { id: 'participants', name: 'participants' },
  { id: 'plugins', name: 'plugins' },
  { id: 'warnings', name: 'warnings' },
];

function SidebarWithCustomUI() {
  const states = useStatesStore((s) => s.states);
  const [view] = useState<DyteSidebarView>('sidebar');

  if (!states.activeSidebar || !states.sidebar) {
    return null;
  }

  const currentTab: typeof states.sidear | 'warnings' = states.sidebar;

  return (
    <DyteSidebarUi
      tabs={tabs}
      currentTab={currentTab}
      view={view}
      className="w-96 max-w-full rounded-xl"
    >
      {currentTab === 'chat' && <DyteChat slot="chat" />}
      {currentTab === 'polls' && <DytePolls slot="polls" />}
      {currentTab === 'participants' && (
        <DyteParticipants slot="participants" />
      )}
      {currentTab === 'plugins' && <DytePlugins slot="plugins" />}
      {currentTab === 'warnings' && (
        <div slot="warnings" className="flex justify-center items-center">
          <div>Do not cheat in the exam</div>
        </div>
      )}
    </DyteSidebarUi>
  );
}

// export default SidebarPreBuilt; // Uncomment if you want prebuilt sidebar
export default SidebarWithCustomUI; // Uncomment if you want custom sidebar
