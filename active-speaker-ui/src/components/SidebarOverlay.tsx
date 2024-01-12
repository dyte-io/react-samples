import { ReactElement } from 'react';

export default function SidebarOverlay({ show, children }: { show: boolean; children: ReactElement | null }) {
	return (
		<div
			className={`absolute z-20 w-full h-full bg-900 py-4 duration-300 ease-out transition-all ${
				show ? 'right-0' : '-right-full'
			}`}
		>
			{children}
		</div>
	);
}
