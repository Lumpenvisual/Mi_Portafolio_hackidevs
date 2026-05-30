import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// StrictMode double-invokes effects in dev to surface side-effect bugs. R3F v9
// is StrictMode-safe (it guards against double-mounting the renderer), so we
// keep it on — it helps catch missing dispose() / subscription leaks early.
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
