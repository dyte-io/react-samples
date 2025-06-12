import { useState } from 'react';
import { Meeting } from './Meeting';

function App() {
  const url = new URL(window.location.href);
  const urlAuthToken1 = url.searchParams.get('authToken1');
  const urlAuthToken2 = url.searchParams.get('authToken2');
  const autoInitializeMeeting1 = url.searchParams.get('autoInitializeMeeting1');
  const autoInitializeMeeting2 = url.searchParams.get('autoInitializeMeeting2');
  const urlShowSetupScreen1 = url.searchParams.get('showSetupScreen1');
  const urlShowSetupScreen2 = url.searchParams.get('showSetupScreen2');

  const [authToken1, setAuthToken1] = useState(urlAuthToken1 || '');
  const [authToken2, setAuthToken2] = useState(urlAuthToken2 || '');
  const [initializeMeeting1, setInitializeMeeting1] = useState(autoInitializeMeeting1 === 'true');
  const [initializeMeeting2, setInitializeMeeting2] = useState(autoInitializeMeeting2 === 'true');
  const [showSetupScreen1, setShowSetupScreen1] = useState(urlShowSetupScreen1 === 'true');
  const [showSetupScreen2, setShowSetupScreen2] = useState(urlShowSetupScreen2 === 'true');

  // By default this component will cover the entire viewport.
  // To avoid that and to make it fill a parent container, pass the prop:
  // `mode="fill"` to the component.
  return (
    <div className="flex w-full h-full justify-center">
      <div className="border-2 border-black w-1/2">
      {!initializeMeeting1 ? (
        <div className="flex">
          <input
            type="text"
            id="auth_token"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 m-2"
            placeholder="Auth Token"
            required
            value={authToken1}
            onChange={(e) => setAuthToken1(e.target.value)}
          />
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 m-2"
            onClick={() => setInitializeMeeting1(true)}
          >
            Initialize
          </button>
        </div>
      ) : (
        <Meeting authToken={authToken1} />
      )}
      </div>
      <div className="border-2 border-black w-1/2">
      {!initializeMeeting2 ? (
        <div className="flex">
          <input
            type="text"
            id="auth_token"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 m-2"
            placeholder="Auth Token"
            required
            value={authToken2}
            onChange={(e) => setAuthToken2(e.target.value)}
          />
          <button
            type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 m-2"
            onClick={() => setInitializeMeeting2(true)}
          >
            Initialize
          </button>
        </div>
      ) : (
        <Meeting showSetupScreen authToken={authToken2} />
      )}
      </div>
    </div>
  );
}

export default App;
