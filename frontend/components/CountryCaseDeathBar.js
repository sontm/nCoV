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
import { NoDataText, TypoH5 } from './StyledText';

class CountryCaseDeathBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };

  }

  //   data: [
    //     {
    //         date:"2020-01-31 12:45",
            // countries: [
            //     {
            //         name:"China",
            //         name_vn:"China",
            //         code:"cn",
            //         case: 9782,
            //         death: 213,
            //     },
    //     }]

  // Out
  // data:[{x:1|2|3,y}]
  // arrLabelY:["China","Vietnam"]
  parseCountriesTop(inputData, showChinaProvince, showVietnamProvince) {
    let caseArr = [];
    let deathArr = [];
    let arrLabelY = [];

    if (showVietnamProvince) {
        if (inputData && inputData.vietnam_province && inputData.vietnam_province.length > 0 && inputData.vietnam_province[0].provinces) {
            inputData.vietnam_province[0].provinces.forEach( (item,idx) => {
                arrLabelY.push(item.name)

                caseArr.push({x: idx+1, y: item.case})
                if (item.death) {
                    deathArr.push({x: idx+1, y: item.death})
                } else {
                    deathArr.push({x: idx+1, y: 0})
                }
            })
        }
    } else
    if (showChinaProvince) {
        if (inputData && inputData.china_province && inputData.china_province.length > 0 && inputData.china_province[0].provinces) {
            inputData.china_province[0].provinces.forEach( (item,idx) => {
                if (idx > 0) {
                    arrLabelY.push(item.name)

                    caseArr.push({x: idx, y: item.case})
                    if (item.death) {
                        deathArr.push({x: idx, y: item.death})
                    }
                }
            })
        }
    } else {
        // Show Other countries
        if (inputData && inputData.data && inputData.data.length > 0 && inputData.data[0].countries) {
            inputData.data[0].countries.forEach( (item,idx) => {
                if (idx > 0) {
                let xDate = new Date(item.date)
                arrLabelY.push(item.name)

                caseArr.push({x: idx, y: item.case})
                deathArr.push({x: idx, y: item.death})
                }
            })
        }
    }

    return {caseArr, deathArr, arrLabelY};
  }

  render() {
    var {caseArr, deathArr, arrLabelY} = this.parseCountriesTop(this.props.appData.ncov, this.props.showChinaProvince, this.props.showVietnamProvince)
    console.log("arrLabelY BAR------------")
    console.log(arrLabelY)
    let theBarWidth = 7;
    if (arrLabelY.length < 10) {
        theBarWidth = 15;
    }
    return (
        <View style={styles.container}>
            <View style={styles.textRow}>
                <Text><H3>
                    {this.props.showChinaProvince ? AppLocales.t("NHOME_HEADER_CHINA_PROVINCES") :
                    (this.props.showVietnamProvince ? AppLocales.t("NHOME_HEADER_VIETNAM_PROVINCES") : AppLocales.t("NHOME_HEADER_COUNTRIES_BAR"))}
                </H3></Text>
                    
            </View>

            <View style={styles.gasUsageContainer}>
                <VictoryChart
                    width={Layout.window.width}
                    height={arrLabelY.length*19 < 200 ? 200 :arrLabelY.length*19 }
                    padding={{top:5,bottom:20,left:70,right:30}}
                    domainPadding={{y: [0, 0], x: [20, 10]}}
                    colorScale={AppConstants.COLOR_SCALE_10}
                >
                <VictoryStack
                    width={Layout.window.width}
                    //domainPadding={{y: [0, 10], x: [20, 10]}}
                    colorScale={AppConstants.COLOR_SCALE_10}
                >
                {/* <VictoryGroup offset={100}
                    colorScale={AppConstants.COLOR_SCALE_10}
                > */}
                    <VictoryBar
                        barWidth={theBarWidth}
                        data={caseArr}
                        horizontal
                        labels={({ datum }) => `${datum.y>0?datum.y:""}`}
                        labelComponent={<VictoryLabel dx={1} style={{fontSize: 9}}/>}
                    />
                    <VictoryBar
                        barWidth={theBarWidth}
                        data={deathArr}
                        horizontal
                        labels={({ datum }) => `${datum.y>0?datum.y:""}`}
                        labelComponent={<VictoryLabel dx={1} style={{fontSize: 9}}/>}
                    />
                </VictoryStack>
                <VictoryAxis
                    crossAxis
                    standalone={false}
                    tickValues={arrLabelY}
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
                <VictoryAxis
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
                />

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
      marginBottom: 10,
      paddingBottom: 10,

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
)(CountryCaseDeathBar);
