import React from 'react';
import ReactDOM from 'react-dom/client';

// Polyfill Promise.withResolvers for older browsers (like Safari < 17.4) - requested by pdfjs-dist v4+
if (typeof Promise.withResolvers === 'undefined') {
  // @ts-expect-error polyfill
  Promise.withResolvers = function () {
    let resolve, reject;
    const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
    return { promise, resolve, reject };
  };
}

// Polyfill Object.hasOwn for older browsers (Safari < 15.4)
if (!Object.hasOwn) {
  Object.hasOwn = function (obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  };
}

import App from './App.tsx';
import './index.css';
import { ErrorBoundary } from './ErrorBoundary.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
