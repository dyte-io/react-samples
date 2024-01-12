import {
	DyteCameraToggle,
	DyteChat,
	DyteGrid,
	DyteLeaveButton,
	DyteMicToggle,
	DyteParticipantTile,
	DyteScreenShareToggle,
	DyteScreenshareView,
	DyteSettingsToggle,
	DyteEndedScreen,
	DyteChatToggle,
	DytePollsToggle,
	DytePluginsToggle,
	DytePlugins,
	DytePolls,
	DytePluginMain,
	DyteParticipants,
	DyteParticipantsToggle,
	DyteSetupScreen,
	DyteStageToggle,
	DyteDialogManager,
	defaultIconPack,
} from '@dytesdk/react-ui-kit';
import { useContext } from 'react';
import { MeetingContext } from './MeetingContext';
import { DyteWaitingScreen } from '@dytesdk/react-ui-kit';

const HAND_RAISE_ICON = '<svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M4 12.02c0 1.06.2 2.1.6 3.08l.6 1.42c.22.55.64 1.01 1.17 1.29.27.14.56.21.86.21h2.55c.77 0 1.49-.41 1.87-1.08.5-.87 1.02-1.7 1.72-2.43l1.32-1.39c.44-.46.97-.84 1.49-1.23l.59-.45a.6.6 0 0 0 .23-.47c0-.75-.54-1.57-1.22-1.79a3.34 3.34 0 0 0-2.78.29V4.5a1.5 1.5 0 0 0-2.05-1.4 1.5 1.5 0 0 0-2.9 0A1.5 1.5 0 0 0 6 4.5v.09A1.5 1.5 0 0 0 4 6v6.02ZM8 4.5v4a.5.5 0 0 0 1 0v-5a.5.5 0 0 1 1 0v5a.5.5 0 0 0 1 0v-4a.5.5 0 0 1 1 0v6a.5.5 0 0 0 .85.37h.01c.22-.22.44-.44.72-.58.7-.35 2.22-.57 2.4.5l-.53.4c-.52.4-1.04.78-1.48 1.24l-1.33 1.38c-.75.79-1.31 1.7-1.85 2.63-.21.36-.6.58-1.01.58H7.23a.87.87 0 0 1-.4-.1 1.55 1.55 0 0 1-.71-.78l-.59-1.42a7.09 7.09 0 0 1-.53-2.7V6a.5.5 0 0 1 1 0v3.5a.5.5 0 0 0 1 0v-5a.5.5 0 0 1 1 0Z" fill="currentColor"></path></svg>';

export default function Meeting() {
	const {
		meeting,
		isHost,
		states,
		updateStates,
		roomState,
		isScreenShareEnabled,
		activeScreenshares,
		isPluginsEnabled,
		activeSpeaker,
		activePlugins,
		breakpoint,
		showSpotlight,
	} = useContext(MeetingContext)!;
	const isMobile = ['sm', 'md'].includes(breakpoint);
	const iconSize = isMobile ? 'sm' : 'md';
	const showChat = states.sidebar === 'chat';
	const showPolls = states.sidebar === 'polls';
	const showPlugins = states.sidebar === 'plugins';
	const showParticipants = states.sidebar === 'participants';
	const showSidebar = showChat || showPolls || showPlugins || showParticipants;
	const updatedIconPack = { ...defaultIconPack, join_stage: HAND_RAISE_ICON };

	if (roomState === 'ended') {
		return <main className="flex min-h-screen text-gray-50 items-center justify-center">Meeting ended</main>;
	}

	if (roomState === 'init') {
		return <main className="flex min-h-screen text-gray-50 items-center justify-center">
			<DyteSetupScreen
				meeting={meeting}
				states={{ meeting: 'setup' }}
			/>
		</main>;
	}

	if (['left', 'kicked', 'disconnected', 'rejected'].includes(roomState)) {
		return <main className="flex min-h-screen text-gray-50 items-center justify-center">
			<DyteEndedScreen meeting={meeting} />
		</main>;
	}

	if (roomState === 'waitlisted') {
		return <main className="flex min-h-screen text-gray-50 items-center justify-center">
			<DyteWaitingScreen meeting={meeting} />
		</main>;
	}

	return (
		<main
			className="flex min-h-screen flex-row md:flex-col"
			ref={(el) => {
				el?.addEventListener(
					'dyteStateUpdate',
					(e) => {
						if (!(e instanceof CustomEvent)) return;
						updateStates(e.detail);
					},
				);
			}}
		>
			<section className="flex flex-1 grow m-4 gap-4">
				{ ((showSidebar || isMobile) && isScreenShareEnabled && activeScreenshares.length === 1 && !isPluginsEnabled) ? (
					<DyteScreenshareView className='h-auto' meeting={meeting} participant={activeScreenshares[0]} />
				) : ((showSidebar || isMobile) && isPluginsEnabled && !isScreenShareEnabled && activePlugins.length === 1 ) ? (
					<DytePluginMain className='h-auto' meeting={meeting} plugin={activePlugins[0]} />
				) : (
					<DyteGrid meeting={meeting} className='h-auto' states={states} />
				)}

				{showSidebar && <aside className="flex md:flex-col gap-4 w-80">
					{showSpotlight && activeSpeaker && (
						<div className='hidden md:flex'>
							<DyteParticipantTile
								participant={activeSpeaker}
								meeting={meeting}
								states={states}
								size="md"
							/>
						</div>
					)}
					{showChat && <DyteChat meeting={meeting} className="sidebar shrink rounded-xl overflow-hidden" />}
					{showPolls && <DytePolls meeting={meeting} className="sidebar shrink rounded-xl overflow-hidden" />}
					{showPlugins && <DytePlugins meeting={meeting} className="sidebar shrink rounded-xl overflow-hidden" />}
					{showParticipants && <DyteParticipants meeting={meeting} className="sidebar shrink rounded-xl overflow-hidden" />}
				</aside>}
				{showSpotlight && activeSpeaker && (
					<div className='flex md:hidden fixed left-1 bottom-1 h-[80px] w-[130px]'>
						<DyteParticipantTile
							className='h-[80px] w-[130px]'
							participant={activeSpeaker}
							meeting={meeting}
							states={states}
							size="sm"
						/>
					</div>
				)}
			</section>
			<footer className="flex gap-2 flex-col-reverse md:flex-row">
				<div className='flex basis-1/3 justify-end flex-col md:flex-row md:justify-start'>
					<DyteSettingsToggle size={iconSize} />
				</div>
				<div className='flex basis-1/3 justify-center flex-col md:flex-row'>
					{isHost && !isMobile && <DyteScreenShareToggle meeting={meeting} size={iconSize} />}
					<DyteStageToggle meeting={meeting}  size={iconSize} iconPack={updatedIconPack}/>
					<DyteMicToggle meeting={meeting}  size={iconSize} />
					<DyteCameraToggle meeting={meeting}  size={iconSize} />
					<DyteLeaveButton  size={iconSize} />
				</div>
				<div className='flex basis-1/3 justify-start flex-col md:flex-row md:justify-end'>
					<DyteChatToggle meeting={meeting}  size={iconSize} />
					<DytePollsToggle meeting={meeting}  size={iconSize} />
					{isHost && <DyteParticipantsToggle meeting={meeting}  size={iconSize} />}
					{isHost && !isMobile && <DytePluginsToggle meeting={meeting}  size={iconSize} />}
				</div>
			</footer>
			<DyteDialogManager meeting={meeting} states={states} />
		</main>
	);
}
