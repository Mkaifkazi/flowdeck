import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import { router } from './routes';
import { initializeStore } from './store/initializeStore';
import './styles/custom-bootstrap.scss';
import './styles/index.css';

// Initialize store with mock data
initializeStore(store.dispatch);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </Provider>
  </StrictMode>
);
