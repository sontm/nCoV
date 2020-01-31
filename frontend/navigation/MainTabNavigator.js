import React from 'react';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { withNavigation } from 'react-navigation';

import { Button, Text, Icon, Footer, FooterTab, ActionSheet } from "native-base";

import TabBarIcon from '../components/TabBarIcon';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

import HomeScreen from '../screens/HomeScreen';
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

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
    Notification: NotificationScreen
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

const BUTTONS = [
  { text: "Đổ Xăng", icon: "color-fill", iconColor: AppConstants.COLOR_FILL_FUEL },//1
  //{ text: "Thay Dầu", icon: "analytics", iconColor: "#f42ced" },//2
  { text: "Phụ Chi", icon: "ios-more", iconColor: AppConstants.COLOR_FILL_EXPENSE },//3
  { text: "Sửa Chữa/Bảo Dưỡng", icon: "construct", iconColor: AppConstants.COLOR_FILL_SERVICE },//4
  { text: "Đăng Kiểm/Bảo Hiểm/Phí", icon: "paper", iconColor: AppConstants.COLOR_FILL_AUTH },//5
  { text: "Thêm Xe", icon: "car", iconColor: AppConstants.COLOR_FILL_CAR },//0
  { text: "Đóng", icon: "close", iconColor: AppConstants.COLOR_GOOGLE }//6
];

const FILLGAS_INDEX = 0;
//const FILLOIL_INDEX = 1;
const PAY_EXPENSE_INDEX = 1;
const PAY_SERVICE_INDEX = 2;
const CAR_AUTHORIZE_INDEX = 3;
const NEW_VEHICLE = 4;
const CANCEL_INDEX = 5;

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
    VehicleSetting: VehicleSettingScreen,
    Login: LoginScreen,
    Profile: ProfileScreen,
    RegisterUser: RegisterUserScreen,
    CreateTeam: CreateTeamScreen,
    JoinTeam: JoinTeamScreen,
    ServiceMaintainSetting: ServiceMaintainSettingScreen,
    ServiceModulesSetting: SettingServiceScreenModules,
    ServiceModuleCreate: ServiceModuleCreateScreen,
    CheckJoinTeamScreen: CheckJoinTeamScreen,
    ForgotPasswordScreen: ForgotPasswordScreen,
    CustomerVoiceScreen: CustomerVoiceScreen,
    Notification: NotificationScreen,
    SettingVehicleModulesScreen: SettingVehicleModulesScreen,
    CreateVehicleModel:CreateVehicleModel,
    
    DebugScreen: DebugScreen
  },
  config
);

SettingsStack.navigationOptions = {
  tabBarLabel: 'User',
  tabBarIcon: ({ focused }) => (
    <Ionicons
      name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
      size={26}
      style={{ marginBottom: -3 }}
      color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
    />
  ),
};

SettingsStack.path = '';


const TeamStack = createStackNavigator(
  {
    Team: TeamScreen,
    MemberVehicles: MemberVehicleListScreen,
    VehicleDetail: VehicleDetailReport,
    VehicleHistory: VehicleDetailHistory,
    CreateTeam: CreateTeamScreen,
    JoinTeam: JoinTeamScreen,
  },
  config
);

const tabNavigator = createBottomTabNavigator({
    HomeStack,
    MyVehicleStack,
    //DetailStack,
    TeamStack,
    // VehicleDetail: { screen: VehicleDetailReport },
    SettingsStack,

    // NewVehicle: { screen: RegisterVehicleScreen },
    // FillGas: { screen: FillGasScreen },
    // FillOil: { screen: FillOilScreen },
    // CarAuthorize: { screen: CarAuthorizeScreen },
  },
  {
    tabBarPosition: "bottom",
    tabBarComponent: props => {
      return (
        <Footer style={{height: 56}}>
          <FooterTab style={styles.footerContainer}>
            <Button
              vertical
              active={props.navigation.state.index === 0}
              style={props.navigation.state.index==0?styles.btnActive:null}
              onPress={() => {
                AppConstants.CURRENT_VEHICLE_ID = "0";
                AppConstants.CURRENT_EDIT_FILL_ID = "0";
                props.navigation.navigate("Home")
                checkAndShowInterestial();
              }}>
              <Icon name='home' style={props.navigation.state.index==0?styles.iconActive:styles.iconInActive}/>
              <Text style={props.navigation.state.index==0?styles.textActive:styles.textInActive}>{AppLocales.t("NAV_BOT_HOME")}</Text>
            </Button>

            <Button
              vertical
              active={props.navigation.state.index === 1}
              style={props.navigation.state.index==1?styles.btnActive:null}
              onPress={() => {
                AppConstants.CURRENT_VEHICLE_ID = "0";
                AppConstants.CURRENT_EDIT_FILL_ID = "0";
                checkAndShowInterestial();
                if (props.navigation.state.index === 1) {
                  props.navigation.navigate("MyVehicle")
                } else {
                  props.navigation.navigate("MyVehicleStack")
                }
              }}>
              <Icon type="FontAwesome" name='user' style={props.navigation.state.index==1?styles.iconActive:styles.iconInActive}/>
              <Text style={props.navigation.state.index==1?styles.textActive:styles.textInActive}>{AppLocales.t("NAV_BOT_MY_CAR")}</Text>
            </Button>
            
            
            <TouchableOpacity 
              onPress={() =>
                ActionSheet.show(
                {
                    options: BUTTONS,
                    cancelButtonIndex: CANCEL_INDEX,
                    //title: "Choose category"
                },
                (btnIndex) => {
                  if (btnIndex == NEW_VEHICLE) {
                      props.navigation.navigate("NewVehicle", 
                          {createNew: true})
                  } else if (btnIndex == FILLGAS_INDEX) {
                      props.navigation.navigate("FillGas", 
                          {createNew: true})
                  } 
                  // else if (btnIndex == FILLOIL_INDEX) {
                  //     props.navigation.navigate("FillOil", 
                  //         {createNew: true})
                  // } 
                  else if (btnIndex == CAR_AUTHORIZE_INDEX) {
                      props.navigation.navigate("CarAuthorize", 
                          {createNew: true})
                  } else if (btnIndex == PAY_EXPENSE_INDEX) {
                      props.navigation.navigate("PayExpense", 
                          {createNew: true})
                  } else if (btnIndex == PAY_SERVICE_INDEX) {
                      props.navigation.navigate("PayService", 
                          {createNew: true})
                  }
                })
              }>
              <Icon type="AntDesign" name='pluscircle' style={{fontSize: 40, marginTop: 2, marginLeft: 3, marginRight: 3, 
                color: AppConstants.COLOR_HEADER_BG_LIGHT}}/>
            </TouchableOpacity>
            
            <Button
              vertical
              active={props.navigation.state.index === 2}
              style={props.navigation.state.index==2?styles.btnActive:null}
              onPress={() => {
                AppConstants.CURRENT_VEHICLE_ID = "0";
                AppConstants.CURRENT_EDIT_FILL_ID = "0";
                checkAndShowInterestial();
                if (props.navigation.state.index === 2) {
                  props.navigation.navigate("Team")
                } else {
                  props.navigation.navigate("TeamStack")
                }
              }}>
              <Icon type="Octicons" name='organization' style={props.navigation.state.index==2?styles.iconActive:styles.iconInActive}/>
              <Text style={props.navigation.state.index==2?styles.textActive:styles.textInActive}>{AppLocales.t("NAV_BOT_TEAM")}</Text>
            </Button>
            
            <Button
              vertical
              active={props.navigation.state.index === 3}
              style={props.navigation.state.index==3?styles.btnActive:null}
              onPress={() => {
                AppConstants.CURRENT_VEHICLE_ID = "0";
                AppConstants.CURRENT_EDIT_FILL_ID = "0";
                checkAndShowInterestial();
                if (props.navigation.state.index === 3) {
                  props.navigation.navigate("Settings")
                } else {
                  props.navigation.navigate("SettingsStack")
                }
              }}>
              <Icon name='more' style={props.navigation.state.index==3?styles.iconActive:styles.iconInActive}/>
              <Text style={props.navigation.state.index==3?styles.textActive:styles.textInActive}>{AppLocales.t("NAV_BOT_MORE")}</Text>
            </Button>
          </FooterTab>
        </Footer>
      );
    }
  }
);

tabNavigator.path = '';

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: AppConstants.COLOR_GREY_LIGHT_BG,
    // color: "white"
  },

  btnActive: {
    backgroundColor: AppConstants.COLOR_GREY_LIGHT_BG,
    padding: 0
  },
  iconActive: {
    fontSize: 24,
    color: AppConstants.COLOR_HEADER_BG_LIGHT
  },
  iconInActive: {
    fontSize: 24,
    color: "#899696"
  },
  textActive: {
    fontSize: 9,
    color: AppConstants.COLOR_HEADER_BG_LIGHT
  },
  textInActive: {
    fontSize: 9,
    color: "#899696"
  }
})
export default (tabNavigator);
