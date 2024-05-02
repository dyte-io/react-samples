import { DyteEndedScreen } from "@dytesdk/react-ui-kit";
import { UIConfig } from "@dytesdk/ui-kit";
import DyteClient from "@dytesdk/web-core";
import { CustomStates, SetStates } from "../types";

export function MeetingOver({
  meeting,
  config,
  states,
}: { meeting: DyteClient, config: UIConfig,  states: CustomStates, setStates: SetStates}) {
    return (
        <main className='flex w-full h-full justify-center items-center'>
          <DyteEndedScreen meeting={meeting} config={config} states={states} />
        </main>
      );
}