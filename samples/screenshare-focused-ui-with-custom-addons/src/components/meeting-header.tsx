import { DyteClock, DyteGridPagination, DyteHeader, DyteLivestreamIndicator, DyteLogo, DyteMeetingTitle, DyteParticipantCount, DyteRecordingIndicator, DyteViewerCount } from "@dytesdk/react-ui-kit";
import { UIConfig } from "@dytesdk/ui-kit";
import DyteClient from "@dytesdk/web-core";
import { CustomStates, SetStates } from "../types";

function HeaderPreBuilt({
    meeting, states, config, setStates,
}: { meeting: DyteClient, config: UIConfig, states: CustomStates, setStates: SetStates }
){
    return <DyteHeader meeting={meeting} config={config} className='flex justify-between'/>;
}

function HeaderWithCustomUI({
    meeting, states, config,
}: { meeting: DyteClient, config: UIConfig, states: CustomStates, setStates: SetStates }
){
    
    return <div className='flex justify-between bg-black text-white'>
        <div id="header-left" className="flex items-center h-[48px]">
            <DyteLogo meeting={meeting} />
            <DyteRecordingIndicator meeting={meeting}/>
            <DyteLivestreamIndicator meeting={meeting}/>
        </div>
        <div id="header-center" className="flex items-center h-[48px]">
            <DyteMeetingTitle meeting={meeting}/>
        </div>
        <div id="header-right" className="flex items-center h-[48px]">
            <DyteGridPagination meeting={meeting} states={states}/>
            <DyteParticipantCount meeting={meeting}/>
            <DyteViewerCount meeting={meeting} />
            <DyteClock meeting={meeting} />
        </div>
    </div>
}

export default HeaderPreBuilt; // uncomment if you want the pre built Dyte header
// export default HeaderWithCustomUI; // uncomment if yoi want custom UI