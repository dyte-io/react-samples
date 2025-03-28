import {
  DyteClock,
  DyteGridPagination,
  DyteHeader,
  DyteLivestreamIndicator,
  DyteLogo,
  DyteMeetingTitle,
  DyteParticipantCount,
  DyteRecordingIndicator,
  DyteViewerCount,
} from '@dytesdk/react-ui-kit';

function HeaderPreBuilt() {
  return <DyteHeader className="flex justify-between bg-black" />;
}

function HeaderWithCustomUI() {
  return (
    <div className="flex justify-between bg-black text-white">
      <div id="header-left" className="flex items-center h-[48px]">
        <DyteLogo />
        <DyteRecordingIndicator />
        <DyteLivestreamIndicator />
      </div>
      <div id="header-center" className="flex items-center h-[48px]">
        <DyteMeetingTitle />
      </div>
      <div id="header-right" className="flex items-center h-[48px]">
        <DyteGridPagination />
        <DyteParticipantCount />
        <DyteViewerCount />
        <DyteClock />
      </div>
    </div>
  );
}

export default HeaderPreBuilt; // uncomment if you want the pre built Dyte header
// export default HeaderWithCustomUI; // uncomment if yoi want custom UI
