import React, { Fragment } from 'react';
import { Provider } from 'react-redux';
import { StatusBar } from 'react-native';

import { Colors } from './app/Utils/Colors';
import AppNavigator from './app/Navigation/AppNavigator';
import { store } from './app/Redux/CreateStore';

const App = () => {
  return (
    <Fragment>
      <StatusBar backgroundColor={Colors.statusbar} barStyle="light-content" />
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    </Fragment>
  );
};

export default App;
