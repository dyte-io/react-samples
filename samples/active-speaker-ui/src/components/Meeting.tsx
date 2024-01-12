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
} from '@dytesdk/react-ui-kit';
import { useContext } from 'react';
import { MeetingContext } from './MeetingContext';
import { DyteWaitingScreen } from '@dytesdk/react-ui-kit';

export default function Meeting() {
	const {
		meeting,
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

	const iconSize = ['sm', 'md'].includes(breakpoint) ? 'sm' : 'md';
	const showChat = states.sidebar === 'chat' || (
		!states.activeSidebar && showSpotlight && !['sm', 'md'].includes(breakpoint)
	);
	const showPolls = states.sidebar === 'polls';
	const showPlugins = states.sidebar === 'plugins';

	if (roomState === 'ended') {
		return <main className="flex min-h-screen text-gray-50 items-center justify-center">Meeting ended</main>;
	}

	if (roomState === 'init') {
		return <main className="flex min-h-screen text-gray-50 items-center justify-center">Joining...</main>;
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
		<main className="flex min-h-screen flex-row md:flex-col" ref={(el) => {
			el?.addEventListener(
				'dyteStateUpdate',
				(e) => {
					if (!(e instanceof CustomEvent)) return;
					updateStates(e.detail);
				},
			);
		}}>
			<section className="flex flex-1 grow m-4 gap-4">
				{ (isScreenShareEnabled && activeScreenshares.length === 1 && !isPluginsEnabled) ? (
					<DyteScreenshareView className='h-auto' meeting={meeting} participant={activeScreenshares[0]} />
				) : (isPluginsEnabled && !isScreenShareEnabled && activePlugins.length === 1 ) ? (
					<DytePluginMain className='h-auto' meeting={meeting} plugin={activePlugins[0]} />
				) : (
					<DyteGrid meeting={meeting} className='h-auto' />
				)}

				{(showChat || showPolls || showPlugins) && <aside className="flex md:flex-col gap-4 w-80">
					{showSpotlight && activeSpeaker && (
						<div className='hidden md:flex'>
							<DyteParticipantTile
								participant={activeSpeaker}
								meeting={meeting}
								size="md"
							/>
						</div>
					)}
					{showChat && <DyteChat meeting={meeting} className="sidebar shrink rounded-xl overflow-hidden" />}
					{showPolls && <DytePolls meeting={meeting} className="sidebar shrink rounded-xl overflow-hidden" />}
					{showPlugins && <DytePlugins meeting={meeting} className="sidebar shrink rounded-xl overflow-hidden" />}
				</aside>}
				{showSpotlight && activeSpeaker && (
					<div className='flex md:hidden fixed left-1 bottom-1 h-[80px] w-[130px]'>
						<DyteParticipantTile
							className='h-[80px] w-[130px]'
							participant={activeSpeaker}
							meeting={meeting}
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
					{!['sm', 'md'].includes(breakpoint) && <DyteScreenShareToggle meeting={meeting} size={iconSize} />}
					<DyteMicToggle meeting={meeting}  size={iconSize} />
					<DyteCameraToggle meeting={meeting}  size={iconSize} />
					<DyteLeaveButton  size={iconSize}/>
				</div>
				<div className='flex basis-1/3 justify-start flex-col md:flex-row md:justify-end'>
					<DyteChatToggle meeting={meeting}  size={iconSize} />
					<DytePollsToggle meeting={meeting}  size={iconSize} />
					{!['sm', 'md'].includes(breakpoint) && <DytePluginsToggle meeting={meeting}  size={iconSize} />}
				</div>
			</footer>
		</main>
	);
}
