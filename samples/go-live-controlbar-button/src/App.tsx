import {
  DyteButton,
  DyteDialog,
  DyteMeeting,
  DyteUIBuilder,
  generateConfig,
  registerAddons,
} from '@dytesdk/react-ui-kit';
import { useDyteClient } from '@dytesdk/react-web-core';
import CustomButton from '@dytesdk/ui-kit-addons/custom-controlbar-button';
import { useEffect, useState } from 'react';

function App() {
  const [meeting, initMeeting] = useDyteClient();
  const [config, setConfig] = useState<any>(undefined);

  /**
   * Go live dialog open state
   */
  const [open, setOpen] = useState(false);
  /**
   * RTMP URL for going live
   */
  const [url, setUrl] = useState('');

  useEffect(() => {
    const searchParams = new URL(window.location.href).searchParams;

    const authToken = searchParams.get('authToken');

    if (!authToken) {
      alert(
        "An authToken wasn't passed, please pass an authToken in the URL query to join a meeting."
      );
      return;
    }

    initMeeting({
      authToken,
      defaults: {
        audio: false,
        video: false,
      },
    });
  }, []);

  useEffect(() => {
    if (!meeting) return;

    const { config } = generateConfig(meeting.self.config, meeting);

    if (config.config) {
      if (!config.config.notifications) config.config.notifications = {};
      config.config.notifications.participant_joined = false;
      config.config.notifications.participant_left = false;
    }

    const startIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="red" d="M6.343 4.938a1 1 0 0 1 0 1.415a8.003 8.003 0 0 0 0 11.317a1 1 0 1 1-1.415 1.414c-3.906-3.906-3.906-10.24 0-14.146a1 1 0 0 1 1.415 0Zm12.731 0c3.906 3.907 3.906 10.24 0 14.146a1 1 0 0 1-1.414-1.414a8.003 8.003 0 0 0 0-11.317a1 1 0 0 1 1.414-1.415ZM9.31 7.812a1 1 0 0 1 0 1.414a3.92 3.92 0 0 0 0 5.544a1 1 0 1 1-1.414 1.414a5.92 5.92 0 0 1 0-8.372a1 1 0 0 1 1.414 0Zm6.959 0a5.92 5.92 0 0 1 0 8.372a1 1 0 0 1-1.415-1.414a3.92 3.92 0 0 0 0-5.544a1 1 0 0 1 1.415-1.414Zm-4.187 2.77a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3Z"/></svg>';
    const stopIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill="red" d="M2.854 2.146a.5.5 0 1 0-.708.708l1.811 1.81A8.218 8.218 0 0 0 2 10a8.228 8.228 0 0 0 2.604 6.015a.725.725 0 0 0 1.01-.025c.316-.316.277-.819-.027-1.11A6.73 6.73 0 0 1 3.5 10c0-1.62.57-3.107 1.522-4.27l.712.71A5.726 5.726 0 0 0 4.5 10c0 1.691.73 3.213 1.893 4.264a.713.713 0 0 0 .983-.037c.328-.328.267-.844-.041-1.134A4.238 4.238 0 0 1 6 10c0-.93.298-1.789.804-2.489l1.842 1.842a1.5 1.5 0 0 0 2 2l6.5 6.5a.5.5 0 0 0 .708-.707l-1.811-1.81l-1.065-1.066l-.712-.71l-1.07-1.072l-1.842-1.841l-2-2L7.4 6.693l-.942-.942l-.82-.82l-.944-.944l-1.841-1.842Zm13.794 12.38A8.212 8.212 0 0 0 18 10c0-2.283-.928-4.35-2.426-5.843a.726.726 0 0 0-1.027.01c-.31.31-.28.8.01 1.095A6.727 6.727 0 0 1 16.5 10a6.718 6.718 0 0 1-.94 3.438l1.088 1.089Zm-1.822-1.822A5.73 5.73 0 0 0 15.5 10a5.733 5.733 0 0 0-1.706-4.087a.714.714 0 0 0-1.008.016c-.319.318-.272.816.014 1.111A4.235 4.235 0 0 1 14 10c0 .557-.107 1.09-.302 1.577l1.128 1.127Z"/></svg>';
    
    const customButton = new CustomButton({
      label: 'Go Live',
      onClick: () => {
        if(meeting.recording.recordingState === "RECORDING") {
          meeting.recording.stop(); // or fetch to stop from server
        } else {
          setOpen((o) => !o);
        }
      },
      icon: startIcon,
      position: 'center',
    }) as any;

    const newConfig = registerAddons([customButton], meeting, config);
    setConfig(newConfig);


    const onRecordingUpdate = (state: any) => {
      if(state === "RECORDING") {
        customButton.update({ label: 'STOP', icon: stopIcon });
      } else if (state === "STOPPING" || state === "IDLE") {
        customButton.update({ label: 'Go Live', icon: startIcon})
      }
    };

    meeting.recording.on('recordingUpdate', onRecordingUpdate);
    return () => {
      meeting.recording.removeListener('recordingUpdate', onRecordingUpdate);
    }
  }, [meeting]);

  if(!config) return;

  // By default this component will cover the entire viewport.
  // To avoid that and to make it fill a parent container, pass the prop:
  // `mode="fill"` to the component.
  return (
    <>
      <DyteMeeting meeting={meeting!} config={config} />

      <DyteDialog
        open={open}
        onDyteDialogClose={(e) => {
          setOpen(false);
        }}
        className="bg-white"
      >
        <form
          onSubmit={(e) => {
            // send request to your server
            // fetch(YOUR_API, {
            //   method: "POST",
            //   body: JSON.stringify({ 
            //       meetingId: meeting.meta.roomName
            //       url: url
            //      })
            // })
            e.preventDefault();
          }}
          style={{
            display: 'flex',
            width: '20rem',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1rem',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            borderRadius: '8px',
          }}
        >
          <h3 style={{ margin: '0', marginBottom: '0.5rem' }}>Go live!</h3>

          <input
            type="url"
            name="rtmpUrl"
            style={{
              width: '100%',
              backgroundColor: 'rgba(70,70, 70, 0.3)',
              color: '#fff',
            }}
            value={url}
            onInput={(e) => setUrl(e.currentTarget.value)}
            placeholder="rtmp://example.com/rtmp"
          />

          <button type="submit">Go Live</button>
        </form>
      </DyteDialog>
    </>
  );
}

export default App;
