import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { View, StyleSheet, Image, TextInput, AsyncStorage, TouchableOpacity } from 'react-native';
import {Container, Header, Title, Segment, Left, Right,Content, Button, Text, Icon, 
    Card, CardItem, Body, H1, H2, H3, ActionSheet, Tab, Tabs, DatePicker, Picker } from 'native-base';
import Layout from '../constants/Layout'

import AppUtils from '../constants/AppUtils'
import AppConstants from '../constants/AppConstants';
import {VictoryLabel, VictoryPie, VictoryBar, VictoryChart, VictoryStack, VictoryArea, VictoryLine, VictoryAxis} from 'victory-native';

import { connect } from 'react-redux';
import AppLocales from '../constants/i18n'
import {NoDataText} from '../components/StyledText';

class HomeMoneyUsageByTime extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        duration: 7,
        durationType: "month", // quarter, year
        activeDisplay: 0, // 0: Km, 1:Money, 2: Money/KM
        tillDate: new Date(),
    };
  }
  onValueChangeDuration(value) {
    this.setState({
        duration: value
    });
    this.displayByFilter = true;
  }

  onValueChangeDurationType(value) {
    this.setState({
        durationType: value
    });
    this.displayByFilter = true;
  }
  // TODO for change Date
  onSetDateOption(newDate) {
    this.setState({
        tillDate: newDate
    });
    this.displayByFilter = true;
  }

  calculateAllVehicleTotalMoney(isMergeData = false) {
    let arrTotalAllCars = [];
    let arrTotalEachCarsAllCategory = [];
    let totalAllCarsAllCategory = 0;
    let tickXLabels = [];
    let objTotalMerge = {};
    let arrTotalMerge = [];

    this.props.userData.vehicleList.forEach(element => {
      if (this.props.userData.carReports && this.props.userData.carReports[element.id]) {
          // TODO* arrTotalMoneySpend is Wrong....
        let {arrTotalMoneySpend} = this.props.userData.carReports[element.id].moneyReport;
        // End date is ENd of This Month  
        var CALCULATE_END_DATE = AppUtils.normalizeFillDate(new Date(this.state.tillDate.getFullYear(),this.state.tillDate.getMonth()+1,0));
        var CALCULATE_START_DATE = AppUtils.normalizeDateBegin(new Date(CALCULATE_END_DATE.getFullYear(), 
            CALCULATE_END_DATE.getMonth() - this.state.duration + 1, 1));

        let filteredArrTotalMoneySpend = [];

        // Only Keep numberOfMonth
        if (arrTotalMoneySpend && arrTotalMoneySpend.length) {
            arrTotalMoneySpend.forEach(item => {
                let xDate = new Date(item.x);
                if (xDate > CALCULATE_START_DATE) {
                    item.x = xDate;
                    filteredArrTotalMoneySpend.push(item)
                    AppUtils.pushInDateLabelsIfNotExist(tickXLabels, new Date(item.x))

                    if (isMergeData) {
                        if (objTotalMerge[""+item.x]) {
                            // exist
                            objTotalMerge[""+item.x]+= item.y;
                        } else {
                            objTotalMerge[""+item.x] = item.y;
                        }
                    }
                }
            })
        }

        arrTotalAllCars.push(filteredArrTotalMoneySpend)
      }
    });

    if (isMergeData) {
        // convert to Array for Chart
        for (var prop in objTotalMerge) {
            if (Object.prototype.hasOwnProperty.call(objTotalMerge, prop)) {
                arrTotalMerge.push({x: new Date(prop), y: objTotalMerge[""+prop]})
            }
        }
    }
    return {arrTotalAllCars, arrTotalMerge, tickXLabels};
  }
  

  render() {
        // Tong Quan of Current User
        var {arrTotalMerge, tickXLabels} 
            = this.calculateAllVehicleTotalMoney(true);
        var tickXLabels = AppUtils.reviseTickLabelsToCount(tickXLabels, 9);

        // If Area Chart, it need 2 Points to DRAW, otherwise Chart will Error
        if (arrTotalMerge && arrTotalMerge.length > 1) {
        return (
            <View style={styles.container}>
                
                <View style={styles.textRow}>
                    <Text><H3>
                        {AppLocales.t("HOME_PRIVATE_MONEY_USAGE")}
                    </H3></Text>
                    
                </View>

                <View style={styles.statRow}>
                    <View style={styles.moneyUsageStackContainer}>
                        <VictoryChart
                            width={Layout.window.width}
                            height={300}
                            padding={{top:10,bottom:30,left:0,right:0}}
                            domainPadding={{y: [10, 40], x: [22, 22]}}
                        >
                        <VictoryArea
                            interpolation="natural"
                            data={arrTotalMerge}
                            style={{
                                data: {
                                    fill: AppConstants.COLOR_D3_MIDDLE_GREEN, fillOpacity: 0.08, 
                                    stroke: AppConstants.COLOR_D3_MIDDLE_GREEN, strokeWidth: 1.5
                                }
                            }}
                            labels={({ datum }) => (datum&&datum.y > 0) ? AppUtils.formatMoneyToK(datum.y) : ""}
                            labelComponent={<VictoryLabel style={{fontSize: 9}}/>}
                            colorScale={AppConstants.COLOR_SCALE_10}
                        />

                        <VictoryAxis
                            crossAxis
                            standalone={false}
                            tickFormat={(t) => `${AppUtils.formatDateMonthYearVN(new Date(t))}`}
                            tickLabelComponent={<VictoryLabel style={{fontSize: 10}}/>}
                            // tickCount={arrKmPerWeek ? arrKmPerWeek.length/2 : 1}
                            tickValues={tickXLabels}
                            style={{
                                // grid: {stroke: "rgb(240,240,240)"},
                                ticks: {stroke: "grey", size: 3},
                                tickLabels: {fontSize: 10, padding: 5, angle: 30}
                            }}
                        />
                        {/* <VictoryAxis
                            dependentAxis
                            standalone={false}
                            tickFormat={(t) => `${AppUtils.formatMoneyToK(t)}`}
                            // tickCount={arrKmPerWeek ? arrKmPerWeek.length/2 : 1}
                            style={{
                                ticks: {stroke: "grey", size: 5},
                                tickLabels: {fontSize: 10, padding: -8,textAnchor:"start"}
                            }}
                        /> */}

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
      paddingBottom: 20
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
        flexGrow: 100
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
)(HomeMoneyUsageByTime);
