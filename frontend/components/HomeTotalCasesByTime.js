import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { View, StyleSheet, Image, TextInput, AsyncStorage, TouchableOpacity } from 'react-native';
import {Container, Header, Title, Segment, Left, Right,Content, Button, Text, Icon, 
    Card, CardItem, Body, H1, H2, H3, ActionSheet, Tab, Tabs, DatePicker, Picker } from 'native-base';
import Layout from '../constants/Layout'

import AppUtils from '../constants/AppUtils'
import AppConstants from '../constants/AppConstants';
import {VictoryLabel, VictoryScatter, VictoryBar, VictoryChart, VictoryStack, VictoryArea, VictoryLine, VictoryAxis} from 'victory-native';

import { connect } from 'react-redux';
import AppLocales from '../constants/i18n'
import {NoDataText} from './StyledText';

class HomeTotalCasesByTime extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

//   data: [
//     {
//         date:"2020-01-31 12:45",
//         world: {
//             case: 9929,
//             death: 213,
//         },
//     }]

  // Out
  // [{x,y}]
  parseWorldCurrimulative(inputData) {
    let caseArr = [];
    let deathArr = [];
    let tickXLabels = [];

    if (inputData && inputData.data && inputData.data.length > 0) {
        inputData.data.forEach( item => {
            let xDate = new Date(item.date)
            AppUtils.pushInDateLabelsIfNotExist(tickXLabels, xDate)

            caseArr.push({x: xDate, y: item.world.case})
            deathArr.push({x: xDate, y: item.world.death})
        })
    }

    return {caseArr, deathArr, tickXLabels};
  }
  render() {
        // Tong Quan of Current User
        var {caseArr, deathArr, tickXLabels} 
            = this.parseWorldCurrimulative(AppConstants.NCOV_DATA);
        tickXLabels = AppUtils.reviseTickLabelsToCount(tickXLabels, 9);

        // If Area Chart, it need 2 Points to DRAW, otherwise Chart will Error
        if (caseArr && caseArr.length > 1) {
            console.log("tickXLabels--------")
            console.log(tickXLabels)
        return (
            <View style={styles.container}>
                
                <View style={styles.textRow}>
                    <Text><H3>
                        {AppLocales.t("NHOME_HEADER_TOTAL_CASE_BYTIME")}
                    </H3></Text>
                    
                </View>

                <View style={styles.statRow}>
                    <View style={styles.moneyUsageStackContainer}>
                        <VictoryChart
                            width={Layout.window.width}
                            height={300}
                            padding={{top:10,bottom:30,left:5,right:0}}
                            domainPadding={{y: [10, 40], x: [22, 22]}}
                        >
                        <VictoryLine
                            interpolation="linear"
                            data={caseArr}
                            style={{
                                data: {
                                    //fill: AppConstants.COLOR_D3_MIDDLE_GREEN, fillOpacity: 0.08, 
                                    stroke: AppConstants.COLOR_D3_MIDDLE_GREEN, strokeWidth: 1.5
                                },
                            }}
                            labels={({ datum }) => (datum&&datum.y > 0) ? (datum.y) : ""}
                            labelComponent={<VictoryLabel style={{fontSize: 9}}/>}
                            colorScale={AppConstants.COLOR_SCALE_10}
                        />
                        <VictoryScatter
                            style={{ data: { fill: AppConstants.COLOR_D3_MIDDLE_GREEN } }}
                            size={3}
                            data={caseArr}
                        />

                        <VictoryAxis
                            crossAxis
                            standalone={false}
                            tickFormat={(t) => `${AppUtils.formatDateMonthDayVN(new Date(t))}`}
                            tickLabelComponent={<VictoryLabel style={{fontSize: 10}}/>}
                            // tickCount={arrKmPerWeek ? arrKmPerWeek.length/2 : 1}
                            tickValues={tickXLabels}
                            style={{
                                // grid: {stroke: "rgb(240,240,240)"},
                                ticks: {stroke: "grey", size: 3},
                                tickLabels: {fontSize: 10, padding: 5, angle: 30}
                            }}
                        />
                        <VictoryAxis
                            dependentAxis
                            standalone={false}
                            tickFormat={(t) => `${(t)}`}
                            // tickCount={arrKmPerWeek ? arrKmPerWeek.length/2 : 1}
                            style={{
                                // ticks: {stroke: "grey", size: 5},
                                tickLabels: {fontSize: 10, padding: -8,textAnchor:"start"},
                                grid: {stroke: ({ tick }) => AppConstants.COLOR_GREY_LIGHT_BG},
                            }}
                        />

                        </VictoryChart>
                    </View>
                </View>


                <View style={styles.textRow}>
                    <Text><H3>
                        {AppLocales.t("NHOME_HEADER_TOTAL_DEATH_BYTIME")}
                    </H3></Text>
                    
                </View>

                <View style={styles.statRow}>
                    <View style={styles.moneyUsageStackContainer}>
                        <VictoryChart
                            width={Layout.window.width}
                            height={300}
                            padding={{top:10,bottom:30,left:5,right:0}}
                            domainPadding={{y: [10, 40], x: [22, 22]}}
                        >
                        <VictoryLine
                            interpolation="linear"
                            data={deathArr}
                            style={{
                                data: {
                                    //fill: AppConstants.COLOR_TOMATO, fillOpacity: 0.08, 
                                    stroke: AppConstants.COLOR_TOMATO, strokeWidth: 1.5
                                },
                            }}
                            labels={({ datum }) => (datum&&datum.y > 0) ? (datum.y) : ""}
                            labelComponent={<VictoryLabel style={{fontSize: 9}}/>}
                            colorScale={AppConstants.COLOR_SCALE_10}
                        />
                        <VictoryScatter
                            style={{ data: { fill: AppConstants.COLOR_TOMATO } }}
                            size={3}
                            data={deathArr}
                        />

                        <VictoryAxis
                            crossAxis
                            standalone={false}
                            tickFormat={(t) => `${AppUtils.formatDateMonthDayVN(new Date(t))}`}
                            tickLabelComponent={<VictoryLabel style={{fontSize: 10}}/>}
                            // tickCount={arrKmPerWeek ? arrKmPerWeek.length/2 : 1}
                            tickValues={tickXLabels}
                            style={{
                                // grid: {stroke: "rgb(240,240,240)"},
                                ticks: {stroke: "grey", size: 3},
                                tickLabels: {fontSize: 10, padding: 5, angle: 30}
                            }}
                        />
                        <VictoryAxis
                            dependentAxis
                            standalone={false}
                            tickFormat={(t) => `${(t)}`}
                            // tickCount={arrKmPerWeek ? arrKmPerWeek.length/2 : 1}
                            style={{
                                // ticks: {stroke: "grey", size: 5},
                                tickLabels: {fontSize: 10, padding: -8,textAnchor:"start"},
                                grid: {stroke: ({ tick }) => AppConstants.COLOR_GREY_LIGHT_BG},
                            }}
                        />

                        </VictoryChart>
                    </View>
                </View>
            </View>
        )
        } else {
            return (
                <View style={styles.container}>
                    <View style={styles.textRow}>
                        <Text><H3>
                            {AppLocales.t("HOME_PRIVATE_MONEY_USAGE")}
                        </H3></Text>
                        
                    </View>
                    <NoDataText />
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: "white",
      flexDirection: "column",
      //borderWidth: 0.5,
      //borderColor: "grey",
      justifyContent: "space-between",
      marginBottom: 20,
      //borderRadius: 7,
      paddingBottom: 20,
      marginTop: 10
    },

    segmentContainer: {
        marginRight: 5,
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

    buttonRow: {
        alignSelf: "center",
        marginTop: 30,
        marginBottom: 5
    },

    moneyUsageStackContainer: {
        height: 300,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
    },
    moneyUsageStackContainerEachCar: {
        height: 300,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginBottom: 10
    },

    moneyUsagePieContainer: {
        width: Layout.window.width,
        height: 250,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
    },

    labelProgress: {
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
    },
    labelProgressText: {
        fontSize: 30
    },


})

const mapStateToProps = (state) => ({
    userData: state.userData,
    teamData: state.teamData
});
const mapActionsToProps = {
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(HomeTotalCasesByTime);
