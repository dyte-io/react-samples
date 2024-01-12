import Meeting from './components/Meeting';
import { DyteDialogManager, DyteParticipantsAudio, DyteNotifications } from '@dytesdk/react-ui-kit';
import { DyteProvider, useDyteClient } from '@dytesdk/react-web-core';
import { useEffect } from 'react';
import MeetingProvider from './components/MeetingContext';

export default function App() {
	const [meeting, initMeeting] = useDyteClient();
	const url = new URL(window.location.href);
	const queryToken = url.searchParams.get('authToken')!;

	if (!queryToken) {
		alert('Please add authToken to url query params');
	}

	useEffect(() => {
		initMeeting({
			authToken: queryToken,
			defaults: {
				audio: false,
				video: false,
			},
		}).then((meeting) => {
			meeting?.join();
		});
	}, []); // don't add dependencies to execute just once

	if (!meeting)
		return <main className="flex min-h-screen text-gray-50 items-center justify-center">Connecting...</main>;

	return (
		<DyteProvider value={meeting}>
			<DyteParticipantsAudio meeting={meeting} />
			<DyteDialogManager meeting={meeting} />
			<DyteNotifications meeting={meeting} />
			<MeetingProvider>
				<Meeting />
			</MeetingProvider>
		</DyteProvider>
	);
}
