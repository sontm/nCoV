import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Platform, View, StyleSheet, Image, TextInput, AsyncStorage, TouchableOpacity, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import AppConstants from '../constants/AppConstants';
import apputils from '../constants/AppUtils';
import {actAppSyncLatestDataIfNeeded} from '../redux/AppDataReducer'
import {actUserInitializeInitialDataWhenAppStart} from '../redux/UserReducer'

class CheckLatestAppDataManager extends React.Component {
  constructor(props) {
    super(props);

  }
  
  componentWillMount() {
    this.props.actUserInitializeInitialDataWhenAppStart()
    this.props.actAppSyncLatestDataIfNeeded(this.props.appData);
  }

  render() {
    return null;
  }
}

const mapStateToProps = (state) => ({
  appData: state.appData
});
const mapActionsToProps = {
  actAppSyncLatestDataIfNeeded,
  actUserInitializeInitialDataWhenAppStart
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(CheckLatestAppDataManager);
