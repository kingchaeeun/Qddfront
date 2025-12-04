// Sidepanel Entry Point
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import SidepanelApp from './SidepanelApp';

const root = document.getElementById('root');

if (root) {
  createRoot(root).render(
    <StrictMode>
      <SidepanelApp />
    </StrictMode>
  );
}
