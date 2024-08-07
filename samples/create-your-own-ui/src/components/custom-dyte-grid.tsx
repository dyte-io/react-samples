import type DyteClient from '@dytesdk/web-core';
import { UIConfig }  from '@dytesdk/ui-kit/dist/types/types/ui-config';
import { CustomStates, SetStates } from '../types';
import { useDyteSelector } from '@dytesdk/react-web-core';
import { defaultIconPack, DyteAudioVisualizer, DyteAvatar, DyteButton, DyteCameraToggle, DyteControlbarButton, DyteIcon, DyteMicToggle, DyteNameTag, DyteParticipantTile, DyteScreenshareView } from '@dytesdk/react-ui-kit';

import './custom-dyte-grid.css';
import { useEffect, useState } from 'react';
import { DyteParticipant, DyteSelf } from '@dytesdk/web-core';
import CustomParticipantTile from './custom-participant-tile';

function CustomDyteGridScreenshareFocused({
    meeting,
    config,
    states,
    setStates,
}: { meeting: DyteClient, config: UIConfig,  states: CustomStates, setStates: SetStates}) {
    
    const [size] = useState({ height: '120px', width: '120px' });

    const [selectedSharedScreenParticipant, setSelectedSharedScreenParticipant] = useState<DyteSelf | DyteParticipant | null>(null);

    const [selectedParticipant, setSelectedParticipant] = useState<DyteSelf | DyteParticipant | null>(meeting.self);

    const [handRaisedPeerIds, setHandRaisedPeerIds] = useState<string[]>([]);

    const [reactions, setReactions] = useState<{[key: string]: string}>({});

    const activeParticipants = useDyteSelector((meeting) =>
        meeting.participants.active.toArray()
    );

    const pinnedParticipants = useDyteSelector((meeting) =>
        meeting.participants.pinned.toArray()
    );

    const screensharedParticipants = useDyteSelector((meeting) => {
        const allParticipants = [meeting.self, ...meeting.participants.joined.toArray()];
        return allParticipants.filter((p) => p.screenShareEnabled);
    });

    const participants = [
        meeting.self,
        ...pinnedParticipants,
        ...activeParticipants.filter((p) => !pinnedParticipants.includes(p)),
    ];

    useEffect(() => {
        if(!meeting){
            return;
        }
        meeting.participants.joined.on('participantLeft', (participant) => {
            if(selectedParticipant?.id === participant.id){
                setSelectedParticipant(meeting.self);
            }
            if(selectedSharedScreenParticipant?.id === participant.id){
                setSelectedSharedScreenParticipant(null);
            }
        });
    }, [meeting]);

    useEffect(() => {
        meeting.participants.addListener('broadcastedMessage', broadcastedMessage => {
            if(broadcastedMessage.type === 'raised-hand'){
                setHandRaisedPeerIds((prev) => {
                    return [...prev, broadcastedMessage.payload.peerId?.toString()];
                });
            }
            if(broadcastedMessage.type === 'lowered-hand'){
                setHandRaisedPeerIds((prev) => {
                    const currentHandRaised = prev.filter(peerId => peerId !== broadcastedMessage.payload.peerId?.toString());
                    return currentHandRaised;
                });
            }
        });
    }, [meeting]);

    useEffect(() => {
        meeting.participants.addListener('broadcastedMessage', broadcastedMessage => {
            if(broadcastedMessage.type === 'reactions'){
                setReactions((prev) => {
                    return {
                        ...prev,
                        [broadcastedMessage.payload.peerId?.toString()]:  broadcastedMessage.payload.reaction?.toString(),
                    };
                });
            }
        });
    }, [meeting]);

    useEffect(() => {
        if(screensharedParticipants.length === 0){
            setSelectedSharedScreenParticipant(null);
            setSelectedParticipant(meeting.self);
        }
        if(screensharedParticipants.length >= 1 && !selectedParticipant && !selectedSharedScreenParticipant){
            setSelectedSharedScreenParticipant(screensharedParticipants[0]);
        }
    }, [screensharedParticipants]);

    return (
        <div className='w-full'>
            <div className='participants-holder'>
            {
                participants.map(participant => {
                    return (
                    <div
                    className='ml-2'
                    key={participant.id}
                    >
                        <CustomParticipantTile
                            meeting={meeting}
                            participant={participant}
                            hasRaisedHand={handRaisedPeerIds.includes(participant.id)}
                            reaction={reactions[participant.id]}
                            style={{
                                ...size,
                            }}
                            onClick={() => {
                                setSelectedParticipant(participant);
                                setSelectedSharedScreenParticipant(null);
                            }}
                        />
                    </div>
                    )
                })
            }
            </div>
            <div className='stage-holder'>
            {
                    screensharedParticipants.length >= 1 && (
                    <div className='participants-with-shared-screen flex flex-col mt-2'>
                        <div className='mt-10'>Shared&nbsp;screens:</div>
                        {screensharedParticipants.map(participant => {
                            return (
                            <div
                            className='mt-2'
                            key={participant.id}
                            >
                                <DyteButton
                                variant='secondary'
                                className='bg-[#242424] p-2 h-fit'
                                type='button'
                                onClick={() => {
                                    setSelectedParticipant(null);
                                    setSelectedSharedScreenParticipant(participant)
                                }}
                                >
                                    <div className="flex flex-col items-center">
                                        <DyteIcon
                                            icon={defaultIconPack.share_screen_person}
                                        />
                                        <span>
                                            {participant.id === meeting?.self.id ? 'you' : participant.name}
                                        </span>
                                    </div>
                                </DyteButton>
                            </div>
                            )
                        })
                    }
                    </div>
                )}
                {
                    selectedSharedScreenParticipant && (
                        <div className='shared-screen'>
                            <DyteScreenshareView
                                meeting={meeting}
                                participant={selectedSharedScreenParticipant}
                                hideFullScreenButton={false}
                                style={{
                                    width: '60%'
                                }}
                            />
                        </div>
                    )
                }
                {selectedParticipant && (
                    <CustomParticipantTile
                        style={{
                            height: '100%',
                        }}
                        meeting={meeting}
                        participant={selectedParticipant}
                        hasRaisedHand={handRaisedPeerIds.includes(selectedParticipant.id)}
                        reaction={reactions[selectedParticipant.id]}
                    />
                )}
            </div>
        </div>
      );
}

export default CustomDyteGridScreenshareFocused;