import { useEffect, useState } from 'react';
import { DyteMeeting, generateConfig, DyteUIBuilder } from '@dytesdk/react-ui-kit';
import { useDyteClient } from '@dytesdk/react-web-core';

function App() {
  const [meeting, initMeeting] = useDyteClient();
  const [c, setConfig] = useState<any>();

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
    }).then((m: any) => {
      const { config } = generateConfig(m.self.config, m);
      const builder = new DyteUIBuilder(config);
      // Disable the "Turn on captions" button
      builder.find('dyte-more-toggle', { activeMoreMenu: true })?.remove("dyte-caption-toggle");
      builder.find('dyte-more-toggle', { activeMoreMenu: true, sm: true })?.remove("dyte-caption-toggle");
      builder.find('dyte-more-toggle', { activeMoreMenu: true, md: true })?.remove("dyte-caption-toggle");
      // Disable the "Meetings AI" sidebar
      builder.find('dyte-more-toggle', { activeMoreMenu: true, sm: true })?.remove("dyte-ai-toggle");
      builder.find('dyte-more-toggle', { activeMoreMenu: true, md: true })?.remove("dyte-ai-toggle");
      builder.find('div#controlbar-right')?.remove("dyte-ai-toggle");
      
      const newConfig = builder.build();
      setConfig(newConfig);

    })
  }, []);

  // By default this component will cover the entire viewport.
  // To avoid that and to make it fill a parent container, pass the prop:
  // `mode="fill"` to the component.
  return <DyteMeeting meeting={meeting!} config={c} />;
}

export default App;
