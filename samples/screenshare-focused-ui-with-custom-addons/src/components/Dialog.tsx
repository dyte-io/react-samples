import { DyteButton, DyteIcon, defaultIconPack } from '@dytesdk/react-ui-kit';
import { FC, ReactNode } from 'react';

type DialogProps = {
  isOpen: boolean;
  onClose: () => void;
  header: string;
  children: ReactNode;
};
const Dialog: FC<DialogProps> = ({ header, isOpen, children, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="DyteDialog" data-open={isOpen}>
      <div id="dialog">
        {/* <header>
          <h2>Effects</h2>
        </header> */}
        <DyteButton
          id="dismiss-btn"
          kind="icon"
          variant="ghost"
          onClick={() => onClose()}
          iconPack={defaultIconPack}
        >
          <DyteIcon icon={defaultIconPack.dismiss} iconPack={defaultIconPack} />
        </DyteButton>
        {children}
      </div>
    </div>
  );
};

export default Dialog;
