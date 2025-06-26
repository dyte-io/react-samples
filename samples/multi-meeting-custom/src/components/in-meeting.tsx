import {
  RtkStage,
  RtkGrid,
  RtkNotifications,
  RtkParticipantsAudio,
  RtkSidebar,
  RtkControlbar,
  RtkHeader,
} from '@cloudflare/realtimekit-react-ui';

function InMeeting() {
  return (
    <div className="flex flex-col w-full h-full">
      <header>
        <RtkHeader />
      </header>
      <main className="flex w-full flex-1">
        <RtkStage className="flex w-full flex-1 p-2">
          <RtkGrid />
          <RtkNotifications />
          <RtkSidebar />
        </RtkStage>
        <RtkParticipantsAudio />
      </main>
      <footer className="flex w-full overflow-visible">
        <RtkControlbar />
      </footer>
    </div>
  );
}

export default InMeeting;
