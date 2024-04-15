import {
  DyteButton,
  DyteDialog,
  DyteMeeting,
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

    const customButton = new CustomButton({
      label: 'Go Live',
      onClick: () => {
        setOpen((o) => !o);
      },
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="red" d="M6.343 4.938a1 1 0 0 1 0 1.415a8.003 8.003 0 0 0 0 11.317a1 1 0 1 1-1.415 1.414c-3.906-3.906-3.906-10.24 0-14.146a1 1 0 0 1 1.415 0Zm12.731 0c3.906 3.907 3.906 10.24 0 14.146a1 1 0 0 1-1.414-1.414a8.003 8.003 0 0 0 0-11.317a1 1 0 0 1 1.414-1.415ZM9.31 7.812a1 1 0 0 1 0 1.414a3.92 3.92 0 0 0 0 5.544a1 1 0 1 1-1.414 1.414a5.92 5.92 0 0 1 0-8.372a1 1 0 0 1 1.414 0Zm6.959 0a5.92 5.92 0 0 1 0 8.372a1 1 0 0 1-1.415-1.414a3.92 3.92 0 0 0 0-5.544a1 1 0 0 1 1.415-1.414Zm-4.187 2.77a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3Z"/></svg>',
      position: 'center',
    });

    const config = registerAddons([customButton], meeting);
    setConfig(config);
  }, [meeting]);

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
            e.preventDefault();
            alert('The url you entered is ' + url);
          }}
          style={{
            display: 'flex',
            width: '20rem',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1rem',
            backgroundColor: 'rgba(0 0 0 / 0.4)',
            borderRadius: '8px',
          }}
        >
          <h3 style={{ margin: '0', marginBottom: '0.5rem' }}>Go live!</h3>

          <input
            type="url"
            name="rtmpUrl"
            style={{
              width: '100%',
              backgroundColor: 'rgba(70 70 70 0.3)',
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
