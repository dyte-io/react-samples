/* eslint-disable @next/next/no-img-element */
import Dialog from './Dialog';
import type DyteClient from '@dytesdk/web-core';

const ReactionsManager = ({
  meeting,
  isOpen,
  onClose,
}: {
  meeting: DyteClient;
  onClose: () => void;
  isOpen: boolean;
}) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} header={'Effects'}>
      <div
        className="relative flex overflow-hidden rounded-lg w-full h-full"
        style={{ backgroundColor: '' }}
      >
        <main className="">
          <div className='reactions-holder'>
            {
                ['🔄', '😎', '💗', '🔥'].map((reaction, index) => {
                    return (
                    <div
                     key={index}
                     className='w-24 h-24 inline m-5'
                     onClick={async () => {
                        await meeting.participants.broadcastMessage("reactions", {
                            reaction: index === 0 ? '': reaction,
                            peerId: meeting.self.id,
                        });
                     }}
                    >{reaction}</div>)
                })
            }
          </div>
        </main>
      </div>
    </Dialog>
  );
};

export default ReactionsManager;
