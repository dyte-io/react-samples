import { DyteBreakoutRoomsToggle, DyteCameraToggle, DyteChatToggle, DyteControlbar, DyteControlbarButton, DyteFullscreenToggle, DyteLeaveButton, DyteMicToggle, DyteMoreToggle, DyteMuteAllButton, DyteParticipantsToggle, DytePipToggle, DytePluginsToggle, DytePoll, DytePollsToggle, DyteRecordingToggle, DyteScreenShareToggle, DyteSettingsToggle, DyteStageToggle } from "@dytesdk/react-ui-kit";
import { UIConfig, defaultIconPack } from "@dytesdk/ui-kit";
import DyteClient from "@dytesdk/web-core";
import { CustomStates, SetStates } from "../types";

function ControlBarPreBuilt({
    meeting, states, config,
}: { meeting: DyteClient, config: UIConfig, states: CustomStates, setStates: SetStates }
){
    return <DyteControlbar meeting={meeting} config={config}  states={states} className='flex w-full overflow-visible	justify-between'/>;
}

function ControlBarWithCustomUI({
    meeting, states, config, setStates,
}: { meeting: DyteClient, config: UIConfig, states: CustomStates, setStates: SetStates }
){

    const fullScreenTargetElement = document.querySelector('#root') as HTMLElement;

    return <div className="flex w-full bg-black text-white justify-between">
        <div id="controlbar-left" className="flex items-center overflow-visible justify-center">
            <DyteFullscreenToggle states={states} targetElement={fullScreenTargetElement}/>
            <DyteSettingsToggle states={states} />
            <DyteScreenShareToggle states={states} meeting={meeting} />
        </div>
        <div id="controlbar-center" className="flex items-center overflow-visible justify-center">
            <DyteMicToggle meeting={meeting} />
            <DyteCameraToggle meeting={meeting} />
            <DyteStageToggle meeting={meeting} />
            <DyteLeaveButton/>
            <DyteMoreToggle states={states}>
                <div slot="more-elements">
                    <DytePipToggle meeting={meeting} states={states} config={config} variant="horizontal" />
                    <DyteMuteAllButton meeting={meeting} variant="horizontal"/>
                    <DyteBreakoutRoomsToggle meeting={meeting} states={states} variant="horizontal"/>
                    <DyteRecordingToggle meeting={meeting} variant="horizontal"/>
                </div>
            </DyteMoreToggle>
        </div>
        <div id="controlbar-right" className="flex items-center overflow-visible justify-center">
            <DyteChatToggle meeting={meeting} states={states}/>
            <DytePollsToggle meeting={meeting} states={states}/>
            <DyteParticipantsToggle meeting={meeting} states={states}/>
            <DytePluginsToggle meeting={meeting} states={states} />
            <DyteControlbarButton
                onClick={() => {
                    if(states.activeSidebar && !states.sidebar && states.customSidebar === 'warnings'){
                        setStates( (oldState) => { return { ...oldState, activeSidebar: false, sidebar: null, customSidebar: null }});    
                    } else {
                        setStates( (oldState) => { return { ...oldState, activeSidebar: true, sidebar: null, customSidebar: 'warnings' }});
                    }
                }}
                icon={defaultIconPack.add}
                label={'Open Custom SideBar'}
            />
        </div>
    </div>
}

// export default ControlBarPreBuilt; // uncomment if you are fine with prebuilt control bar
export default ControlBarWithCustomUI; // uncomment if you want to create a custom control bar