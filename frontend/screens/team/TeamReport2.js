import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { connect } from 'react-redux';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  AsyncStorage,
  SafeAreaView
} from 'react-native';
import Layout from '../../constants/Layout'
import AppUtils from '../../constants/AppUtils'
import AppConstants from '../../constants/AppConstants';

import {Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text, Card, CardItem, H2, H3, H1, Tab, Tabs } from 'native-base';
import {VictoryLabel, VictoryPie, VictoryBar, VictoryChart, VictoryStack, VictoryArea, VictoryLine, VictoryAxis} from 'victory-native';
import GasUsageReport from '../../components/GasUsageReport'
import GasUsageTopReport from '../../components/GasUsageTopReport'
import MoneyUsageByTimeReport from '../../components/MoneyUsageByTimeReport'
import MoneyUsageReport from '../../components/MoneyUsageReport'

import VehicleBasicReport from '../../components/VehicleBasicReport'
import AppLocales from '../../constants/i18n'

class TeamReport2 extends React.Component {
  constructor(props) {
    super(props)

  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}>

          <GasUsageReport isTotalReport={true} isTeamDisplay={true}/>
          <GasUsageTopReport isTotalReport={true} isTeamDisplay={true}/>
          
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppConstants.COLOR_GREY_LIGHT_BG
  },
  contentContainer: {

  },
  textRow: {
    flexDirection: "row",
    paddingTop: 10,
    paddingLeft: 5,
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    flexGrow: 100
  },
});

const mapStateToProps = (state) => ({
  tempData: state.tempData
});
const mapActionsToProps = {
};

export default connect(
  mapStateToProps,mapActionsToProps
)(TeamReport2);

