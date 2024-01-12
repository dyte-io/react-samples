import App from './App.tsx';
import './index.css';
import { provideDyteDesignSystem } from '@dytesdk/react-ui-kit';
import ReactDOM from 'react-dom/client';

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);

provideDyteDesignSystem(document.body, {
	theme: 'dark',
});
