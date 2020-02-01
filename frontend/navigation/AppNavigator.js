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


import NotificationScreen from '../screens/NotificationScreen';
import RegisterVehicleScreen from '../screens/RegisterVehicleScreen';
import SetMaxOdometer from '../screens/addinfo/SetMaxOdometer';
import FillGasScreen from '../screens/addinfo/FillGasScreen';
import FillOilScreen from '../screens/addinfo/FillOilScreen';
import CarAuthorizeScreen from '../screens/addinfo/CarAuthorizeScreen';
import PayServiceScreen from '../screens/addinfo/PayServiceScreen';
import PayExpenseScreen from '../screens/addinfo/PayExpenseScreen';
import ServiceScreenModules from '../screens/addinfo/ServiceScreenModules';
import ServiceModuleCreateScreen from '../screens/addinfo/ServiceModuleCreateScreen';
import CreateVehicleModel from '../screens/addinfo/CreateVehicleModel';
import MyVehicleScreen from '../screens/MyVehicleScreen'

import VehicleDetailReport from '../screens/VehicleDetailReport';
import VehicleDetailHistory from '../screens/VehicleDetailHistory';

import SettingsScreen from '../screens/SettingsScreen';
import VehicleSettingScreen from '../screens/setting/VehicleSettingScreen';
import ServiceMaintainSettingScreen from '../screens/setting/ServiceMaintainSettingScreen';
import CheckJoinTeamScreen from '../screens/setting/CheckJoinTeamScreen';
import ForgotPasswordScreen from '../screens/setting/ForgotPasswordScreen';
import CustomerVoiceScreen from  '../screens/setting/CustomerVoiceScreen';
import SettingVehicleModulesScreen from '../screens/setting/SettingVehicleModulesScreen';

import LoginScreen from '../screens/setting/LoginScreen';
import ProfileScreen from '../screens/setting/ProfileScreen';
import RegisterUserScreen from '../screens/setting/RegisterUserScreen';
import CreateTeamScreen from '../screens/setting/CreateTeamScreen'
import JoinTeamScreen from '../screens/setting/JoinTeamScreen'
import DebugScreen from '../screens/setting/DebugScreen'
import SettingServiceScreenModules from '../screens/setting/SettingServiceScreenModules';

import TeamScreen from '../screens/TeamScreen';
import MemberVehicleListScreen from '../screens/team/MemberVehicleListScreen'
import {checkAndShowInterestial} from '../components/AdsManager'

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
const MyVehicleStack = createStackNavigator(
  {
    MyVehicle: MyVehicleScreen,
    NewVehicle: RegisterVehicleScreen,
    VehicleDetail: VehicleDetailReport,
    VehicleHistory: VehicleDetailHistory,
    FillGas: FillGasScreen,
    //FillOil: FillOilScreen,
    CarAuthorize: CarAuthorizeScreen,
    PayExpense: PayExpenseScreen,
    PayService: PayServiceScreen,
    ServiceModules: ServiceScreenModules,
    ServiceModuleCreate: ServiceModuleCreateScreen,
    SetMaxOdometer: SetMaxOdometer,
    ServiceMaintainSetting: ServiceMaintainSettingScreen,
    CreateVehicleModel:CreateVehicleModel
  },
  config
);


const MyDrawerNavigator = createDrawerNavigator({
  Home: {
    screen: HomeStack,
    navigationOptions: {
      drawerLabel: 'Home',
    },
  },
  Notifications: {
    screen: MyVehicleStack,
    navigationOptions: {
      drawerLabel: 'XeCuaToi',
    },
  },
});

export default createAppContainer(MyDrawerNavigator);