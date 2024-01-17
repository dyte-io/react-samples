import App from './App';
import './index.css';
import { provideDyteDesignSystem } from '@dytesdk/react-ui-kit';
import ReactDOM from 'react-dom/client';

provideDyteDesignSystem(document.body, {
  theme: 'darkest',
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // NOTE: Not using StrictMode to avoid the double execution of useEffect
  // while trying out the sample
  <App />
);
