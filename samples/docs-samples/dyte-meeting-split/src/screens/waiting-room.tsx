import { DyteWaitingScreen } from "@dytesdk/react-ui-kit";
import { UIConfig } from "@dytesdk/ui-kit";
import DyteClient from "@dytesdk/web-core";
import { CustomStates, SetStates } from "../types";

export function WaitingRoom({
    meeting,
    config,
}: { meeting: DyteClient, config: UIConfig,  states: CustomStates, setStates: SetStates}) {
    return (
        <main className='flex w-full h-full justify-center items-center' style={{
            backgroundColor: (meeting.self.config as any).colors?.background,
            color: (meeting.self.config as any).colors?.text,
      }}>
          <DyteWaitingScreen meeting={meeting} config={config}/>
        </main>
      );
}