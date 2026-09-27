// Ensure window.fetch has both getter and setter in iframe/preview environments
if (typeof window !== 'undefined') {
  try {
    const origFetch = window.fetch;
    if (typeof origFetch === 'function') {
      let currentFetch = origFetch.bind(window);
      Object.defineProperty(window, 'fetch', {
        get: () => currentFetch,
        set: (val: typeof fetch) => {
          currentFetch = typeof val === 'function' ? val : origFetch;
        },
        configurable: true,
        enumerable: true,
      });
    }
  } catch (_e) {
    // Graceful fallback
  }
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
