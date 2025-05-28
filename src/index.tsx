import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './component/app/app';
import { Provider } from 'react-redux';
import { store } from './store';
import { checkAuthAction, fetchFavoritesAction, fetchOffersAction } from './store/api-actions';
import ErrorMessage from './component/error-message/error-message';

store.dispatch(fetchOffersAction());
store.dispatch(checkAuthAction());
store.dispatch(fetchFavoritesAction());

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ErrorMessage />
      <App />
    </Provider>
  </React.StrictMode>
);
