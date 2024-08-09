import { DyteDialog, DyteIcon, defaultIconPack } from "@dytesdk/react-ui-kit";
import { useState } from "react";
import DyteClient from "@dytesdk/web-core";
import { UIConfig } from "@dytesdk/ui-kit";
import AudioPreview from "./audio-preview";
import VideoPreview from "./video-preview";
import { CustomStates, SetStates } from "../types";

function MediaPreviewModal({
    open, states, setStates, meeting, config,
}: { open: boolean, config: UIConfig, states: CustomStates, setStates: SetStates, meeting: DyteClient }) {
    const [activeTab, setActiveTab] = useState<'audio' | 'video'>('video');
    return (
        <DyteDialog
            open={open}
            onDyteDialogClose={() => setStates((oldState: CustomStates) => { return {
                ...oldState,
                activeMediaPreviewModal: false
            }})}
        >
            <div className="flex min-w-[720px] min-h-[480px] bg-[#222222]">
                <aside className="flex flex-col w-1/3 bg-[#181818]">
                    <header className="flex justify-center items-center h-[100px]">
                        <h2>Media Preview</h2>
                    </header>
                    {meeting.self.permissions.canProduceAudio === 'ALLOWED' &&
                        <button
                            type="button"
                            className={`${activeTab === 'audio' ? 'bg-[#2160FD]' : ''} flex justify-between p-2 rounded`}
                            onClick={() => setActiveTab('audio')}
                        >
                            Audio
                            <div>
                                <DyteIcon icon={defaultIconPack.mic_on} />
                            </div>
                        </button>
                    }
                    {meeting.self.permissions.canProduceVideo === 'ALLOWED' && (
                        <button
                            type="button"
                            className={`${activeTab === 'video' ? 'bg-[#2160FD]' : ''} flex justify-between p-2 rounded`}
                            onClick={() => setActiveTab('video')}
                        >
                            Video
                            <div>
                                <DyteIcon icon={defaultIconPack.video_on} />
                            </div>
                        </button>
                    )}
                </aside>
                <main className="flex flex-col w-2/3">
                    {activeTab === 'audio' && <AudioPreview meeting={meeting} config={config} states={states} setStates={setStates} />}
                    {activeTab === 'video' && <VideoPreview meeting={meeting} config={config} states={states} setStates={setStates} />}
                </main>
            </div>
        </DyteDialog>
    )
}

export default MediaPreviewModal;