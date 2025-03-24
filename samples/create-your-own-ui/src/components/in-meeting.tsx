import {
  DyteStage,
  DyteGrid,
  DyteNotifications,
  DyteParticipantsAudio,
  DyteDialogManager,
} from '@dytesdk/react-ui-kit';
import MeetingHeader from './meeting-header';
import MeetingControlBar from './meeting-control-bar';
import MeetingSideBar from './meeting-sidebar';

function InMeeting() {
  return (
    <div className="flex flex-col w-full h-full">
      <header>
        <MeetingHeader />
      </header>

      <main className="flex w-full flex-1">
        <DyteStage className="flex w-full flex-1 p-2">
          <DyteGrid />
          <DyteNotifications />
          <MeetingSideBar />
        </DyteStage>
        <DyteParticipantsAudio />
      </main>

      <footer className="flex w-full overflow-visible">
        <MeetingControlBar />
      </footer>
    </div>
  );
}

export default InMeeting;
