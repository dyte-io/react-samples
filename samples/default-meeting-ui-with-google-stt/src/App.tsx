import { useEffect } from 'react';
import { DyteMeeting } from '@dytesdk/react-ui-kit';
import { useDyteClient } from '@dytesdk/react-web-core';
import DyteGoogleSpeechRecognition,  { TranscriptionData }  from '@dytesdk/google-transcription';

function App() {
  const [meeting, initMeeting] = useDyteClient();

  useEffect(() => {
    async function setupMeeting(){
      const searchParams = new URL(window.location.href).searchParams;

      const authToken = searchParams.get('authToken');
  
      // pass an empty string when using v2 meetings
      // for v1 meetings, you would need to pass the correct roomName here
      const roomName = searchParams.get('roomName') || '';
  
      if (!authToken) {
        alert(
          "An authToken wasn't passed, please pass an authToken in the URL query to join a meeting."
        );
        return;
      }
  
      const meeting = await initMeeting({
        authToken,
        roomName,
      });

      Object.assign(window, {meeting});
      
      if(meeting){
        const speech = new DyteGoogleSpeechRecognition({
          meeting,
          target: 'hi',
          source: 'en-US',
          baseUrl: 'http://localhost:3001',
        });


        speech.on('transcription', async () => {
          const transcription = document.getElementById('dyte-transcriptions') as HTMLDivElement;
          const list = speech.transcriptions.slice(-3);
          transcription.innerHTML = '';
          list.forEach((item: TranscriptionData) => {
              const speaker = document.createElement('span');
              speaker.classList.add('dyte-transcription-speaker');
              speaker.innerText = `${item.name}: `;

              const text = document.createElement('span');
              text.classList.add('dyte-transcription-text');
              text.innerText = item.transcript.trim() !== '' ? item.transcript : '...';

              const container = document.createElement('span');
              container.classList.add('dyte-transcription-line');
              container.appendChild(speaker);
              container.appendChild(text);

              transcription.appendChild(container);
          });
        });

        speech.transcribe();
      }
    }
    setupMeeting();
  }, []);

  // By default this component will cover the entire viewport.
  // To avoid that and to make it fill a parent container, pass the prop:
  // `mode="fill"` to the component.
  return <DyteMeeting meeting={meeting!} />;
}

export default App;
