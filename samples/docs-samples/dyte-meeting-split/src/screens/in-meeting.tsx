import type DyteClient from '@dytesdk/web-core';
import { UIConfig }  from '@dytesdk/ui-kit/dist/types/types/ui-config';
import { CustomStates, SetStates } from '../types';
import { DyteHeader, DyteStage, DyteGrid, DyteNotifications, DyteSidebar, DyteParticipantsAudio, DyteDialogManager, DyteControlbar } from '@dytesdk/react-ui-kit';

export function InMeeting({
    meeting,
    config,
    states,
    setStates,
}: { meeting: DyteClient, config: UIConfig,  states: CustomStates, setStates: SetStates}) {
    return (
        <div
          className="flex flex-col w-full h-full"
          ref={(el) => {
            el?.addEventListener('dyteStateUpdate', (e) => {
              const { detail: newStateUpdate } = e as unknown as { detail: CustomStates };
              console.log('dyteStateUpdateSetup:: ', newStateUpdate);
              setStates((oldState: CustomStates) => { return {
                ...oldState,
                ...newStateUpdate,
              }});
            });
          }}
        >
          <header>
            <DyteHeader meeting={meeting} config={config} className='flex justify-between'/>
          </header>
    
          <main className='flex w-full flex-1' style={{
            backgroundColor: (meeting.self.config as any).colors?.background,
            color: (meeting.self.config as any).colors?.text,
          }}>
            <DyteStage className='flex w-full flex-1 p-2'>
              <DyteGrid meeting={meeting} config={config} states={states}/>
              <DyteNotifications meeting={meeting} config={config}  states={states}/>
              {states.activeSidebar && <DyteSidebar meeting={meeting} config={config} states={states}/>}
            </DyteStage>
            <DyteParticipantsAudio meeting={meeting}/>
            <DyteDialogManager meeting={meeting} config={config} states={states}/>
          </main>
    
          <footer className='flex w-full overflow-visible'>
            <DyteControlbar meeting={meeting} config={config}  states={states} className='flex w-full overflow-visible	justify-between'/>
          </footer>
          
        </div>
      );
}