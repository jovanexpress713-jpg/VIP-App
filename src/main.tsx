import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

// Remove initial loader
const removeLoader = () => {
  const loader = document.querySelector('.initial-loader');
  if (loader) {
    loader.remove();
  }
};

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found - #root is missing in index.html');
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <ErrorBoundary lang="ar">
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

// Remove loader after React mounts
setTimeout(removeLoader, 100);

// Performance monitoring
if (import.meta.env.DEV) {
  console.log('🚀 VYRO VPN v2.5.4 - Development Mode');
  console.log('📦 Build: Vite + React 19 + Tailwind CSS 4 + TypeScript');
}

// Register service worker for PWA (optional, for future)
// if ('serviceWorker' in navigator && import.meta.env.PROD) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/sw.js').catch(() => {});
//   });
// }
