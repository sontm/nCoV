import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
//import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator, createDrawerNavigator } from 'react-navigation';
import { Button, Text, Icon, Footer, FooterTab, ActionSheet } from "native-base";

//import MainTabNavigator from './MainTabNavigator';

import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

import HomeScreen from '../screens/HomeScreen';
import OutsideChinaScreen from '../screens/OutsideChinaScreen';
import VietnamScreen from '../screens/VietnamScreen';
import ChinaScreen from '../screens/ChinaScreen';

import AppConstants from '../constants/AppConstants';
import AppLocales from '../constants/i18n'
// export default createAppContainer(
//   createSwitchNavigator({
//     // You could add another route here for authentication.
//     // Read more at https://reactnavigation.org/docs/en/auth-flow.html
//     Main: MainTabNavigator,
//   })
// );


const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
    OutsideChinaScreen: OutsideChinaScreen,
    VietnamScreen: VietnamScreen,
    ChinaScreen: ChinaScreen
  },
  config
);


const MyDrawerNavigator = createDrawerNavigator({
  Home: {
    screen: HomeStack,
    navigationOptions: {
      drawerLabel: 'Home',
    },
  }
});

export default createAppContainer(MyDrawerNavigator);