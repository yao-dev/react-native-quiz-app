import { Linking } from 'expo';
import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import Routes from './routes';
import './utils/array';

export default App = () => {
  const prefix = Linking.makeUrl('quiz-app://')

  return (
    <Provider store={store}>
      <Routes uriPrefix={prefix} />
    </Provider>
  );
};
