import type DyteClient from '@dytesdk/web-core';
import { UIConfig } from '@dytesdk/ui-kit/dist/types/types/ui-config';
import { CustomStates, SetStates } from '../types';
import { DyteDialogManager, DyteSetupScreen } from '@dytesdk/react-ui-kit';
import {
  DyteParticipantTile,
  DyteAvatar,
  DyteNameTag,
  DyteAudioVisualizer,
  DyteMicToggle,
  DyteCameraToggle,
  DyteSettingsToggle,
  DyteButton,
  DyteControlbarButton,
  defaultIconPack,
} from '@dytesdk/react-ui-kit';
import MediaPreviewModal from './media-preview-modal';
import { useEffect, useState } from 'react';
import { useDyteMeeting } from '@dytesdk/react-web-core';
import { useCustomStatesStore } from '../store';

export function SetupScreenPreBuilt() {
  return (
    <main
      className="w-full h-full"
      style={{
        backgroundColor: '#272727',
        color: '#ffffff',
      }}
    >
      <DyteSetupScreen />
    </main>
  );
}

export function CustomSetupScreenWithPrebuiltMediaPreviewModal() {
  const { meeting } = useDyteMeeting();
  const [participantName, setParticipantName] = useState('');

  useEffect(() => {
    if (!meeting) {
      return;
    }
    setParticipantName(meeting.self.name);
  }, [meeting]);

  return (
    <main>
      <div
        key="on-setup-screen"
        className="flex justify-around w-full h-full p-[5%] bg-black text-white"
      >
        <div className="flex justify-around w-full h-full p-[5%]">
          <DyteParticipantTile participant={meeting.self}>
            <DyteAvatar participant={meeting.self} />
            <DyteNameTag participant={meeting.self}>
              <DyteAudioVisualizer participant={meeting.self} slot="start" />
            </DyteNameTag>
            <div id="user-actions" className="absolute flex bottom-2 right-2">
              <DyteMicToggle size="sm"></DyteMicToggle>
              <DyteCameraToggle size="sm"></DyteCameraToggle>
            </div>
            <div className="absolute top-2 right-2">
              <DyteSettingsToggle size="sm"></DyteSettingsToggle>
            </div>
          </DyteParticipantTile>
          <div className="h-1/2 w-1/4 flex flex-col justify-between">
            <div className="flex flex-col items-center">
              <p>Joining as</p>
              <div>{participantName}</div>
            </div>
            <input
              hidden={!meeting.self.permissions.canEditDisplayName}
              placeholder="Your name"
              className="bg-[#141414] rounded-sm border-[#EEEEEE] focus:border-[#2160FD] p-2.5 mb-10"
              autoFocus
              value={participantName}
              onChange={(event) => setParticipantName(event.target.value)}
            />
            <DyteButton
              kind="wide"
              size="lg"
              style={{ cursor: participantName ? 'pointer' : 'not-allowed' }}
              onClick={async () => {
                if (participantName) {
                  if (meeting.self.permissions.canEditDisplayName) {
                    meeting.self.setName(participantName);
                  }
                  await meeting.join();
                }
              }}
            >
              Join
            </DyteButton>
          </div>
        </div>
      </div>
    </main>
  );
}

export function CustomSetupScreenWithCustomMediaPreviewModal() {
  const { meeting } = useDyteMeeting();
  const customStates = useCustomStatesStore((s) => s.states);
  const setCustomStates = useCustomStatesStore((s) => s.setCustomStates);
  const [participantName, setParticipantName] = useState('');

  useEffect(() => {
    if (!meeting) {
      return;
    }
    setParticipantName(meeting.self.name);
  }, [meeting]);

  return (
    <div
      key="on-setup-screen"
      className="flex justify-around w-full h-full p-[5%] bg-black text-white"
    >
      <div className="flex justify-around w-full h-full p-[5%]">
        <DyteParticipantTile participant={meeting.self}>
          <DyteAvatar participant={meeting.self} />
          <DyteNameTag participant={meeting.self}>
            <DyteAudioVisualizer participant={meeting.self} slot="start" />
          </DyteNameTag>
          <div id="user-actions" className="absolute flex bottom-2 right-2">
            <DyteMicToggle size="sm" />
            <DyteCameraToggle size="sm" />
          </div>
          <div className="absolute top-2 right-2">
            <DyteControlbarButton
              onClick={() => {
                setCustomStates({
                  activeMediaPreviewModal: true,
                });
              }}
              icon={defaultIconPack.settings}
              label={'Media Preview'}
            />
          </div>
        </DyteParticipantTile>
        <div className="h-1/2 w-1/4 flex flex-col justify-between">
          <div className="flex flex-col items-center">
            <p>Joining as</p>
            <div>{participantName}</div>
          </div>
          <input
            hidden={!meeting.self.permissions.canEditDisplayName}
            placeholder="Your name"
            className="bg-[#141414] rounded-sm border-[#EEEEEE] focus:border-[#2160FD] p-2.5 mb-10"
            autoFocus
            value={participantName}
            onChange={(event) => setParticipantName(event.target.value)}
          />
          <DyteButton
            kind="wide"
            size="lg"
            style={{ cursor: participantName ? 'pointer' : 'not-allowed' }}
            onClick={async () => {
              if (participantName) {
                if (meeting.self.permissions.canEditDisplayName) {
                  meeting.self.setName(participantName);
                }
                await meeting.join();
              }
            }}
          >
            Join
          </DyteButton>
        </div>
        <MediaPreviewModal open={!!customStates.activeMediaPreviewModal} />
      </div>
    </div>
  );
}

// export default SetupScreenPreBuilt; // Uncomment, if you want prebuild setup screen
// export default CustomSetupScreenWithPrebuiltMediaPreviewModal; // Uncomment, if you want custom setup screen with prebuilt media preview
export default CustomSetupScreenWithCustomMediaPreviewModal; // Uncomment, if you want custom setup screen with custom media preview
