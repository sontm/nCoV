import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { View, StyleSheet, Image, TextInput, AsyncStorage, TouchableOpacity } from 'react-native';
import {Container, Header, Title, Segment, Left, Right,Content, Button, Text, Icon, 
    Card, CardItem, Body, H1, H2, H3, ActionSheet, Tab, Tabs, Picker, Form, DatePicker, Toast } from 'native-base';
import Layout from '../constants/Layout'
import { connect } from 'react-redux';
import AppUtils from '../constants/AppUtils'
import AppConstants from '../constants/AppConstants';
import {VictoryLabel, VictoryPie, VictoryBar, VictoryChart, VictoryStack, VictoryContainer, VictoryLegend, VictoryAxis} from 'victory-native';
import {TypoH5} from '../components/StyledText';
// import { LineChart, Grid } from 'react-native-svg-charts'

import AppLocales from '../constants/i18n'

import {
    LineChart
  } from "react-native-chart-kit";
import { NoDataText } from './StyledText';

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
class GasUsageReport extends React.Component {
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
    AppUtils.CONSOLE_LOG(newDate)
    this.setState({
        tillDate: newDate
    });
    this.displayByFilter = true;
  }
  onDataPointClick(value, dataset, getcolor, dataToDisplay) {
      Toast.show({
        text: "" + AppUtils.formatDateMonthYearVN(dataToDisplay[value.index].x) + ": " + 
            dataToDisplay[value.index].y.toFixed(0),
        //buttonText: "Okay",
        position: "top",
        type: "danger"
      })
  }

  // Used in Detail report
  calculateOneVehicleGasUsage(isTeamData) {
    let arrGasKmThisCar = [];
    let arrGasMoneyThisCar = [];
    let arrGasMoneyPerKmThisCar = [];
    let tickXLabels = [];
    let theBarWidth = 10;

    if (this.props.currentVehicle && this.props.currentVehicle.id && 
        ((isTeamData && this.props.teamData.teamCarReports[this.props.currentVehicle.id]) || (!isTeamData && this.props.userData.carReports[this.props.currentVehicle.id]))) {
        if (isTeamData) {
            var {arrTotalKmMonthly, arrTotalMoneyMonthly, arrTotalMoneyPerKmMonthly}
                = this.props.teamData.teamCarReports[this.props.currentVehicle.id].gasReport;    
        } else {
            var {arrTotalKmMonthly, arrTotalMoneyMonthly, arrTotalMoneyPerKmMonthly}
                = this.props.userData.carReports[this.props.currentVehicle.id].gasReport;    
        }
        // End date is ENd of PREVIOUS MONTH Month  
        var CALCULATE_END_DATE = AppUtils.normalizeFillDate(new Date(this.state.tillDate.getFullYear(),this.state.tillDate.getMonth(),0));
        var CALCULATE_START_DATE = AppUtils.normalizeDateBegin(new Date(CALCULATE_END_DATE.getFullYear(), 
            CALCULATE_END_DATE.getMonth() - this.state.duration + 1, 1));

        for (let d = CALCULATE_START_DATE; d < CALCULATE_END_DATE;) {
            tickXLabels.push(AppUtils.normalizeDateMiddleOfMonth(d))
            d = new Date(d.setMonth(d.getMonth() + 1))
        }

        // Calculate bar Width, Given Chart Width is  100% - 80px; Leave 20% space for Gap
        theBarWidth = ((Layout.window.width - 80) / this.state.duration) * 0.8;

        if (arrTotalKmMonthly && arrTotalKmMonthly.length > 0) {
            arrTotalKmMonthly.forEach((item, idx) => {
                let xDate = new Date(item.x);
                if (xDate >= CALCULATE_START_DATE && xDate <= CALCULATE_END_DATE) {
                    //item.x = idx;
                    //item.xDate = xDate;
                    item.x = xDate;
                    arrGasKmThisCar.push(item)
                    //AppUtils.pushInDateLabelsIfNotExist(tickXLabels, xDate)
                }
            })
        }
        
        if (arrTotalMoneyMonthly && arrTotalMoneyMonthly.length > 0) {
            arrTotalMoneyMonthly.forEach(item => {
                let xDate = new Date(item.x);
                if (xDate >= CALCULATE_START_DATE && xDate <= CALCULATE_END_DATE) {
                    item.x = xDate;
                    arrGasMoneyThisCar.push(item)
                }
            })
        }

        if (arrTotalMoneyPerKmMonthly && arrTotalMoneyPerKmMonthly.length > 0) {
            arrTotalMoneyPerKmMonthly.forEach(item => {
                let xDate = new Date(item.x);
                if (xDate >= CALCULATE_START_DATE && xDate <= CALCULATE_END_DATE) {
                    item.x = xDate;
                    arrGasMoneyPerKmThisCar.push(item)
                }
            })
        }
    }
    return {arrGasKmThisCar, arrGasMoneyThisCar, arrGasMoneyPerKmThisCar, tickXLabels, theBarWidth};
  }


  calculateAllVehicleGasUsage() {
    let arrGasKmAllCars = [];
    let arrGasMoneyAllCars = [];
    let arrGasMoneyPerKmAllCars = [];
    let tickXLabels = [];
    let theBarWidth = 10;
    let legendLabels = [];

    this.props.userData.vehicleList.forEach(element => {
      if (this.props.userData.carReports && this.props.userData.carReports[element.id]) {

        var {arrTotalKmMonthly, arrTotalMoneyMonthly, arrTotalMoneyPerKmMonthly}
          = this.props.userData.carReports[element.id].gasReport;

        // End date is ENd of PREVIOUS Month , Gas of Last month is not Correct
        var CALCULATE_END_DATE = AppUtils.normalizeFillDate(new Date(this.state.tillDate.getFullYear(),this.state.tillDate.getMonth(),0));
        var CALCULATE_START_DATE = AppUtils.normalizeDateBegin(new Date(CALCULATE_END_DATE.getFullYear(), 
            CALCULATE_END_DATE.getMonth() - this.state.duration + 1, 1));

        for (let d = CALCULATE_START_DATE; d < CALCULATE_END_DATE;) {
            tickXLabels.push(AppUtils.normalizeDateMiddleOfMonth(d))
            d = new Date(d.setMonth(d.getMonth() + 1))
        }

        // Calculate bar Width, Given Chart Width is  100% - 80px; Leave 20% space for Gap
        theBarWidth = ((Layout.window.width - 80) / this.state.duration) * 0.8;

        if (arrTotalKmMonthly && arrTotalKmMonthly.length > 0) {
            let filterArr = [];
            arrTotalKmMonthly.forEach(item => {
                let xDate = new Date(item.x);
                if (xDate >= CALCULATE_START_DATE && xDate <= CALCULATE_END_DATE) {
                    item.x = xDate;
                    filterArr.push(item)
                    //AppUtils.pushInDateLabelsIfNotExist(tickXLabels, xDate)
                }
            })
            if (filterArr.length > 0) {
                arrGasKmAllCars.push(filterArr)
                legendLabels.push({name: element.licensePlate})
            }
        }
        
        if (arrTotalMoneyMonthly && arrTotalMoneyMonthly.length > 0) {
            let filterArr = [];
            arrTotalMoneyMonthly.forEach(item => {
                let xDate = new Date(item.x);
                if (xDate >= CALCULATE_START_DATE && xDate <= CALCULATE_END_DATE) {
                    item.x = xDate;
                    filterArr.push(item)
                }
            })
            if (filterArr.length > 0)
                arrGasMoneyAllCars.push(filterArr)
        }

        if (arrTotalMoneyPerKmMonthly && arrTotalMoneyPerKmMonthly.length > 0) {
            let filterArr = [];
            arrTotalMoneyPerKmMonthly.forEach(item => {
                let xDate = new Date(item.x);
                if (xDate >= CALCULATE_START_DATE && xDate <= CALCULATE_END_DATE) {
                    item.x = xDate;
                    filterArr.push(item)
                }
            })
            if (filterArr.length > 0)
                arrGasMoneyPerKmAllCars.push(filterArr)
        }
      }
    })
    return {arrGasKmAllCars, arrGasMoneyAllCars, arrGasMoneyPerKmAllCars, tickXLabels, theBarWidth, legendLabels};
  }

  calculateAllVehicleGasUsageTeam(isMergeData = true) {
    let arrGasKmAllCars = [];
    let arrGasMoneyAllCars = [];
    let arrGasMoneyPerKmAllCars = [];

    let objGasKmAllCars = {};
    let objGasMoneyAllCars = {};
    let objGasMoneyPerKmAllCars = {};
    let tickXLabels = [];
    let theBarWidth = 10;
    let legendLabels = [];

    let avgKmMonthly = 0;
    let avgMoneyMonthly = 0;
    let avgMoneyPerKmMonthly = 0;
    let sum1 = 0;
    let count1 = 0;
    let sum2 = 0;
    let count2 = 0;
    let sum3 = 0;
    let count3 = 0;

    let teamNotMerge = false;
    if (this.props.teamData.teamCarList.length > 10) {
        isMergeData = true;
        teamNotMerge = false;
    } else {
        isMergeData = false;
        teamNotMerge = true;
    }
    this.props.teamData.teamCarList.forEach(element => {
      if (this.props.teamData.teamCarReports && this.props.teamData.teamCarReports[element.id]) {
        // End date is ENd of PREVIOUS Month  
        var CALCULATE_END_DATE = AppUtils.normalizeFillDate(new Date(this.state.tillDate.getFullYear(),this.state.tillDate.getMonth(),0));
        var CALCULATE_START_DATE = AppUtils.normalizeDateBegin(new Date(CALCULATE_END_DATE.getFullYear(), 
            CALCULATE_END_DATE.getMonth() - this.state.duration + 1, 1));

        for (let d = CALCULATE_START_DATE; d < CALCULATE_END_DATE;) {
            tickXLabels.push(AppUtils.normalizeDateMiddleOfMonth(d))
            d = new Date(d.setMonth(d.getMonth() + 1))
        }

        // Calculate bar Width, Given Chart Width is  100% - 80px; Leave 20% space for Gap
        theBarWidth = ((Layout.window.width - 80) / this.state.duration) * 0.8;

        var {arrTotalKmMonthly, arrTotalMoneyMonthly, arrTotalMoneyPerKmMonthly}
          = this.props.teamData.teamCarReports[element.id].gasReport;

        // let dataChartKitLine = AppUtils.convertVictoryDataToChartkitData(arrTotalKmMonthly,
        //   (t) => `${AppUtils.formatDateMonthYearVN(new Date(t))}`)
        
        // arrGasAllCars.push(dataChartKitLine)
        if (isMergeData) {
            
            if (arrTotalKmMonthly && arrTotalKmMonthly.length > 0) {
                arrTotalKmMonthly.forEach(item => {
                    let xDate = new Date(item.x);
                    if (xDate >= CALCULATE_START_DATE && xDate <= CALCULATE_END_DATE) {
                        if (objGasKmAllCars[""+item.x]) {
                            // exist
                            objGasKmAllCars[""+item.x]+= item.y;
                        } else {
                            objGasKmAllCars[""+item.x] = item.y;
                        }
                        if (item.y > 0) {
                            sum1 += item.y;
                        }
                        count1++;
                        //AppUtils.pushInDateLabelsIfNotExist(tickXLabels, new Date(item.x))
                    }
                })
            }
        } else {
            if (arrTotalKmMonthly && arrTotalKmMonthly.length > 0) {
                let filterArr = [];
                arrTotalKmMonthly.forEach(item => {
                    let xDate = new Date(item.x);
                    if (xDate >= CALCULATE_START_DATE && xDate <= CALCULATE_END_DATE) {
                        item.x = xDate;
                        filterArr.push(item)
                       //AppUtils.pushInDateLabelsIfNotExist(tickXLabels, xDate)
                    }
                })

                if (filterArr.length>0) {
                    arrGasKmAllCars.push(filterArr)
                    legendLabels.push({name: element.licensePlate})
                }
            }
        }

        if (isMergeData) {
            if (arrTotalMoneyMonthly && arrTotalMoneyMonthly.length > 0) {
                arrTotalMoneyMonthly.forEach(item => {
                    let xDate = new Date(item.x);
                    if (xDate >= CALCULATE_START_DATE && xDate <= CALCULATE_END_DATE) {
                        if (objGasMoneyAllCars[""+item.x]) {
                            // exist
                            objGasMoneyAllCars[""+item.x]+= item.y;
                        } else {
                            objGasMoneyAllCars[""+item.x] = item.y;
                        }
                        if (item.y > 0) {
                            sum2 += item.y;
                        }
                        count2++;
                    }
                })
            }
        } else {
            if (arrTotalMoneyMonthly && arrTotalMoneyMonthly.length > 0) {
                let filterArr = [];
                arrTotalMoneyMonthly.forEach(item => {
                    let xDate = new Date(item.x);
                    if (xDate >= CALCULATE_START_DATE && xDate <= CALCULATE_END_DATE) {
                        item.x = xDate;
                        filterArr.push(item)
                    }
                })
                if (filterArr.length>0)
                    arrGasMoneyAllCars.push(filterArr)
            }
        }

        if (isMergeData) {
            if (arrTotalMoneyPerKmMonthly && arrTotalMoneyPerKmMonthly.length > 0) {
                arrTotalMoneyPerKmMonthly.forEach(item => {
                    let xDate = new Date(item.x);
                    if (xDate >= CALCULATE_START_DATE && xDate <= CALCULATE_END_DATE) {
                        if (objGasMoneyPerKmAllCars[""+item.x]) {
                            // exist
                            objGasMoneyPerKmAllCars[""+item.x]+= item.y;
                        } else {
                            objGasMoneyPerKmAllCars[""+item.x] = item.y;
                        }
                        if (item.y > 0) {
                            sum3 += item.y;
                        }
                        count3++;
                    }
                })
            }
        } else {
            if (arrTotalMoneyPerKmMonthly && arrTotalMoneyPerKmMonthly.length > 0) {
                let filterArr = [];
                arrTotalMoneyPerKmMonthly.forEach(item => {
                    let xDate = new Date(item.x);
                    if (xDate >= CALCULATE_START_DATE && xDate <= CALCULATE_END_DATE) {
                        item.x = xDate;
                        filterArr.push(item)
                    }
                })
                if (filterArr.length>0)
                    arrGasMoneyPerKmAllCars.push(filterArr)
            }
        }
      }
    })

    if (isMergeData) {
        // convert to Array for Chart
        for (var prop in objGasKmAllCars) {
            if (Object.prototype.hasOwnProperty.call(objGasKmAllCars, prop)) {
                arrGasKmAllCars.push({x: new Date(prop), y: objGasKmAllCars[""+prop]})
            }
        }
        for (var prop in objGasMoneyAllCars) {
            if (Object.prototype.hasOwnProperty.call(objGasMoneyAllCars, prop)) {
                arrGasMoneyAllCars.push({x: new Date(prop), y: objGasMoneyAllCars[""+prop]})
            }
        }
        for (var prop in objGasMoneyPerKmAllCars) {
            if (Object.prototype.hasOwnProperty.call(objGasMoneyPerKmAllCars, prop)) {
                arrGasMoneyPerKmAllCars.push({x: new Date(prop), y: objGasMoneyPerKmAllCars[""+prop]})
            }
        }
        arrGasKmAllCars.sort(function(a, b) {
            let aDate = new Date(a.x);
            let bDate = new Date(b.x);
            return aDate - bDate;
        })
        arrGasMoneyAllCars.sort(function(a, b) {
            let aDate = new Date(a.x);
            let bDate = new Date(b.x);
            return aDate - bDate;
        })
        arrGasMoneyPerKmAllCars.sort(function(a, b) {
            let aDate = new Date(a.x);
            let bDate = new Date(b.x);
            return aDate - bDate;
        })
        
        avgKmMonthly = sum1/count1;
        avgMoneyMonthly = sum2/count2;
        avgMoneyPerKmMonthly = sum3/count3;
    } 

    return {arrGasKmAllCars, arrGasMoneyAllCars, arrGasMoneyPerKmAllCars, tickXLabels, theBarWidth, legendLabels, teamNotMerge,
        avgKmMonthly, avgMoneyMonthly, avgMoneyPerKmMonthly};
  }

  render() {
    AppUtils.CONSOLE_LOG("GasUsageReport Render:" + AppConstants.CURRENT_VEHICLE_ID)
    //isTotalReport mean this is used in Home screen or Team screen
    if (this.props.currentVehicle || this.props.isTotalReport) { //props
        if (this.props.isTotalReport) {
            if (this.props.isTeamDisplay) {
                var {arrGasKmAllCars, arrGasMoneyAllCars, arrGasMoneyPerKmAllCars, tickXLabels, theBarWidth, legendLabels, 
                    teamNotMerge, avgKmMonthly, avgMoneyMonthly, avgMoneyPerKmMonthly} 
                = this.calculateAllVehicleGasUsageTeam();
                if (teamNotMerge) {
                    var avgKmMonthly = AppUtils.calculateAverageOfArray(arrGasKmAllCars, 2).avg;
                    var avgMoneyMonthly = AppUtils.calculateAverageOfArray(arrGasMoneyAllCars, 2).avg;
                    var avgMoneyPerKmMonthly = avgMoneyMonthly/avgKmMonthly;
                    //var avgMoneyPerKmMonthly = AppUtils.calculateAverageOfArray(arrGasMoneyPerKmAllCars, 2).avg;
                }
            } else {
                // Individual All Cars
                var {arrGasKmAllCars, arrGasMoneyAllCars, arrGasMoneyPerKmAllCars, tickXLabels, theBarWidth, legendLabels} = 
                    this.calculateAllVehicleGasUsage();
                var avgKmMonthly = AppUtils.calculateAverageOfArray(arrGasKmAllCars, 2).avg;
                var avgMoneyMonthly = AppUtils.calculateAverageOfArray(arrGasMoneyAllCars, 2).avg;
                //var avgMoneyPerKmMonthly = AppUtils.calculateAverageOfArray(arrGasMoneyPerKmAllCars, 2).avg;
                // Use Simple Formular
                var avgMoneyPerKmMonthly = avgMoneyMonthly/avgKmMonthly;
            }
            
            if (this.state.activeDisplay == 1) {
                var dataToDisplay = arrGasMoneyAllCars;
            } else if (this.state.activeDisplay == 2) {
                var dataToDisplay = arrGasMoneyPerKmAllCars;
            } else {
                var dataToDisplay = arrGasKmAllCars;
            }
            var tickXLabels = AppUtils.reviseTickLabelsToCount(tickXLabels, 9);
        } else {
            // this is One Vehicle in Detail Report
            var {arrGasKmThisCar, arrGasMoneyThisCar, arrGasMoneyPerKmThisCar, tickXLabels, theBarWidth} =
                this.calculateOneVehicleGasUsage(this.props.isTeamData);
            if (this.state.activeDisplay == 1) {
                var dataToDisplay = arrGasMoneyThisCar;
            } else if (this.state.activeDisplay == 2) {
                var dataToDisplay = arrGasMoneyPerKmThisCar;
            } else {
                var dataToDisplay = arrGasKmThisCar;
            }

            var avgKmMonthly = AppUtils.calculateAverageOfArray(arrGasKmThisCar, 1).avg;
            var avgMoneyMonthly = AppUtils.calculateAverageOfArray(arrGasMoneyThisCar, 1).avg;
            //var avgMoneyPerKmMonthly = AppUtils.calculateAverageOfArray(arrGasMoneyPerKmThisCar, 1).avg;
            var avgMoneyPerKmMonthly = avgMoneyMonthly/avgKmMonthly;
            
            var tickXLabels = AppUtils.reviseTickLabelsToCount(tickXLabels, 9);
            AppUtils.CONSOLE_LOG("avgMoneyMonthly:" + avgMoneyMonthly)
            AppUtils.CONSOLE_LOG("avgKmMonthly:" + avgKmMonthly)
            AppUtils.CONSOLE_LOG("avgMoneyPerKmMonthly:" + avgMoneyPerKmMonthly)
        }
        if (theBarWidth && theBarWidth > 36) {
            theBarWidth = 36;
        }

        // } else {
        //     if (this.state.activeDisplay == 1) {
        //         var dataToDisplay = this.props.userData.carReports[this.props.currentVehicle.id].gasReport.arrTotalMoneyMonthly;
        //     } else if (this.state.activeDisplay == 2) {
        //         var dataToDisplay = this.props.userData.carReports[this.props.currentVehicle.id].gasReport.arrTotalMoneyPerKmMonthly;
        //     } else {
        //         var dataToDisplay = this.props.userData.carReports[this.props.currentVehicle.id].gasReport.arrTotalKmMonthly;
        //     }
        // }
        if (!AppConstants.TEMPO_USE_BARCHART_GAS) {
            let dataChartKitLine = AppUtils.convertVictoryDataToChartkitData(dataToDisplay,
                (t) => `${AppUtils.formatDateMonthYearVN(new Date(t))}`)
        }

        // const mydata = {
        //     labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        //     datasets: [{
        //       data: [ 20, 45, 28, 80, 99, 43 ],
        //       color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        //       strokeWidth: 2 // optional
        //     }]
        // }
        let arrLabelY = ["Km", "đ", "đ/Km"];
        AppUtils.CONSOLE_LOG(arrLabelY[this.state.activeDisplay])
        return (
            <View style={styles.container}>
                <View style={styles.textRow}>
                    <Text><H3>
                        {this.props.isTotalReport ? 
                            AppLocales.t("HOME_GAS_USAGE") :
                            AppLocales.t("CARDETAIL_H1_GAS_USAGE")}
                    </H3></Text>
                    <Segment small style={{backgroundColor:"rgba(0,0,0,0)"}}>
                        <Button small first onPress={() => this.setState({activeDisplay: 0})}
                            style={this.state.activeDisplay === 0 ? styles.activeSegment : styles.inActiveSegment}>
                            <Text style={this.state.activeDisplay === 0 ? styles.activeSegmentText : styles.inActiveSegmentText}>Km</Text></Button>
                        <Button small  onPress={() => this.setState({activeDisplay: 1})}
                            style={this.state.activeDisplay === 1 ? styles.activeSegment : styles.inActiveSegment}>
                            <Text style={this.state.activeDisplay === 1 ? styles.activeSegmentText : styles.inActiveSegmentText}>đ</Text></Button>
                        {/* <Button small last  onPress={() => this.setState({activeDisplay: 2})}
                            style={this.state.activeDisplay === 2 ? styles.activeSegment : styles.inActiveSegment}>
                            <Text style={this.state.activeDisplay === 2 ? styles.activeSegmentText : styles.inActiveSegmentText}>đ/Km</Text></Button> */}
                    </Segment>
                </View>
                {this.props.appData.countOpen < 10 ?
                <Text style={{flexDirection:"row", fontSize: 14, fontStyle: "italic", 
                    justifyContent: "center", textAlign:"center", flexWrap:"wrap"}}>(Cần có ít nhất 2 lần đổ xăng để có dữ liệu.)</Text>
                : null}

                <View style={styles.textRowOption}>
                    <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" style={{fontSize: 16, color: "grey"}}/>}
                        selectedValue={this.state.duration}
                        onValueChange={this.onValueChangeDuration.bind(this)}
                        textStyle={{ color: "#1f77b4", fontSize: 14 }}
                        // style={{width: 50}}
                        >
                        <Picker.Item label="6 Tháng" value={6} />
                        <Picker.Item label="9 Tháng" value={9} />
                        <Picker.Item label="12 Tháng" value={12} />
                        <Picker.Item label="18 Tháng" value={18} />
                        <Picker.Item label="24 Tháng" value={24} />
                        {/* <Picker.Item label={AppLocales.t("GENERAL_ALL")} value={AppLocales.t("GENERAL_ALL")} /> */}
                    </Picker>
                    {/* <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" style={{fontSize: 16, color: "grey"}}/>}
                        selectedValue={this.state.durationType}
                        onValueChange={this.onValueChangeDurationType.bind(this)}
                        textStyle={{ color: "#1f77b4", fontSize: 14 }}
                        style={{width: 75}}
                        >
                        <Picker.Item label="Tháng" value="month" />
                        <Picker.Item label="Quý" value="quarter" />
                        <Picker.Item label="Năm" value="year" />
                    </Picker> */}
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

                {dataToDisplay.length > 0 ? (
                    <View style={styles.gasUsageContainer}>
                        <VictoryChart
                            width={Layout.window.width}
                            height={265}
                            padding={{top:25,bottom:40,left:3,right:10}}
                            domainPadding={{y: [0, 10], x: [50, 20]}}
                        >
                        {/* TODO, Date X axis not Match */}
                        <VictoryStack
                            width={Layout.window.width}
                            // domainPadding={{y: [0, 0], x: [0, 0]}}
                            colorScale={AppConstants.COLOR_SCALE_10}
                        >
                        {(this.props.isTotalReport && (!this.props.isTeamDisplay || teamNotMerge)) ? (
                            dataToDisplay.map((item, idx) => ( // Individual All Cars
                                <VictoryBar
                                key={idx}
                                barWidth={theBarWidth}
                                data={item}
                                />
                            ))
                        ) : (
                            <VictoryBar
                                data={dataToDisplay}
                                barWidth={theBarWidth}
                            />
                        )}
                        </VictoryStack>
                        <VictoryAxis
                            crossAxis
                            standalone={false}
                            // tickFormat={(t,idx) => `${AppUtils.formatDateMonthYearVN(
                            //     (dataToDisplay[idx]&&dataToDisplay[idx].xDate) ? dataToDisplay[idx].xDate : new Date())}`}
                            tickLabelComponent={<VictoryLabel style={{fontSize: 10}}/>}
                            tickFormat={(t,idx) => `${AppUtils.formatDateMonthYearVN(t)}`}
                            // tickCount={arrKmPerWeek ? arrKmPerWeek.length/2 : 1}
                            //tickCount={dataToDisplay.length}
                            tickValues={tickXLabels}
                            style={{
                                // grid: {stroke: "rgb(240,240,240)"},
                                ticks: {stroke: "grey", size: 5},
                                tickLabels: {fontSize: 10,padding: 5, angle: 30}
                            }}
                        />
                        <VictoryAxis
                            dependentAxis
                            label={arrLabelY[this.state.activeDisplay]}
                            axisLabelComponent={<VictoryLabel dy={40} dx={110} style={{fontSize: 11}}/>}
                            standalone={false}
                            tickFormat={(t) => `${this.state.activeDisplay!= 0 ? AppUtils.formatMoneyToK(t) :
                                AppUtils.formatDistanceToKm(t)}`}
                            // tickCount={arrKmPerWeek ? arrKmPerWeek.length/2 : 1}
                            style={{
                                ticks: {stroke: "grey", size: 5},
                                tickLabels: {fontSize: 10, padding: -8,textAnchor:"start"}
                            }}
                        />

                        </VictoryChart>

                        {(legendLabels&&legendLabels.length>0) ?
                        <View>
                            <VictoryContainer
                                width={Layout.window.width}
                                height={40*Math.ceil(legendLabels.length/4)}
                            >
                            <VictoryLegend standalone={false}
                                x={15} y={5}
                                itemsPerRow={4}
                                colorScale={AppConstants.COLOR_SCALE_10}
                                orientation="horizontal"
                                gutter={5}
                                symbolSpacer={5}
                                labelComponent={<VictoryLabel style={{fontSize: 12}}/>}
                                data={legendLabels}
                            />
                            </VictoryContainer>
                        </View> : null}
                    </View>
                ) : <NoDataText />}

                {/* {dataToDisplay.length > 0 ? ( */}
                {/* <View style={styles.gasUsageContainer}>
                    {dataChartKitLine.labels.length > 0 ? (
                    <LineChart
                        data={dataChartKitLine}
                        width={Layout.window.width}
                        height={300}
                        withDots={true}
                        withInnerLines={false}
                        onDataPointClick={(value, dataset, getcolor) => {
                            this.onDataPointClick(value, dataset, getcolor, dataToDisplay)
                        }}
                        verticalLabelRotation={45}
                        chartConfig={{
                            backgroundGradientFrom: "#03528a",
                            backgroundGradientFromOpacity: 1,
                            backgroundGradientTo: "#52038a",
                            backgroundGradientToOpacity: 1,
                            fillShadowGradient:"#dddddd",
                            fillShadowGradientOpacity: 0.2,
                            // color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            color: (opacity = 1) => `rgba(255, 255, 255, 1)`,
                            strokeWidth: 2, // optional, default 3
                            barPercentage: 0.9
                        }}
                    />) : (null)
                    }
                </View> */}
                {/* ) : <NoDataText />} */}

                {this.state.duration != AppLocales.t("GENERAL_ALL") ? (
                <View>
                <View style={{...styles.textRow, paddingTop: 0}}>
                    <TypoH5>
                    {AppLocales.t("CARDETAIL_AVERAGE_IN")}{this.state.duration + " " + durationTypeToVietnamese(this.state.durationType)}
                    </TypoH5>
                </View>
                <View style={styles.statRow}>
                    <Card style={styles.equalStartRow}>
                        <CardItem>
                        <Body>
                            <Text><H3>{avgKmMonthly ? 
                                avgKmMonthly.toFixed(0) : "-"}</H3></Text>
                            <Text style={{fontSize: 14, color: AppConstants.COLOR_TEXT_LIGHT_INFO, marginTop: 10}}>
                            Km/{AppLocales.t("GENERAL_MONTH")}
                            </Text>
                        </Body>
                        </CardItem>
                    </Card>

                    <Card style={styles.equalStartRow}>
                        <CardItem>
                        <Body>
                            <Text><H3>{avgMoneyMonthly ?
                             (avgMoneyMonthly).toFixed(0): "-"}</H3></Text>
                            <Text style={{fontSize: 14, color: AppConstants.COLOR_TEXT_LIGHT_INFO, marginTop: 10}}>đ/{AppLocales.t("GENERAL_MONTH")}</Text>
                        </Body>
                        </CardItem>
                    </Card>

                    <Card style={styles.equalStartRow}>
                        <CardItem>
                        <Body>
                            <Text><H3>{avgMoneyPerKmMonthly ?
                             (avgMoneyPerKmMonthly).toFixed(0) : "-"}</H3></Text>
                            <Text style={{fontSize: 14, color: AppConstants.COLOR_TEXT_LIGHT_INFO, marginTop: 10}}>đ/Km</Text>
                        </Body>
                        </CardItem>
                    </Card>
                </View>
                </View>
                ): null}
                
            </View>
        )
    } else {
        return (
            <Container>
            <Content>
            <View style={styles.container}>

            </View>
            </Content>
            </Container>
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

    gasUsageContainer: {
        width: "96%",
        //height: 350,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
    },

})

const mapStateToProps = (state) => ({
    userData: state.userData,
    teamData: state.teamData,
    appData: state.appData
});
const mapActionsToProps = {
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(GasUsageReport);
