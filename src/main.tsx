import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import { router } from './routes';
import { worker } from './api/browser';
import './styles/custom-bootstrap.scss';
import './styles/index.css';

// Start MSW in development
if (import.meta.env.DEV) {
  worker.start({
    onUnhandledRequest: 'bypass',
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </Provider>
  </StrictMode>
);
