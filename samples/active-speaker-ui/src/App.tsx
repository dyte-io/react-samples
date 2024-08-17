import Meeting from './components/Meeting';
import { DyteSpinner } from '@dytesdk/react-ui-kit';
import { DyteProvider, useDyteClient } from '@dytesdk/react-web-core';
import { useEffect } from 'react';

function App() {
  const [meeting, initMeeting] = useDyteClient();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    const authToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdJZCI6ImM0N2U0OGM3LWM4YmMtNGM4MS1iMzNhLTc4NzQ2MmNhNWJiZiIsIm1lZXRpbmdJZCI6ImJiYmViZGQ4LWY1NTUtNGNmZC1hZDMwLTEwNDg3MTk0NDljMSIsInBhcnRpY2lwYW50SWQiOiJhYWE0ZDY2My04Yjc5LTQ5OWQtOWIxYS03M2I5NGM5MmJiMWUiLCJwcmVzZXRJZCI6ImUwZTE1YThhLTE1ZmEtNDUyYS1hOTZhLWZhYjQ2OTQyMjRiOSIsImlhdCI6MTcyMzkwMTU1NywiZXhwIjoxNzMyNTQxNTU3fQ.sV9igzJ3OUsfUlVp-tTKJiai5ucWMkew-qKMXoiY_eXIeHNfqDo5-sCYunhsGvGR6zBJgTahuHrTBny85TQhHhkuW3o8XyYYsEO6akYDqumKiOUsJRkTeyIIaEO9D80sVkwoMxMlZgs4PxF5RhkF5yDlAPJ5hd3C2cqgBbkKJzCJTlYyaZh293SuBBwHD-B2tbv-1NRdGZcX98KQOry1K9Lk4I82VJ37GRSZ1l2WLq3-TVQIamkMch-ax8v8H4NtsX7gYrNMuZ4ZSHsiPn5CNn-LEL3D502KpYdNRz17Fboj-n4IEBwVACHTU97VbdvI--R6WkGv3kZT4Xdd6qN0Hw';

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
    }).then((meeting) => {
      Object.assign(window, { meeting });
    });
  }, []);

  // By default this component will cover the entire viewport.
  // To avoid that and to make it fill a parent container, pass the prop:
  // `mode="fill"` to the component.
  return (
    <DyteProvider
      value={meeting}
      fallback={
        <div className="size-full flex flex-col gap-3 place-items-center justify-center">
          <DyteSpinner className="w-12 h-12 text-blue-600" />
          <p className="text-lg">Joining...</p>
        </div>
      }
    >
      <Meeting />
    </DyteProvider>
  );
}

export default App;
