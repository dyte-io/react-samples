import * as React from 'react';

const WidgetLauncher = ({ onClick }: { onClick: () => void }) => (
	<aside className="h-12 w-12 cursor-pointer rounded-full bg-blue-600 p-2 text-white" onClick={onClick}>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height={32} width={32}>
			<path
				fill="currentColor"
				d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10a9.96 9.96 0 0 1-4.587-1.112l-3.826 1.067a1.25 1.25 0 0 1-1.54-1.54l1.068-3.823A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2Zm0 1.5A8.5 8.5 0 0 0 3.5 12c0 1.47.373 2.883 1.073 4.137l.15.27-1.112 3.984 3.987-1.112.27.15A8.5 8.5 0 1 0 12 3.5ZM8.75 13h4.498a.75.75 0 0 1 .102 1.493l-.102.007H8.75a.75.75 0 0 1-.102-1.493L8.75 13h4.498H8.75Zm0-3.5h6.505a.75.75 0 0 1 .101 1.493l-.101.007H8.75a.75.75 0 0 1-.102-1.493L8.75 9.5h6.505H8.75Z"
			/>
		</svg>
	</aside>
);
export default WidgetLauncher;
