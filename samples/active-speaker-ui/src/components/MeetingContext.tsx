import React, { createContext, useReducer } from 'react';
import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core';
import { useThrottle } from '@uidotdev/usehooks';
import type { States } from '@dytesdk/ui-kit/dist/types';
import type { Peer, Size } from '@dytesdk/ui-kit';
import type { leaveRoomState, DytePlugin } from '@dytesdk/web-core';
import useBreakpoint from '../utils/breakpoint';

const ACTIVE_SPEAKER_CHANGE_DELAY = 3000;
type RoomState = 'init' | 'joined' | 'waitlisted' | leaveRoomState;
export interface ContextValue {
	meeting: ReturnType<typeof useDyteMeeting>['meeting'];
	states: States;
	breakpoint: Size;
	roomState: RoomState;
	updateStates: React.Dispatch<React.SetStateAction<States>>;
	isScreenShareEnabled: boolean;
	isPluginsEnabled: boolean;
	activeScreenshares: Peer[];
	activePlugins: DytePlugin[];
	activeSpeaker: Peer | undefined;
	showSpotlight: boolean;
	requestCount: number;
	isOnStage: boolean;
}

export const MeetingContext = createContext<ContextValue | undefined>(undefined);

type Props = React.PropsWithChildren<object>;

const MeetingProvider = ({ children }: Props) => {
    const { meeting } = useDyteMeeting();
	const breakpoint = useBreakpoint();
	const [states, updateStates] = useReducer((state: States, payload: States) => ({
			...state,
			...payload,
		}),
		{ meeting: 'joined' },
	);
	const roomState = useDyteSelector((meeting) => meeting.self.roomState as RoomState);
	const activeScreenshares = useDyteSelector(
		(meeting) =>
			meeting.participants.joined
				.toArray()
				.filter((p) => p.screenShareEnabled)
				.map((p) => p as Peer)
				.concat(
					meeting.self.screenShareEnabled ? [meeting.self as Peer] : []
				),
	);
	const activePlugins = useDyteSelector((meeting) => meeting.plugins.active.toArray());
	const showSpotlight = activeScreenshares.length > 0 || activePlugins.length > 0;

	const lastActiveSpeaker = useDyteSelector((meeting) => meeting.participants.lastActiveSpeaker);
	const isOnStage = useDyteSelector((meeting) => meeting.self.stageStatus === 'ON_STAGE');
	const requestCount = useDyteSelector(
		(meeting) =>
			meeting.participants.joined.toArray().filter((p) => p.stageStatus === 'REQUESTED_TO_JOIN_STAGE').length +
			meeting.participants.waitlisted.size,
	);

    const activeSpeakerInternal = meeting.participants.active
		.toArray()
		.find((participant) =>
			participant.id === lastActiveSpeaker
		) ?? meeting.self;
	const activeSpeaker = useThrottle(activeSpeakerInternal, ACTIVE_SPEAKER_CHANGE_DELAY);

    return (
		<MeetingContext.Provider
			value={{
				meeting,
				states,
				updateStates,
				roomState,
				isScreenShareEnabled: activeScreenshares.length > 0,
				isPluginsEnabled: activePlugins.length > 0,
				activeScreenshares,
				activePlugins,
				activeSpeaker,
				breakpoint,
				showSpotlight,
				requestCount,
				isOnStage
			}}
		>
			{children}
		</MeetingContext.Provider>
    );
}

export default MeetingProvider;
