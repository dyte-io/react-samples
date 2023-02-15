import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core';
import {
  DyteMicToggle,
  DyteCameraToggle,
  DyteControlbarButton,
  DyteChatToggle,
  DytePollsToggle,
  DytePluginsToggle,
  DyteParticipantsToggle,
  DyteSettingsToggle,
  DyteScreenShareToggle,
} from '@dytesdk/react-ui-kit';
import { sendNotification, States } from '@dytesdk/ui-kit';



export function CustomFooter({ updateUIState }: any) {
    const { meeting } = useDyteMeeting();
    
    const recordingState = useDyteSelector((m) => m.recording.recordingState); // 'IDLE' | 'STARTING' | 'RECORDING' | 'STOPPING'
  
    const customRecordToggle = () => {
      if(recordingState === 'RECORDING') {
        meeting.recording.stop()
      } else {
        meeting.recording.start();
        sendNotification({
          id: 'recording-stopped',
          message: 'Custom Recording Notification',
          duration: 3000,
        })
      }
    }
  
    return (
      <footer className="py-2 flex items-center justify-between">
          <div className="flex">
            <DyteScreenShareToggle meeting={meeting} />
            <DyteControlbarButton
              onClick={customRecordToggle}
              label={recordingState === 'RECORDING' ? 'Stop' : 'Custom Record'}
              icon='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M9.99906 2.16577C14.6024 2.16577 18.3341 5.89744 18.3341 10.5008C18.3341 15.1033 14.6024 18.8349 9.99906 18.8349C5.39573 18.8349 1.66406 15.1033 1.66406 10.5008C1.66406 5.89744 5.39573 2.16577 9.99906 2.16577ZM12.4482 14.2499H7.54906C8.0924 16.2616 9.0374 17.5849 9.99823 17.5849C10.9591 17.5849 11.9041 16.2616 12.4474 14.2499H12.4482ZM6.25656 14.2499H3.98656C4.79114 15.5374 5.9867 16.5335 7.39823 17.0924C6.96323 16.4091 6.60406 15.5541 6.3399 14.5799L6.2549 14.2508L6.25656 14.2499ZM16.0107 14.2499H13.7424C13.4724 15.3624 13.0824 16.3333 12.5982 17.0924C13.9206 16.5694 15.0556 15.6617 15.8566 14.4866L16.0107 14.2508V14.2499ZM5.91073 8.83327H3.11156L3.1074 8.84744C2.9781 9.38904 2.91293 9.94396 2.91323 10.5008C2.91323 11.3808 3.07406 12.2233 3.3674 13.0008H6.01156C5.81031 11.621 5.77589 10.2221 5.90906 8.83411L5.91073 8.83327ZM12.8299 8.83327H7.16823C7.02162 10.221 7.05945 11.6221 7.28073 12.9999H12.7174C12.9386 11.6221 12.9764 10.221 12.8299 8.83327ZM16.8866 8.83327H14.0882C14.1399 9.37244 14.1674 9.93077 14.1674 10.4999C14.1687 11.3366 14.108 12.1722 13.9857 12.9999H16.6299C16.9308 12.2008 17.0844 11.3538 17.0832 10.4999C17.0832 9.92577 17.0149 9.3666 16.8866 8.83327ZM7.39906 3.90827L7.3799 3.91494C5.67441 4.59596 4.29862 5.91053 3.54073 7.58327H6.08073C6.3424 6.12327 6.7974 4.8516 7.3999 3.90827H7.39906ZM9.99906 3.41577L9.9024 3.41994C8.84906 3.5166 7.82906 5.18494 7.3574 7.58327H12.6424C12.1707 5.1916 11.1566 3.52577 10.1049 3.42077L9.99906 3.4166V3.41577ZM12.5991 3.90744L12.6882 4.05327C13.2457 4.97994 13.6691 6.19661 13.9174 7.58411H16.4574C15.7339 5.98751 14.4463 4.71438 12.8416 4.0091L12.5991 3.90827V3.90744Z" fill="currentColor" fill-opacity="0.9"/></svg>'
            />
          </div>
          <div className="flex">
            <DyteMicToggle meeting={meeting} />
            <DyteCameraToggle meeting={meeting} />
            <DyteSettingsToggle onDyteStateUpdate={updateUIState} />
          </div>
          <div className="flex">
            <DyteChatToggle onDyteStateUpdate={updateUIState} />
            <DytePollsToggle onDyteStateUpdate={updateUIState} />
            <DyteParticipantsToggle onDyteStateUpdate={updateUIState} />
            <DytePluginsToggle onDyteStateUpdate={updateUIState} />
          </div>
        </footer>
    )
  }