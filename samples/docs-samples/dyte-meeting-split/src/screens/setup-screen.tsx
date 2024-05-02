import type DyteClient from '@dytesdk/web-core';
import { UIConfig }  from '@dytesdk/ui-kit/dist/types/types/ui-config';
import { CustomStates, SetStates } from '../types';
import { DyteDialogManager, DyteSetupScreen } from '@dytesdk/react-ui-kit';

export function SetupScreen({
    meeting,
    config,
    states,
    setStates,
}: { meeting: DyteClient, config: UIConfig,  states: CustomStates, setStates: SetStates}) {
    return (
    <main className='w-full h-full' style={{
        backgroundColor: (meeting.self.config as any).colors?.background,
        color: (meeting.self.config as any).colors?.text,
    }} ref={(el) => {
      el?.addEventListener('dyteStateUpdate', (e) => {
        const { detail: newStateUpdate } = e as unknown as { detail: CustomStates };
        console.log('dyteStateUpdateSetup:: ', newStateUpdate);
        setStates((oldState: CustomStates) => { return {
          ...oldState,
          ...newStateUpdate,
        }});
      });
    }}>
        <DyteSetupScreen meeting={meeting} config={config} states={states}/>
        <DyteDialogManager meeting={meeting} config={config} states={states}/>
      </main>
    );
}