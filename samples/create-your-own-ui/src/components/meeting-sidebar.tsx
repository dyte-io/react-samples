import { DyteChat, DyteParticipants, DytePlugins, DytePolls, DyteSidebar, DyteSidebarUi } from "@dytesdk/react-ui-kit";
import { UIConfig } from "@dytesdk/ui-kit";
import DyteClient from "@dytesdk/web-core";
import { CustomSideBarTabs, CustomStates, SetStates } from "../types";
import { useEffect, useState } from "react";
import { DyteSidebarView } from "@dytesdk/ui-kit/dist/types/components/dyte-sidebar-ui/dyte-sidebar-ui";
import { DyteSidebarSection } from "@dytesdk/ui-kit/dist/types/components/dyte-sidebar/dyte-sidebar";

function SidebarPreBuilt({
    meeting, states, config, setStates,
}: { meeting: DyteClient, config: UIConfig, states: CustomStates, setStates: SetStates }
){
    if(!states.activeSidebar){
        return null;
    }
    return <DyteSidebar meeting={meeting} config={config} states={states}/>;
}

function SidebarWithCustomUI({
    meeting, states, config, setStates,
}: { meeting: DyteClient, config: UIConfig, states: CustomStates, setStates: SetStates }
){
    const [tabs, setTabs] = useState([
        { id: 'chat', name: 'chat' },
        { id: 'polls', name: 'polls' },
        { id: 'participants', name: 'participants' },
        { id: 'plugins', name: 'plugins' },
        { id: 'warnings', name: 'warnings' }
    ]);
    const [view, setView] = useState<DyteSidebarView>('sidebar');

    if(!states.activeSidebar || (!states.sidebar && !states.customSidebar)){
        return null;
    }

    const currentTab = states.sidebar || states.customSidebar;

    return (
    <DyteSidebarUi
        tabs={tabs}
        currentTab={currentTab}
        view={view}
        onTabChange={(e) => {
            setStates((oldState) => {
                return {
                    ...oldState,
                    activeSidebar: true,
                    customSidebar: e.detail,
                    sidebar: e.detail,
                }
            });
        }}
        className="w-80 "
        onSidebarClose={() => {
            setStates((oldState) => {
                return {
                    ...oldState,
                    activeSidebar: false,
                    sidebar: null,
                    customSidebar: null,
                }
            });
        }}>
        {currentTab === 'chat' && <DyteChat meeting={meeting} config={config} slot="chat" /> }
        {currentTab === 'polls' && <DytePolls meeting={meeting} config={config} slot="polls" /> }
        {currentTab === 'participants' && <DyteParticipants meeting={meeting} config={config} states={states} slot="participants" /> }
        {currentTab === 'plugins' && <DytePlugins meeting={meeting} config={config} slot="plugins" /> }
        {currentTab === 'warnings' && <div slot="warnings" className="flex justify-center items-center">
            <div>Do not cheat in the exam</div>
        </div> }
    </DyteSidebarUi>);

}

// export default SidebarPreBuilt; // Uncomment if you want prebuilt sidebar
export default SidebarWithCustomUI; // Uncomment if you want custom sidebar
