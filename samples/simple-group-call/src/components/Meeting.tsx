import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core';
import {
  DyteParticipantsAudio,
  DyteSetupScreen,
  DyteNotifications,
  DyteHeader,
  DyteGrid,
  DyteSidebar,
  DyteDialogManager,
} from '@dytesdk/react-ui-kit';
import { States } from '@dytesdk/ui-kit';
import { useState } from 'react';
import { CustomFooter } from './Footer';


export default function MeetingUI() {

  const { meeting } = useDyteMeeting();
  const [ dyteState, setDyteState ] = useState<States>();
  const roomJoined = useDyteSelector((meeting) => meeting.self.roomJoined);

  const updateUIState = (e: any) => setDyteState(e.detail);

  // Show setup screen if user hasn't joined the room
  if (!roomJoined) {
    return <DyteSetupScreen meeting={meeting} />;
  }

  return (
    <div className="w-full h-full flex flex-col">
      
      <DyteHeader meeting={meeting} className="py-2 flex items-center justify-between" />

      <div style={{ flexGrow: 1, display: 'flex', flexDirection:'row'}}>
        <DyteGrid meeting={meeting} style={{ flexGrow: 1 }} />
        {dyteState?.activeSidebar &&  <DyteSidebar meeting={meeting} style={{ maxWidth: "360px" }} states={dyteState} onDyteStateUpdate={updateUIState} />}
      </div>
      
      {/* Custom Footer with custom buttons */}
      <CustomFooter updateUIState={updateUIState} />

      {/* Play participant audio */}
      <DyteParticipantsAudio meeting={meeting} />
      {/* Handles Meeting Notification */}
      <DyteNotifications meeting={meeting} states={dyteState} />
      {/* Handles different dialogs such as settings */}
      <DyteDialogManager meeting={meeting} states={dyteState} />
    </div>
  );
  }