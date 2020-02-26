import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import ProviderNavigation from './ProviderNavigation';
import LoginScreen from '../screens/LoginScreen';
export default createAppContainer(
  createSwitchNavigator({
    Login: LoginScreen,
    Provider:ProviderNavigation,
  })
);
