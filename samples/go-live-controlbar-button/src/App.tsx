import {
  DyteButton,
  DyteDialog,
  DyteMeeting,
  DyteUIBuilder,
  generateConfig,
  registerAddons,
  sendNotification,
} from '@dytesdk/react-ui-kit';
import { useDyteClient } from '@dytesdk/react-web-core';
import CustomButton from '@dytesdk/ui-kit-addons/custom-controlbar-button';
import { useEffect, useState } from 'react';

function App() {
  const [meeting, initMeeting] = useDyteClient();
  const [config, setConfig] = useState<any>(undefined);

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
      config.config.notifications.recording_started = false;
      config.config.notifications.recording_stopped = false;
    }

    setConfig(config);

  }, [meeting]);

  if(!config) return;

  // By default this component will cover the entire viewport.
  // To avoid that and to make it fill a parent container, pass the prop:
  // `mode="fill"` to the component.
  return (
    <>
      <DyteMeeting meeting={meeting!} config={config} />
    </>
  );
}

export default App;
