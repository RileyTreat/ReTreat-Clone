import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
// ... other imports
import { restoreCSRF, csrfFetch } from './store/csrf';
import App from './App';
import './index.css';

import * as sessionActions from './store/session';

import configureStore from './store';

const store = configureStore();


if (import.meta.env.MODE !== 'production') {
  restoreCSRF();

  window.csrfFetch = csrfFetch;
  window.store = store;
  window.sessionActions = sessionActions;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);