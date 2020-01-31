import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { View, StyleSheet, Image, TextInput, AsyncStorage, TouchableOpacity } from 'react-native';
import {Container, Header, Title, Segment, Left, Right,Content, Button, Text, Icon, 
    Card, CardItem, Body, H1, H2, H3, ActionSheet, Tab, Tabs, Picker, Form, DatePicker, Toast } from 'native-base';
import Layout from '../constants/Layout'
import { connect } from 'react-redux';
import AppUtils from '../constants/AppUtils'
import AppConstants from '../constants/AppConstants';
import {VictoryLabel, VictoryPie, VictoryBar, VictoryChart, VictoryStack, VictoryArea, VictoryLine, VictoryAxis} from 'victory-native';
// import { LineChart, Grid } from 'react-native-svg-charts'

import AppLocales from '../constants/i18n'

import {
    LineChart
  } from "react-native-chart-kit";
import { NoDataText, TypoH5 } from './StyledText';

const MYDATA = [ 50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80 ]

function durationTypeToVietnamese(durationType) {
    if (durationType == "month") {
        return "Tháng";
    } else if (durationType == "quarter") {
        return "Quý";
    } else if (durationType == "year") {
        return "Năm";
    }
}
class GasUsageTopReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        duration: 6,
        durationType: "month", // quarter, year
        activeDisplay: 0, // 0: Km, 1:Money, 2: Money/KM
        tillDate: new Date(),
    };

    this.displayByFilter = false;
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
  calculateEachVehicleGasUsageTeam() {
    let arrGasKmEachCars = [];
    let arrGasMoneyEachCars = [];
    let arrGasMoneyPerKmEachCars = [];

    let arrGasKmEachCarsTmp = [];
    let arrGasMoneyEachCarsTmp = [];
    let arrGasMoneyPerKmEachCarsTmp = [];

    let arrTotalKm = [];
    let theBarWidthKm = 10;
    let tickXLabelsKm = [];

    let arrTotalMoney = [];
    let theBarWidthMoney = 10;
    let tickXLabelsMoney = [];

    let arrTotalMoneyPerKm = [];
    let theBarWidthMoneyPerKm = 10;
    let tickXLabelsMoneyPerKm = [];

    var CALCULATE_END_DATE = AppUtils.normalizeFillDate(new Date(this.state.tillDate.getFullYear(),this.state.tillDate.getMonth()+1,0));
    var CALCULATE_START_DATE = AppUtils.normalizeDateBegin(new Date(CALCULATE_END_DATE.getFullYear(), 
        CALCULATE_END_DATE.getMonth() - this.state.duration + 1, 1));

    this.props.teamData.teamCarList.forEach((element, carIdx) => {
      if (this.props.teamData.teamCarReports && this.props.teamData.teamCarReports[element.id]) {
        var {averageKmPerLiter, averageMoneyPerLiter, averageMoneyPerDay, averageKmPerDay, averageMoneyPerKmPerDay, lastDate, lastKm,
          arrMoneyPerWeek, arrKmPerWeek, totalMoneyGas, arrTotalKmMonthly, arrTotalMoneyMonthly, arrTotalMoneyPerKmMonthly,
          avgKmMonthly, avgMoneyMonthly, avgMoneyPerKmMonthly}
          = this.props.teamData.teamCarReports[element.id].gasReport;

        let xValue = carIdx + 1;
        //let xValue = element.licensePlate;
        let thisKm = {x: xValue, y: 0};
        if (arrTotalKmMonthly && arrTotalKmMonthly.length) {
            arrTotalKmMonthly.forEach(item => {
                let xDate = new Date(item.x);
                if (xDate >= CALCULATE_START_DATE && xDate <= CALCULATE_END_DATE) {
                    thisKm.y += item.y;
                }
            })
            if (thisKm.y > 0) {
                arrGasKmEachCarsTmp.push(thisKm);
                arrTotalKm.push({x: xValue, y: thisKm.y, licensePlate: element.licensePlate})
            }
        }
        

        let thisMoney = {x: xValue, y: 0};
        if (arrTotalMoneyMonthly && arrTotalMoneyMonthly.length) {
            arrTotalMoneyMonthly.forEach(item => {
                let xDate = new Date(item.x);
                if (xDate >= CALCULATE_START_DATE && xDate <= CALCULATE_END_DATE) {
                    thisMoney.y += item.y;
                }
            })
            if (thisMoney.y > 0) {
                arrGasMoneyEachCarsTmp.push(thisMoney);
                arrTotalMoney.push({x: xValue, y: thisMoney.y, licensePlate: element.licensePlate})
            }
        }
        


        let thisMoneyPerKm = {x: xValue, y: 0};
        if (arrTotalMoneyPerKmMonthly && arrTotalMoneyPerKmMonthly.length) {
            let countAvg = 0;
            arrTotalMoneyPerKmMonthly.forEach(item => {
                let xDate = new Date(item.x);
                if (xDate >= CALCULATE_START_DATE && xDate <= CALCULATE_END_DATE) {
                    thisMoneyPerKm.y += item.y;
                    countAvg++;
                }
            })
            if (thisMoneyPerKm.y > 0) {
                thisMoneyPerKm.y = thisMoneyPerKm.y/countAvg;
                arrGasMoneyPerKmEachCarsTmp.push(thisMoneyPerKm);
                arrTotalMoneyPerKm.push({x: xValue, y: thisMoneyPerKm.y, licensePlate: element.licensePlate})
            }
        }
        
      }
    })

    // Only Keep first 10 Vehicle
    arrTotalKm.sort(function(a, b) {return b.y - a.y;})
    let countKm = arrTotalKm.length;
    if (countKm > 10) {countKm = 10;}
    theBarWidthKm = ((Layout.window.width - 100) / countKm) * 0.8;
    if (theBarWidthKm && theBarWidthKm > 36) {theBarWidthKm = 36;}
    for (let l = 0; l < countKm; l++) {
        let {x, licensePlate} = arrTotalKm[l];
        tickXLabelsKm.push(licensePlate)
        arrGasKmEachCars.push({...arrGasKmEachCarsTmp.filter(item => {
            return (item.x == x);
        })[0], x: (l+1)})
    }

    arrTotalMoney.sort(function(a, b) {return b.y - a.y;})
    let countMoney = arrTotalMoney.length;
    if (countMoney > 10) {countMoney = 10;}
    theBarWidthMoney = ((Layout.window.width - 100) / countMoney) * 0.8;
    if (theBarWidthMoney && theBarWidthMoney > 36) {theBarWidthMoney = 36;}
    for (let l = 0; l < countMoney; l++) {
        let {x, licensePlate} = arrTotalMoney[l];
        tickXLabelsMoney.push(licensePlate)
        arrGasMoneyEachCars.push({...arrGasMoneyEachCarsTmp.filter(item => {
            return (item.x == x);
        })[0], x: (l+1)})
    }

    arrTotalMoneyPerKm.sort(function(a, b) {return b.y - a.y;})
    let countMoneyPerKm = arrTotalMoneyPerKm.length;
    if (countMoneyPerKm > 10) {countMoneyPerKm = 10;}
    theBarWidthMoneyPerKm = ((Layout.window.width - 100) / countMoneyPerKm) * 0.8;
    if (theBarWidthMoneyPerKm && theBarWidthMoneyPerKm > 36) {theBarWidthMoneyPerKm = 36;}
    for (let l = 0; l < countMoneyPerKm; l++) {
        let {x, licensePlate} = arrTotalMoneyPerKm[l];
        tickXLabelsMoneyPerKm.push(licensePlate)
        arrGasMoneyPerKmEachCars.push({...arrGasMoneyPerKmEachCarsTmp.filter(item => {
            return (item.x == x);
        })[0], x: (l+1)})
    }

    return {arrGasKmEachCars, arrGasMoneyEachCars, arrGasMoneyPerKmEachCars, 
        theBarWidthKm, tickXLabelsKm,theBarWidthMoney,tickXLabelsMoney,theBarWidthMoneyPerKm,tickXLabelsMoneyPerKm};
  }

  render() {
    //isTotalReport mean this is used in Home screen or Team screen
    if (this.props.isTotalReport) {
        if (this.props.isTeamDisplay) {
            var {arrGasKmEachCars, arrGasMoneyEachCars, arrGasMoneyPerKmEachCars, 
                theBarWidthKm, tickXLabelsKm,theBarWidthMoney,tickXLabelsMoney,theBarWidthMoneyPerKm,tickXLabelsMoneyPerKm}
                = this.calculateEachVehicleGasUsageTeam();
        }
        if (this.state.activeDisplay == 1) {
            var dataTopToDisplay = arrGasMoneyEachCars;
            var theBarWidth = theBarWidthMoney;
            var tickXLabels = tickXLabelsMoney;
        } else if (this.state.activeDisplay == 2) {
            var dataTopToDisplay = arrGasMoneyPerKmEachCars;
            var theBarWidth = theBarWidthMoneyPerKm;
            var tickXLabels = tickXLabelsMoneyPerKm;
        } else {
            var dataTopToDisplay = arrGasKmEachCars;
            var theBarWidth = theBarWidthKm;
            var tickXLabels = tickXLabelsKm;
        }
        let arrLabelY = ["Km", "đ", "đ/Km"];
        return (
            <View style={styles.container}>
                <View style={styles.textRow}>
                    <Text><TypoH5>
                        {this.state.activeDisplay == 1 ? 
                            AppLocales.t("TEAM_REPORT_TOP_CAR_GASUSAGE_MONEY") :
                        (this.state.activeDisplay == 2 ?  
                            AppLocales.t("TEAM_REPORT_TOP_CAR_GASUSAGE_MONEYKM") :
                            AppLocales.t("TEAM_REPORT_TOP_CAR_GASUSAGE_KM"))}
                    </TypoH5></Text>
                    <Segment small style={{backgroundColor:"rgba(0,0,0,0)"}}>
                        <Button small first onPress={() => this.setState({activeDisplay: 0})}
                            style={this.state.activeDisplay === 0 ? styles.activeSegment : styles.inActiveSegment}>
                            <Text style={this.state.activeDisplay === 0 ? styles.activeSegmentText : styles.inActiveSegmentText}>Km</Text></Button>
                        <Button small onPress={() => this.setState({activeDisplay: 1})}
                            style={this.state.activeDisplay === 1 ? styles.activeSegment : styles.inActiveSegment}>
                            <Text style={this.state.activeDisplay === 1 ? styles.activeSegmentText : styles.inActiveSegmentText}>đ</Text>
                        </Button>
                        {/* <Button small last onPress={() => this.setState({activeDisplay: 2})}
                            style={this.state.activeDisplay === 2 ? styles.activeSegment : styles.inActiveSegment}>
                            <Text style={this.state.activeDisplay === 2 ? styles.activeSegmentText : styles.inActiveSegmentText}>đ/Km</Text></Button> */}
                    </Segment>
                </View>
                <View style={styles.textRowOption}>
                    <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" style={{fontSize: 16, color: "grey"}}/>}
                        selectedValue={this.state.duration}
                        onValueChange={this.onValueChangeDuration.bind(this)}
                        textStyle={{ color: "#1f77b4", fontSize: 14 }}
                        // style={{width: 75}}
                        >
                        <Picker.Item label="6 Tháng" value={6} />
                        <Picker.Item label="9 Tháng" value={9} />
                        <Picker.Item label="12 Tháng" value={12} />
                        <Picker.Item label="18 Tháng" value={18} />
                        <Picker.Item label="24 Tháng" value={24} />
                        <Picker.Item label={AppLocales.t("GENERAL_ALL")} value={240} />
                    </Picker>
                    <Text style={{fontSize: 13, marginLeft: 10}}>Gần Nhất Đến</Text>
                    <DatePicker
                        defaultDate={new Date()}
                        minimumDate={new Date(2010, 1, 1)}
                        maximumDate={new Date(2100, 12, 31)}
                        locale={"vi"}
                        timeZoneOffsetInMinutes={undefined}
                        modalTransparent={false}
                        animationType={"fade"}
                        androidMode={"default"}
                        placeHolderText={"Hôm Nay"}
                        textStyle={{ color: "#1f77b4", fontSize: 14 }}
                        placeHolderTextStyle={{ color: "#1f77b4" }}
                        onDateChange={this.onSetDateOption.bind(this)}
                        disabled={false}
                        iosIcon={<Icon name="arrow-down" style={{fontSize: 16, color: "grey"}}/>}
                    />
                </View>
                    
                {dataTopToDisplay.length > 0 ? (
                <View style={styles.gasUsageContainer}>
                    <VictoryChart
                        width={Layout.window.width}
                        height={300}
                        padding={{top:25,bottom:40,left:3,right:10}}
                        domainPadding={{y: [0, 0], x: [50, 20]}}
                    >
                    <VictoryStack
                        width={Layout.window.width}
                        //domainPadding={{y: [0, 10], x: [20, 10]}}
                        colorScale={AppConstants.COLOR_SCALE_10}
                    >
                        <VictoryBar
                            barWidth={theBarWidth}
                            data={dataTopToDisplay}
                        />
                    </VictoryStack>
                    <VictoryAxis
                        crossAxis
                        standalone={false}
                        //tickFormat={(t,idx) => `${AppUtils.formatDateMonthYearVN(t)}`}
                        tickLabelComponent={<VictoryLabel style={{fontSize: 10}}/>}
                        // tickCount={arrKmPerWeek ? arrKmPerWeek.length/2 : 1}
                        tickValues={tickXLabels}
                        style={{
                            // grid: {stroke: "rgb(240,240,240)"},
                            ticks: {stroke: "grey", size: 5},
                            tickLabels: {fontSize: 10,padding: 5, angle: 30}
                        }}
                    />
                    <VictoryAxis
                        dependentAxis
                        standalone={false}
                        label={arrLabelY[this.state.activeDisplay]}
                        axisLabelComponent={<VictoryLabel dy={40} dx={120} style={{fontSize: 11}}/>}
                        tickFormat={(t) => `${this.state.activeDisplay!= 0 ? AppUtils.formatMoneyToK(t) :
                            AppUtils.formatDistanceToKm(t)}`}
                        // tickCount={arrKmPerWeek ? arrKmPerWeek.length/2 : 1}
                        style={{
                            ticks: {stroke: "grey", size: 5},
                            tickLabels: {fontSize: 10, padding: -8,textAnchor:"start"}
                        }}
                    />

                    </VictoryChart>
                </View> ) : <NoDataText />}
            </View>
        )} else {
            return null;
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
      paddingBottom: 20,
    //   borderRadius: 7,
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
        height: 320,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
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
)(GasUsageTopReport);
