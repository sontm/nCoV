import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Platform, View, StyleSheet, Image, TextInput, AsyncStorage, TouchableOpacity, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import AppConstants from '../constants/AppConstants';
import apputils from '../constants/AppUtils';
import AppLocales from '../constants/i18n';
import NetInfo from "@react-native-community/netinfo";
import {actAppSyncLatestDataIfNeeded} from '../redux/AppDataReducer'
import {Toast} from 'native-base';

class CheckLatestAppDataManager extends React.Component {
  constructor(props) {
    super(props);

  }
  
  componentDidMount() {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        this.props.actAppSyncLatestDataIfNeeded(this.props.appData);
      } else {
        Toast.show({
          text: AppLocales.t("NHOME_TOAST_NEED_INTERNET_CON"),
          //buttonText: "Okay",
          position: "bottom",
          type: "danger",
          duration: 5000
        })
      }
    });
    
  }

  render() {
    return null;
  }
}

const mapStateToProps = (state) => ({
  appData: state.appData
});
const mapActionsToProps = {
  actAppSyncLatestDataIfNeeded
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(CheckLatestAppDataManager);
