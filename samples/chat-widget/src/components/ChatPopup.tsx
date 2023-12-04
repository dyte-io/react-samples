import { DyteChat, DyteMeeting, DyteSpinner } from '@dytesdk/react-ui-kit';
import { useDyteClient } from '@dytesdk/react-web-core';
import { ChatChannel } from '@dytesdk/web-core';
import { useEffect, useState } from 'react';

type DyteMeeting = Awaited<ReturnType<typeof useDyteClient>>[0];

const ChatPopup = ({ meeting }: { meeting: DyteMeeting }) => {
	const [channel, setChannel] = useState<ChatChannel | null>(null);

	useEffect(() => {
		if (!meeting) return;
		if (channel) return;
		const createChannel = async () => {
			if (!meeting.self.roomJoined) {
				await meeting.joinRoom();
			}
			const memberIds = meeting.participants.all.toArray().map((p) => p.userId);
			const createdChannel = await meeting.chat.createChannel(meeting.meta.meetingTitle, memberIds);
			setChannel(createdChannel);
		};
		createChannel();
	}, [channel, meeting]);

	if (meeting && channel) {
		return (
			<main className="flex h-96 w-96 flex-col rounded-md p-2">
				<DyteChat meeting={meeting} />
			</main>
		);
	}

	// loader
	return (
		<main className="flex w-96 justify-center rounded-md p-2">
			<DyteSpinner size="xl" />
		</main>
	);
};
export default ChatPopup;
