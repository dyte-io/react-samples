import type DyteClient from '@dytesdk/web-core';
import { UIConfig }  from '@dytesdk/ui-kit/dist/types/types/ui-config';
import { CustomStates, SetStates } from '../types';
import { DyteHeader, DyteStage, DyteGrid, DyteNotifications, DyteSidebar, DyteParticipantsAudio, DyteDialogManager, DyteControlbar, DyteControlbarButton } from '@dytesdk/react-ui-kit';
import MeetingHeader from './meeting-header';
import MeetingControlBar from './meeting-control-bar';
import MeetingSideBar from './meeting-sidebar';
import CustomDyteGrid from './custom-dyte-grid';
import EffectsManager from './EffectsManager';
import { useState } from 'react';
import ReactionsManager from './ReactionsManager';
function InMeeting({
    meeting,
    config,
    states,
    setStates,
}: { meeting: DyteClient, config: UIConfig,  states: CustomStates, setStates: SetStates}) {
  
  const [effectsDialog, setEffectsDialog] = useState(false);
  const [reactionsDialog, setReactionsDialog] = useState(false);
  
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
            <MeetingHeader meeting={meeting} config={config} states={states} setStates={setStates}/>
          </header>
    
          <main className='flex w-full flex-1' style={{
            backgroundColor: '#272727',
            color: '#ffffff',
          }}>
            <DyteStage className='flex w-full flex-1 p-2'>
              <CustomDyteGrid meeting={meeting} config={config} states={states} setStates={setStates}/>
              <DyteNotifications meeting={meeting} config={config}  states={states}/>
              <MeetingSideBar meeting={meeting} config={config} states={states} setStates={setStates}/>
            </DyteStage>
            <DyteParticipantsAudio meeting={meeting}/>
            <DyteDialogManager meeting={meeting} config={config} states={states}/>
          </main>
    
          <footer className='flex w-full overflow-visible'>
            <MeetingControlBar meeting={meeting} config={config} states={states} setStates={setStates} setEffectsDialog={setEffectsDialog} setReactionsDialog={setReactionsDialog} />
          </footer>

          <EffectsManager
                meeting={meeting}
                isOpen={effectsDialog}
                onClose={() => setEffectsDialog(false)}
          />

          <ReactionsManager
            meeting={meeting}
            isOpen={reactionsDialog}
            onClose={() => setReactionsDialog(false)}
          />
          
        </div>
      );
}

export default InMeeting;