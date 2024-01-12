import SidebarOverlay from './SidebarOverlay';
import {
	defaultIconPack,
	DyteCameraToggle,
	DyteChat,
	DyteControlbarButton,
	DyteGrid,
	DyteLeaveButton,
	DyteMicToggle,
	DyteParticipants,
	DyteParticipantTile,
	DyteScreenShareToggle,
	DyteStageToggle,
	DyteScreenshareView,
	DyteSettingsToggle,
} from '@dytesdk/react-ui-kit';
import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core';
import { useThrottle } from '@uidotdev/usehooks';
import { useEffect, useState, useCallback } from 'react';

const ACTIVE_SPEAKER_CHANGE_DELAY = 3000;

export default function Meeting() {
	const { meeting } = useDyteMeeting();
	const joined = useDyteSelector((meeting) => meeting.self.roomJoined);
	const isScreenShareEnabled = useDyteSelector(
		(meeting) =>
			meeting.self.screenShareEnabled || meeting.participants.joined.toArray().some((p) => p.screenShareEnabled),
	);
	const screenSharingParticipant = useDyteSelector((meeting) => {
		if (meeting.self.screenShareEnabled) {
			return meeting.self;
		}
		return meeting.participants.joined.toArray().find((p) => p.screenShareEnabled);
	});
	const lastActiveSpeaker = useDyteSelector((meeting) => meeting.participants.lastActiveSpeaker);
	const isOnStage = useDyteSelector((meeting) => meeting.self.stageStatus === 'ON_STAGE');
	const requestCount = useDyteSelector(
		(meeting) =>
			meeting.participants.joined.toArray().filter((p) => p.stageStatus === 'REQUESTED_TO_JOIN_STAGE').length +
			meeting.participants.waitlisted.size,
	);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [activeSpeakerInternal, setActiveSpeaker] = useState<any>();
	const [participantListVisible, setParticipantListVisible] = useState<boolean>(false);

	const activeSpeaker = useThrottle(activeSpeakerInternal, ACTIVE_SPEAKER_CHANGE_DELAY);

	const toggleParticipantList = useCallback(() => {
		setParticipantListVisible(!participantListVisible);
	}, [participantListVisible]);

	useEffect(() => {
		const activeParticipants = meeting.participants.active.toArray();

		setActiveSpeaker(
			activeParticipants.find((participant) => participant.id === meeting.participants.lastActiveSpeaker) ??
				meeting.self,
		);
	}, [lastActiveSpeaker, meeting.participants.active, meeting.participants.lastActiveSpeaker, meeting.self]);

	if (!joined) {
		return <main className="flex min-h-screen text-gray-50 items-center justify-center">Meeting ended</main>;
	}

	return (
		<main className="flex min-h-screen">
			<section className="flex flex-col grow m-4 gap-4">
				{isScreenShareEnabled && screenSharingParticipant ? (
					<DyteScreenshareView meeting={meeting} participant={screenSharingParticipant} />
				) : (
					<DyteGrid meeting={meeting} />
				)}
				<footer className="flex justify-center">
					{isOnStage && <DyteScreenShareToggle meeting={meeting} />}
					{isOnStage && <DyteMicToggle meeting={meeting} />}
					{isOnStage && <DyteCameraToggle meeting={meeting} />}
					<DyteStageToggle meeting={meeting} />
					<DyteLeaveButton />
					{isOnStage && <DyteSettingsToggle />}
					<div className="relative">
						<DyteControlbarButton
							icon={defaultIconPack.participants}
							label="Participants"
							onClick={toggleParticipantList}
							className={participantListVisible ? 'text-blue-500' : ''}
						></DyteControlbarButton>
						{requestCount !== 0 && (
							<div className="absolute bg-blue-500 text-white top-0 right-0 rounded-full py-1 px-2 text-xs">
								{requestCount}
							</div>
						)}
					</div>
				</footer>
			</section>
			<aside className="w-80 m-4 flex flex-col gap-4">
				{isScreenShareEnabled && (
					<DyteParticipantTile participant={activeSpeaker} meeting={meeting} size="md" />
				)}
				<div className="flex relative bg-900 shrink rounded-xl overflow-hidden h-full">
					<DyteChat meeting={meeting} />
					<SidebarOverlay show={participantListVisible}>
						{participantListVisible ? <DyteParticipants meeting={meeting} /> : null}
					</SidebarOverlay>
				</div>
			</aside>
		</main>
	);
}
