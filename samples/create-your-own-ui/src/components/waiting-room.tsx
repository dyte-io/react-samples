import { DyteWaitingScreen } from "@dytesdk/react-ui-kit";
import { UIConfig } from "@dytesdk/ui-kit";
import DyteClient from "@dytesdk/web-core";
import { CustomStates, SetStates } from "../types";

function WaitingRoom({
    meeting,
    config,
}: { meeting: DyteClient, config: UIConfig,  states: CustomStates, setStates: SetStates}) {
    return (
        <main className='flex w-full h-full justify-center items-center' style={{
            backgroundColor: '#272727',
            color: '#ffffff',
      }}>
          <DyteWaitingScreen meeting={meeting} config={config}/>
        </main>
      );
}

export default WaitingRoom;