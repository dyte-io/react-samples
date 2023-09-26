import { useEffect, useState } from 'react'
import './setupScreen.css'
import { useDyteMeeting } from '@dytesdk/react-web-core';
import {
  DyteAudioVisualizer,
  DyteAvatar,
  DyteCameraToggle,
  DyteMicToggle,
  DyteNameTag,
  DyteParticipantTile,
} from '@dytesdk/react-ui-kit';

const SetupScreen = () => {
  const { meeting } = useDyteMeeting();
  const [isHost, setIsHost] = useState<boolean>(false);
  const [name, setName] = useState<string>('');

  useEffect(() => {
    if (!meeting) return;
    const preset = meeting.self.presetName;
    const name = meeting.self.name;
    setName(name);

    if (preset.includes('host')) {
      setIsHost(true);
    }
  }, [meeting])

  const joinMeeting = () => {
    meeting?.self.setName(name);
    meeting.joinRoom();
  }

  return (
    <div className='setup-screen'>
      <div className="setup-media">
        <div className="video-container">
          <DyteParticipantTile meeting={meeting} participant={meeting.self}>
            <DyteAvatar size="md" participant={meeting.self}/>
            <DyteNameTag meeting={meeting} participant={meeting.self}>
              <DyteAudioVisualizer size='sm' slot="start" participant={meeting.self} />
            </DyteNameTag>
            <div className='setup-media-controls'>
              <DyteMicToggle size="sm" meeting={meeting}/>
              &ensp;
              <DyteCameraToggle size="sm" meeting={meeting}/>
            </div>
          </DyteParticipantTile>
        </div>
      </div>
      <div className="setup-information">
        <div className="setup-content">
          <h2>Welcome! {name}</h2>
          <p>{isHost ? 'You are joining as a Host' : 'You are joining as a bidder'}</p>
          <input disabled={!meeting.self.permissions.canEditDisplayName ?? false} className='setup-name' value={name} onChange={(e) => {
            setName(e.target.value)
          }} />
          <button className='setup-join' onClick={joinMeeting}>
            Join Meeting
          </button>
        </div>
      </div>
    </div>
  )
}

export default SetupScreen