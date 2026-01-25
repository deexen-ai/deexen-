import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ErrorBoundary from './ErrorBoundary.tsx'

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('Root element with ID "root" not found in the DOM. Cannot mount React application.');
} else {
  const AppContent = (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );

  if (import.meta.env.MODE === 'development') {
    createRoot(rootElement).render(
      <StrictMode>
        {AppContent}
      </StrictMode>,
    );
  } else {
    createRoot(rootElement).render(AppContent);
  }
}
