import { DyteParticipantTile, DyteScreenshareView, DyteSettingsToggle } from '@dytesdk/react-ui-kit';
import {
	DyteCameraToggle,
	DyteChat,
	DyteGrid,
	DyteLeaveButton,
	DyteMicToggle,
	DyteScreenShareToggle,
} from '@dytesdk/react-ui-kit';
import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core';
import { useThrottle } from '@uidotdev/usehooks';
import { useEffect, useState } from 'react';

const ACTIVE_SPEAKER_CHANGE_DELAY = 3000;

export default function Meeting() {
	const { meeting } = useDyteMeeting();
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
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [activeSpeakerInternal, setActiveSpeaker] = useState<any>();
	const activeSpeaker = useThrottle(activeSpeakerInternal, ACTIVE_SPEAKER_CHANGE_DELAY);

	useEffect(() => {
		const activeParticipants = meeting.participants.active.toArray();

		setActiveSpeaker(
			activeParticipants.find((participant) => participant.id === meeting.participants.lastActiveSpeaker) ??
				meeting.self,
		);
	}, [lastActiveSpeaker, meeting.participants.active, meeting.participants.lastActiveSpeaker, meeting.self]);

	return (
		<main className="flex min-h-screen">
			<section className="flex flex-col grow m-4 gap-4">
				{isScreenShareEnabled && screenSharingParticipant ? (
					<DyteScreenshareView meeting={meeting} participant={screenSharingParticipant} />
				) : (
					<DyteGrid meeting={meeting} />
				)}
				<footer className="flex justify-center">
					<DyteScreenShareToggle meeting={meeting} />
					<DyteMicToggle meeting={meeting} />
					<DyteCameraToggle meeting={meeting} />
					<DyteLeaveButton />
					<DyteSettingsToggle />
				</footer>
			</section>
			<aside className="w-80 m-4 flex flex-col gap-4">
				{isScreenShareEnabled && (
					<DyteParticipantTile participant={activeSpeaker} meeting={meeting} size="md" />
				)}
				<DyteChat meeting={meeting} className="sidebar shrink rounded-xl overflow-hidden" />
			</aside>
		</main>
	);
}
