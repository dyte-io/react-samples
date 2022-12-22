import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { provideDyteDesignSystem } from '@dytesdk/react-ui-kit';

provideDyteDesignSystem(document.body, {
  theme: 'light',
  googleFont: 'Inter',
  colors: {
    'video-bg': '#ebebeb',
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // NOTE: Not using StrictMode to avoid the double execution of useEffect
  // while trying out the sample
  <App />
);
