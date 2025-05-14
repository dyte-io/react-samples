import {
  RtkChat,
  RtkParticipants,
  RtkPlugins,
  RtkPolls,
  RtkSidebar,
  RtkSidebarUi,
} from '@cloudflare/realtimekit-react-ui';
import { useState } from 'react';
import { RtkSidebarView } from '@cloudflare/realtimekit-ui/dist/types/components/rtk-sidebar-ui/rtk-sidebar-ui';
import { useCustomStatesStore, useStatesStore } from '../store';

function SidebarPreBuilt() {
  const states = useStatesStore((s) => s.states);

  if (!states.activeSidebar) {
    return null;
  }

  return <RtkSidebar />;
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
  const [view] = useState<RtkSidebarView>('sidebar');

  if (!states.activeSidebar || !states.sidebar) {
    return null;
  }

  const currentTab: typeof states.sidear | 'warnings' = states.sidebar;

  return (
    <RtkSidebarUi
      tabs={tabs}
      currentTab={currentTab}
      view={view}
      className="w-96 max-w-full rounded-xl"
    >
      {currentTab === 'chat' && <RtkChat slot="chat" />}
      {currentTab === 'polls' && <RtkPolls slot="polls" />}
      {currentTab === 'participants' && (
        <RtkParticipants slot="participants" />
      )}
      {currentTab === 'plugins' && <RtkPlugins slot="plugins" />}
      {currentTab === 'warnings' && (
        <div slot="warnings" className="flex justify-center items-center">
          <div>Do not cheat in the exam</div>
        </div>
      )}
    </RtkSidebarUi>
  );
}

// export default SidebarPreBuilt; // Uncomment if you want prebuilt sidebar
export default SidebarWithCustomUI; // Uncomment if you want custom sidebar
