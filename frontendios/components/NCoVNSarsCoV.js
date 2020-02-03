import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { View, StyleSheet, Image, TextInput, AsyncStorage, TouchableOpacity } from 'react-native';
import {Container, Header, Title, Segment, Left, Right,Content, Button, Text, Icon, 
    Card, CardItem, Body, H1, H2, H3, ActionSheet, Tab, Tabs, Picker, Form, DatePicker, Toast } from 'native-base';
import Layout from '../constants/Layout'
import { connect } from 'react-redux';
import AppUtils from '../constants/AppUtils'
import AppConstants from '../constants/AppConstants';
import {VictoryLabel, VictoryGroup, VictoryBar, VictoryChart, VictoryStack, VictoryArea, VictoryLine, VictoryAxis} from 'victory-native';
// import { LineChart, Grid } from 'react-native-svg-charts'

import AppLocales from '../constants/i18n'

import {
    LineChart
  } from "react-native-chart-kit";
import { NoDataText, TypoH5, TypoH4 } from './StyledText';

class NCoVNSarsCoV extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };

  }

  
  render() {
    let theData = this.props.appData.ncov;
    // let caseArr = [{x:1,y:1},{x:2, y: 8096},{x:3,y:theData.data[0].world.case},{x:4,y:1}]
    // let deathArr = [{x:1,y:1},{x:2, y: 774},{x:3,y:theData.data[0].world.death},{x:4,y:1}]
    let caseArr = [{x:1, y: 8096},{x:2, y: 2494},{x:3,y:theData.data[0].world.case}]
    let deathArr = [{x:1, y: 774},{x:2, y: 858},{x:3,y:theData.data[0].world.death}]
    let arrLabelX = ["MERS-CoV","SARS-CoV", "nCoV"]
    let theBarWidth = 25;
    return (
        <View style={styles.container}>
            <View style={{...styles.textRow, alignSelf:"center"}}>
                <Text><TypoH4>
                    SARS(2003) vs MERS(2012) vs nCoV
                </TypoH4></Text>
            </View>

            <View style={{flexDirection:"row", justifyContent:"space-around", marginTop: 10}}>
                <Text style={{alignSelf: "center", fontSize: 10, color: AppConstants.COLOR_TEXT_LIGHT_INFO}}>
                    {AppLocales.t("NHOME_FATAL_RATE")}
                </Text>
                <Text style={{alignSelf: "center", fontSize: 10, color: AppConstants.COLOR_TEXT_LIGHT_INFO}}>
                    {AppLocales.t("NHOME_FATAL_RATE")}
                </Text>
                <Text style={{alignSelf: "center", fontSize: 10, color: AppConstants.COLOR_TEXT_LIGHT_INFO}}>
                    {AppLocales.t("NHOME_FATAL_RATE")}
                </Text>
            </View>

            <View style={{flexDirection:"row", justifyContent:"space-around"}}>
                <Text style={{color: AppConstants.COLOR_GOOGLE, fontSize: 26}}>
                    {"9.6%"}
                </Text>
                <Text style={{color: AppConstants.COLOR_GOOGLE, fontSize: 26}}>
                    {"34.4%"}
                </Text>
                <Text style={{color: AppConstants.COLOR_GOOGLE, fontSize: 26}}>
                    {AppUtils.formatToPercent(theData.data[0].world.death, theData.data[0].world.death+theData.data[0].world.case)}
                </Text>
            </View>

            <View style={styles.gasUsageContainer}>
                <VictoryChart
                    width={Layout.window.width}
                    height={250}
                    padding={{top:20,bottom:20,left:10,right:10}}
                    domainPadding={{y: [0, 0], x: [Layout.window.width/6-10, Layout.window.width/6+10]}}
                    colorScale={AppConstants.COLOR_SCALE_10}
                >
                <VictoryStack
                    width={Layout.window.width}
                    //domainPadding={{y: [0, 10], x: [20, 10]}}
                    colorScale={AppConstants.COLOR_SCALE_10}
                >
                    <VictoryBar
                        barWidth={theBarWidth}
                        data={caseArr}
                        labels={({ datum }) => `${datum.y>0?(datum.y+"\ncases"):""}`}
                        labelComponent={<VictoryLabel dx={30} dy={20} style={{fontSize: 10}}/>}
                    />
                    <VictoryBar
                        barWidth={theBarWidth}
                        data={deathArr}
                        labels={({ datum }) => `${datum.y>0?(datum.y+" deaths"):""}`}
                        labelComponent={<VictoryLabel dx={0} dy={-5} style={{fontSize: 10}}/>}
                    />
                </VictoryStack>
                <VictoryAxis
                    crossAxis
                    standalone={false}
                    tickValues={arrLabelX}
                    //tickFormat={(t,idx) => `${AppUtils.formatDateMonthYearVN(t)}`}
                    tickLabelComponent={<VictoryLabel style={{fontSize: 10}}/>}
                    // tickCount={arrKmPerWeek ? arrKmPerWeek.length/2 : 1}
                    //tickValues={tickXLabels}
                    style={{
                        // grid: {stroke: "rgb(240,240,240)"},
                        //ticks: {stroke: "grey", size: 5},
                        tickLabels: {fontSize: 9,padding: 1, angle: 0}
                    }}
                />
                {/* <VictoryAxis
                    dependentAxis
                    standalone={false}
                    //label={arrLabelY[this.state.activeDisplay]}
                    axisLabelComponent={<VictoryLabel dy={40} dx={120} style={{fontSize: 11}}/>}
                    // tickFormat={(t) => `${this.state.activeDisplay!= 0 ? AppUtils.formatMoneyToK(t) :
                    //     AppUtils.formatDistanceToKm(t)}`}
                    // tickCount={arrKmPerWeek ? arrKmPerWeek.length/2 : 1}
                    style={{
                        ticks: {stroke: "grey", size: 5},
                        tickLabels: {fontSize: 10, padding: 0}
                    }}
                /> */}

                </VictoryChart>
            </View>
        </View>
    )
    }
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: "white",
      flexDirection: "column",
      justifyContent: "space-between",
      marginTop: 10,
    //   marginBottom: 10,
      paddingBottom: 5,

      marginHorizontal: 5,

      borderWidth: 0.5,
      borderColor: "rgb(220, 220, 220)",
      borderRadius: 7,
    },

    activeSegment: {
        backgroundColor: AppConstants.COLOR_BUTTON_BG,
        color:"white",
    },
    inActiveSegment: {
        backgroundColor: AppConstants.COLOR_GREY_LIGHT_BG,
        color:AppConstants.COLOR_PICKER_TEXT,
    },
    activeSegmentText: {
        color:"white",
        fontSize: 12
    },
    inActiveSegmentText: {
        color:AppConstants.COLOR_PICKER_TEXT,
        fontSize: 12
    },

    textRow: {
        flexDirection: "row",
        paddingTop: 10,
        paddingLeft: 5,
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        flexGrow: 100,
    },
    textRowOption: {
        flexDirection: "row",
        paddingTop: 5,
        paddingLeft: 5,
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        flexGrow: 100
    },
    statRow: {
        flexDirection: "row",
        padding: 3,
        justifyContent: "center",
        flexWrap: "wrap",
        flexGrow: 100,
        // backgroundColor: "white"
    },
    equalStartRow: {
        flex: 1,
    },
    statRowLabel: {
        flex: 1,
        textAlign: "right",
        paddingRight: 5
    },
    statRowValue: {
        flex: 2
    },

    gasUsageContainer: {
        width: "96%",
        // height: 320,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginTop: 5
    },

})

const mapStateToProps = (state) => ({
    appData: state.appData
});
const mapActionsToProps = {
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(NCoVNSarsCoV);
