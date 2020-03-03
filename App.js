import React, { Component } from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Platform, StyleSheet, Text, View } from 'react-native';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import reducers from "./reducers";
import { Root } from 'native-base';
import AppNavigator from './navigation/AppNavigator';

const store = createStore(reducers, applyMiddleware(thunk));
global.pusher;
global.deviceToken='';
global.deviceType='';
global.questionId=1;
global.searchStorage = [];
global.notifcount=0;
export default class App extends Component {
  constructor(props) {
    super(props)
  }

  render() {
  return (
    <Provider store={store}>
      <Root>
        <AppNavigator />
      </Root>
    </Provider>
    );
  }
  }
