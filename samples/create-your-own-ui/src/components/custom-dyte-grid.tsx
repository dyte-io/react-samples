import type DyteClient from '@dytesdk/web-core';
import { UIConfig }  from '@dytesdk/ui-kit/dist/types/types/ui-config';
import { CustomStates, SetStates } from '../types';
import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core';
import { DyteAudioVisualizer, DyteAvatar, DyteCameraToggle, DyteControlbarButton, DyteMicToggle, DyteNameTag, DyteParticipantTile, DyteScreenshareView } from '@dytesdk/react-ui-kit';

import './custom-dyte-grid.css';
import { useEffect, useState } from 'react';
import { DyteParticipant, DyteSelf } from '@dytesdk/web-core';

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
            console.log(broadcastedMessage);
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
            console.log('broadcastedMessage:: ', broadcastedMessage);
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
                        <DyteParticipantTile
                            participant={participant}
                            meeting={meeting}
                            key={participant.id}
                            style={{
                                ...size,
                            }}
                            onClick={() => {
                                setSelectedParticipant(participant);
                                setSelectedSharedScreenParticipant(null);
                            }}
                        >
                            <DyteAvatar participant={participant} />
                            <DyteNameTag participant={participant}>
                                <DyteAudioVisualizer
                                    participant={participant}
                                    slot="start"
                                />
                            </DyteNameTag>
                            {
                                handRaisedPeerIds.includes(participant.id) && (
                                <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M4 12.02c0 1.06.2 2.1.6 3.08l.6 1.42c.22.55.64 1.01 1.17 1.29.27.14.56.21.86.21h2.55c.77 0 1.49-.41 1.87-1.08.5-.87 1.02-1.7 1.72-2.43l1.32-1.39c.44-.46.97-.84 1.49-1.23l.59-.45a.6.6 0 0 0 .23-.47c0-.75-.54-1.57-1.22-1.79a3.34 3.34 0 0 0-2.78.29V4.5a1.5 1.5 0 0 0-2.05-1.4 1.5 1.5 0 0 0-2.9 0A1.5 1.5 0 0 0 6 4.5v.09A1.5 1.5 0 0 0 4 6v6.02ZM8 4.5v4a.5.5 0 0 0 1 0v-5a.5.5 0 0 1 1 0v5a.5.5 0 0 0 1 0v-4a.5.5 0 0 1 1 0v6a.5.5 0 0 0 .85.37h.01c.22-.22.44-.44.72-.58.7-.35 2.22-.57 2.4.5l-.53.4c-.52.4-1.04.78-1.48 1.24l-1.33 1.38c-.75.79-1.31 1.7-1.85 2.63-.21.36-.6.58-1.01.58H7.23a.87.87 0 0 1-.4-.1 1.55 1.55 0 0 1-.71-.78l-.59-1.42a7.09 7.09 0 0 1-.53-2.7V6a.5.5 0 0 1 1 0v3.5a.5.5 0 0 0 1 0v-5a.5.5 0 0 1 1 0Z" fill="currentColor"></path></svg>
                                )
                            }
                            {
                                reactions[participant.id] && (
                                <div>
                                    {reactions[participant.id]}
                                </div> )
                            }
                        </DyteParticipantTile>
                    </div>
                    )
                })
            }
            </div>
            <div className='stage-holder'>
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
                    (
                        <div className='participant-preview'>
                            <DyteParticipantTile
                            participant={selectedParticipant}
                            meeting={meeting}
                            key={'selectedParticipant'}
                            style={{
                                height: '100%'
                            }}
                        >
                            <DyteAvatar participant={selectedParticipant} />
                            <DyteNameTag participant={selectedParticipant}>
                                <DyteAudioVisualizer
                                    participant={selectedParticipant}
                                    slot="start"
                                />
                            </DyteNameTag>
                            {
                                handRaisedPeerIds.includes(selectedParticipant.id) && (
                                <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M4 12.02c0 1.06.2 2.1.6 3.08l.6 1.42c.22.55.64 1.01 1.17 1.29.27.14.56.21.86.21h2.55c.77 0 1.49-.41 1.87-1.08.5-.87 1.02-1.7 1.72-2.43l1.32-1.39c.44-.46.97-.84 1.49-1.23l.59-.45a.6.6 0 0 0 .23-.47c0-.75-.54-1.57-1.22-1.79a3.34 3.34 0 0 0-2.78.29V4.5a1.5 1.5 0 0 0-2.05-1.4 1.5 1.5 0 0 0-2.9 0A1.5 1.5 0 0 0 6 4.5v.09A1.5 1.5 0 0 0 4 6v6.02ZM8 4.5v4a.5.5 0 0 0 1 0v-5a.5.5 0 0 1 1 0v5a.5.5 0 0 0 1 0v-4a.5.5 0 0 1 1 0v6a.5.5 0 0 0 .85.37h.01c.22-.22.44-.44.72-.58.7-.35 2.22-.57 2.4.5l-.53.4c-.52.4-1.04.78-1.48 1.24l-1.33 1.38c-.75.79-1.31 1.7-1.85 2.63-.21.36-.6.58-1.01.58H7.23a.87.87 0 0 1-.4-.1 1.55 1.55 0 0 1-.71-.78l-.59-1.42a7.09 7.09 0 0 1-.53-2.7V6a.5.5 0 0 1 1 0v3.5a.5.5 0 0 0 1 0v-5a.5.5 0 0 1 1 0Z" fill="currentColor"></path></svg>
                                )
                            }
                            {
                                reactions[selectedParticipant.id] && (
                                <div>
                                    {reactions[selectedParticipant.id]}
                                </div> )
                            }
                        </DyteParticipantTile>
                        </div>
                    )
                )}
                {
                    screensharedParticipants.length >= 1 && (
                    <div className='participants-with-shared-screen flex flex-col mt-2'>
                        <div>Click to see the shared screen</div>
                        {screensharedParticipants.map(participant => {
                            return (
                            <div
                            key={participant.id}
                            >
                                <DyteParticipantTile
                                    participant={participant}
                                    meeting={meeting}
                                    key={participant.id}
                                    style={{
                                        ...size,
                                    }}
                                    onClick={() => {
                                        setSelectedParticipant(null);
                                        setSelectedSharedScreenParticipant(participant)
                                    }}
                                >
                                    <DyteAvatar participant={participant} />
                                    <DyteNameTag participant={participant}>
                                        <DyteAudioVisualizer
                                            participant={participant}
                                            slot="start"
                                        />
                                    </DyteNameTag>
                                    {
                                        handRaisedPeerIds.includes(participant.id) && (
                                        <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M4 12.02c0 1.06.2 2.1.6 3.08l.6 1.42c.22.55.64 1.01 1.17 1.29.27.14.56.21.86.21h2.55c.77 0 1.49-.41 1.87-1.08.5-.87 1.02-1.7 1.72-2.43l1.32-1.39c.44-.46.97-.84 1.49-1.23l.59-.45a.6.6 0 0 0 .23-.47c0-.75-.54-1.57-1.22-1.79a3.34 3.34 0 0 0-2.78.29V4.5a1.5 1.5 0 0 0-2.05-1.4 1.5 1.5 0 0 0-2.9 0A1.5 1.5 0 0 0 6 4.5v.09A1.5 1.5 0 0 0 4 6v6.02ZM8 4.5v4a.5.5 0 0 0 1 0v-5a.5.5 0 0 1 1 0v5a.5.5 0 0 0 1 0v-4a.5.5 0 0 1 1 0v6a.5.5 0 0 0 .85.37h.01c.22-.22.44-.44.72-.58.7-.35 2.22-.57 2.4.5l-.53.4c-.52.4-1.04.78-1.48 1.24l-1.33 1.38c-.75.79-1.31 1.7-1.85 2.63-.21.36-.6.58-1.01.58H7.23a.87.87 0 0 1-.4-.1 1.55 1.55 0 0 1-.71-.78l-.59-1.42a7.09 7.09 0 0 1-.53-2.7V6a.5.5 0 0 1 1 0v3.5a.5.5 0 0 0 1 0v-5a.5.5 0 0 1 1 0Z" fill="currentColor"></path></svg>
                                        )
                                    }
                                    {
                                        reactions[participant.id] && (
                                        <div>
                                            {reactions[participant.id]}
                                        </div> )
                                    }
                                </DyteParticipantTile>
                            </div>
                            )
                        })
                    }
                    </div>
                )}
            </div>
        </div>
      );
}

export default CustomDyteGridScreenshareFocused;