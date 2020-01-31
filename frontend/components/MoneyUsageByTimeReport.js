import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { View, StyleSheet, Image, TextInput, AsyncStorage, TouchableOpacity } from 'react-native';
import {Container, Header, Title, Segment, Left, Right,Content, Button, Text, Icon, 
    Card, CardItem, Body, H1, H2, H3, ActionSheet, Tab, Tabs, DatePicker, Picker } from 'native-base';
import Layout from '../constants/Layout'

import AppUtils from '../constants/AppUtils'
import AppConstants from '../constants/AppConstants';
import {VictoryLabel, VictoryPie, VictoryBar, VictoryChart, VictoryStack, VictoryArea, VictoryContainer, VictoryAxis, VictoryLegend} from 'victory-native';

import { connect } from 'react-redux';
import AppLocales from '../constants/i18n'
import { NoDataText, TypoH5 } from './StyledText';

class MoneyUsageByTimeReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        duration: 6,
        durationType: "month", // quarter, year
        activeDisplay: 0, // 0: Km, 1:Money, 2: Money/KM
        tillDate: new Date(),
        durationTopCarTeam: 6,
        tillDateTopCarTeam: new Date(),
    };
  }
  onValueChangeDuration(value) {
    this.setState({
        duration: value
    });
  }
  onValueChangeDurationTopCarTeam(value) {
    this.setState({
        durationTopCarTeam: value
    });
  }

  

  onValueChangeDurationType(value) {
    this.setState({
        durationType: value
    });
  }
  // TODO for change Date
  onSetDateOption(newDate) {
    this.setState({
        tillDate: newDate
    });
  }
  // TODO for change Date
  onSetDateOptionTopCarTeam(newDate) {
    this.setState({
        tillDateTopCarTeam: newDate
    });
  }

  

  calculateOneVehicleTotalMoneyPrivate(isTeamData) {
    let arrTotalGasOneCar = [];
    let arrTotalOilOneCar = [];
    let arrTotalAuthOneCar = [];
    let arrTotalExpenseOneCar = [];
    let arrTotalServiceOneCar = [];
    let legendLabels = [];
    let tickXLabels = [];
    let theBarWidth = 10;

    // End date is ENd of This Month  
    var CALCULATE_END_DATE = AppUtils.normalizeFillDate(new Date(this.state.tillDate.getFullYear(),this.state.tillDate.getMonth()+1,0));
    var CALCULATE_START_DATE = AppUtils.normalizeDateBegin(new Date(CALCULATE_END_DATE.getFullYear(), 
        CALCULATE_END_DATE.getMonth() - this.state.duration + 1, 1));
    
    for (let d = CALCULATE_START_DATE; d < CALCULATE_END_DATE;) {
        tickXLabels.push(AppUtils.normalizeDateMiddleOfMonth(d))
        d = new Date(d.setMonth(d.getMonth() + 1))
    }

    // Calculate bar Width, Given Chart Width is  100% - 80px; Leave 20% space for Gap
    theBarWidth = ((Layout.window.width - 80) / this.state.duration) * 0.8;
    
    
    // this.props.teamData.teamCarList.forEach((element, carIdx) => {
    //   if (this.props.teamData.teamCarReports && this.props.teamData.teamCarReports[element.id]) {
    //this.props.userData.vehicleList.forEach((element, carIdx) => {
    if (this.props.currentVehicle && this.props.currentVehicle.id &&  
            ((!isTeamData && this.props.userData.carReports[this.props.currentVehicle.id]) || 
            (isTeamData && this.props.teamData.teamCarReports[this.props.currentVehicle.id]))) {
        if(isTeamData) {
            var {arrGasSpend, arrOilSpend, arrAuthSpend, arrExpenseSpend, arrServiceSpend} 
                //= this.props.teamData.teamCarReports[element.id].moneyReport;
             = this.props.teamData.teamCarReports[this.props.currentVehicle.id].moneyReport;
        } else {
            var {arrGasSpend, arrOilSpend, arrAuthSpend, arrExpenseSpend, arrServiceSpend} 
                //= this.props.teamData.teamCarReports[element.id].moneyReport;
                = this.props.userData.carReports[this.props.currentVehicle.id].moneyReport;
        }
        //let xValue = carIdx + 1;
        let xValue = 1;

        if (arrGasSpend && arrGasSpend.length) {
            arrGasSpend.forEach(item => {
                let thisCarGasItem = {x: xValue, y: 0};
                let xDate = new Date(item.x);
                if (xDate >= CALCULATE_START_DATE && xDate <= CALCULATE_END_DATE) {
                    thisCarGasItem.y += item.y;
                    thisCarGasItem.x = xDate;
                    //AppUtils.pushInDateLabelsIfNotExist(tickXLabels, xDate)
                    arrTotalGasOneCar.push(thisCarGasItem);
                }
            })
           if (arrTotalGasOneCar.length > 0) {
            legendLabels.push({name:AppLocales.t("GENERAL_GAS")})
           }
        }
        
        if (arrExpenseSpend && arrExpenseSpend.length) {
            arrExpenseSpend.forEach(item => {
                let xDate = new Date(item.x);
                if (xDate >= CALCULATE_START_DATE && xDate <= CALCULATE_END_DATE) {
                    let thisCarExpenseItem = {x: xValue, y: 0};

                    thisCarExpenseItem.y += item.y;
                    thisCarExpenseItem.x = xDate;
                    //AppUtils.pushInDateLabelsIfNotExist(tickXLabels, xDate)
                    arrTotalExpenseOneCar.push(thisCarExpenseItem);
                }
            })
            if (arrTotalExpenseOneCar.length > 0) {
                legendLabels.push({name:AppLocales.t("GENERAL_EXPENSE")})
            }
        }
        
        if (arrAuthSpend && arrAuthSpend.length) {
            arrAuthSpend.forEach(item => {
                let xDate = new Date(item.x);
                if (xDate >= CALCULATE_START_DATE && xDate <= CALCULATE_END_DATE) {
                    let thisCarAuthItem = {x: xValue, y: 0};
                    thisCarAuthItem.y += item.y;
                    thisCarAuthItem.x = xDate;
                    //AppUtils.pushInDateLabelsIfNotExist(tickXLabels, xDate)
                    arrTotalAuthOneCar.push(thisCarAuthItem);
                }
            })
            if (arrTotalAuthOneCar.length > 0) {
                legendLabels.push({name:AppLocales.t("GENERAL_AUTHROIZE")})
            }
        }

        if (arrServiceSpend && arrServiceSpend.length) {
            arrServiceSpend.forEach(item => {
                let xDate = new Date(item.x);
                if (xDate >= CALCULATE_START_DATE && xDate <= CALCULATE_END_DATE) {
                    let thisCarServiceItem = {x: xValue, y: 0};
                    thisCarServiceItem.y += item.y;
                    thisCarServiceItem.x = xDate;
                    //AppUtils.pushInDateLabelsIfNotExist(tickXLabels, xDate)
                    arrTotalServiceOneCar.push(thisCarServiceItem);
                }
            })
            if (arrTotalServiceOneCar.length > 0) {
                legendLabels.push({name:AppLocales.t("GENERAL_SERVICE")})
            }
        }
    }
    //});
    return {arrTotalGasOneCar,arrTotalAuthOneCar,
        arrTotalExpenseOneCar, arrTotalServiceOneCar, tickXLabels, legendLabels, theBarWidth}
  }


  calculateAllVehicleTotalMoney() {
    let arrTotalAllCars = [];
    let arrTotalEachCarsAllCategory = [];
    let totalAllCarsAllCategory = 0;
    let tickXLabels = [];
    let legendLabels = [];
    let theBarWidth = 10;

    // End date is ENd of This Month  
    var CALCULATE_END_DATE = AppUtils.normalizeFillDate(new Date(this.state.tillDate.getFullYear(),this.state.tillDate.getMonth()+1,0));
    var CALCULATE_START_DATE = AppUtils.normalizeDateBegin(new Date(CALCULATE_END_DATE.getFullYear(), 
        CALCULATE_END_DATE.getMonth() - this.state.duration + 1, 1));

    for (let d = CALCULATE_START_DATE; d < CALCULATE_END_DATE;) {
        tickXLabels.push(AppUtils.normalizeDateMiddleOfMonth(d))
        d = new Date(d.setMonth(d.getMonth() + 1))
    }
    this.props.userData.vehicleList.forEach(element => {
      if (this.props.userData.carReports && this.props.userData.carReports[element.id]) {
          // TODO* arrTotalMoneySpend is Wrong....
        let {arrTotalMoneySpend} = this.props.userData.carReports[element.id].moneyReport;

        let filteredArrTotalMoneySpend = [];


        // Calculate bar Width, Given Chart Width is  100% - 80px; Leave 20% space for Gap
        theBarWidth = ((Layout.window.width - 80) / this.state.duration) * 0.8;

        // Only Keep numberOfMonth
        if (arrTotalMoneySpend && arrTotalMoneySpend.length) {
            arrTotalMoneySpend.forEach(item => {
                let xDate = new Date(item.x);
                if (xDate >= CALCULATE_START_DATE && xDate <= CALCULATE_END_DATE) {
                    item.x = xDate;
                    filteredArrTotalMoneySpend.push(item)
                    //AppUtils.pushInDateLabelsIfNotExist(tickXLabels, new Date(item.x))
                }
            })
        }

        if (filteredArrTotalMoneySpend.length > 0) {
            arrTotalAllCars.push(filteredArrTotalMoneySpend)
            legendLabels.push({name: element.licensePlate})
        }
        
        if (filteredArrTotalMoneySpend && filteredArrTotalMoneySpend.length) {
            let totalThisCarMoney = {
                x: ""+element.licensePlate,
                y: 0
            };
            filteredArrTotalMoneySpend.forEach(item => {
                totalThisCarMoney.y += item.y;
                totalAllCarsAllCategory += item.y;
            })
            arrTotalEachCarsAllCategory.push(totalThisCarMoney)
        }
      }
    });
    return {arrTotalAllCars, arrTotalEachCarsAllCategory, totalAllCarsAllCategory, tickXLabels, legendLabels, theBarWidth};
  }
  calculateAllVehicleTotalMoneyPercentPrivate() {
    let totalGasSpendPrivate = 0, totalOilSpendPrivate = 0, totalAuthSpendPrivate = 0, 
        totalExpenseSpendPrivate = 0, totalServiceSpendPrivate = 0;
    let totalAllSpendPrivate = 0;

    // End date is ENd of This Month  
    var CALCULATE_END_DATE = AppUtils.normalizeFillDate(new Date(this.state.tillDate.getFullYear(),this.state.tillDate.getMonth()+1,0));
    var CALCULATE_START_DATE = AppUtils.normalizeDateBegin(new Date(CALCULATE_END_DATE.getFullYear(), 
        CALCULATE_END_DATE.getMonth() - this.state.duration + 1, 1));
           
                
    this.props.userData.vehicleList.forEach(element => {
      if (this.props.userData.carReports && this.props.userData.carReports[element.id]) {
        var {arrGasSpend, arrOilSpend, arrAuthSpend, arrExpenseSpend, arrServiceSpend}
        = this.props.userData.carReports[element.id].moneyReport;

        // Only Keep numberOfMonth
        if (arrGasSpend && arrGasSpend.length) {
            arrGasSpend.forEach(item => {
                let xDate = new Date(item.x);
                if (xDate >= CALCULATE_START_DATE && xDate <= CALCULATE_END_DATE) {
                    totalGasSpendPrivate += item.y;
                }
            })
        }
        if (arrOilSpend && arrOilSpend.length) {
            arrOilSpend.forEach(item => {
                let xDate = new Date(item.x);
                if (xDate >= CALCULATE_START_DATE && xDate <= CALCULATE_END_DATE) {
                    totalOilSpendPrivate += item.y;
                }
            })
        }
        if (arrExpenseSpend && arrExpenseSpend.length) {
            arrExpenseSpend.forEach(item => {
                let xDate = new Date(item.x);
                if (xDate >= CALCULATE_START_DATE && xDate <= CALCULATE_END_DATE) {
                    totalExpenseSpendPrivate += item.y;
                }
            })
        }

        if (arrAuthSpend && arrAuthSpend.length) {
            arrAuthSpend.forEach(item => {
                let xDate = new Date(item.x);
                if (xDate >= CALCULATE_START_DATE && xDate <= CALCULATE_END_DATE) {
                    totalAuthSpendPrivate += item.y;
                }
            })
        }

        if (arrServiceSpend && arrServiceSpend.length) {
            arrServiceSpend.forEach(item => {
                let xDate = new Date(item.x);
                if (xDate >= CALCULATE_START_DATE && xDate <= CALCULATE_END_DATE) {
                    totalServiceSpendPrivate += item.y;
                }
            })
        }
        }
    })
    totalAllSpendPrivate = totalGasSpendPrivate+totalOilSpendPrivate+totalAuthSpendPrivate
        +totalExpenseSpendPrivate+totalServiceSpendPrivate;
    return {totalGasSpendPrivate,totalOilSpendPrivate,totalAuthSpendPrivate,
        totalExpenseSpendPrivate, totalServiceSpendPrivate, totalAllSpendPrivate};
  }



  calculateAllVehicleTotalMoneyTeam() {
    let arrTotalAllCars = [];
    let tickXLabels = [];
    let legendLabels = [];
    let theBarWidth = 10;

    // Calculate bar Width, Given Chart Width is  100% - 80px; Leave 20% space for Gap
    theBarWidth = ((Layout.window.width - 80) / this.state.duration) * 0.8;
    if (theBarWidth && theBarWidth > 36) {
        theBarWidth = 36;
    }

    let teamNotMerge = false;
    if (this.props.teamData.teamCarList.length > 10) {
        // Will Merge
        teamNotMerge = false;
    } else {
        teamNotMerge = true;
    }
    let objTotalMoneySpend = {};
    // End date is ENd of This Month  
    var CALCULATE_END_DATE = AppUtils.normalizeFillDate(new Date(this.state.tillDate.getFullYear(),this.state.tillDate.getMonth()+1,0));
    var CALCULATE_START_DATE = AppUtils.normalizeDateBegin(new Date(CALCULATE_END_DATE.getFullYear(), 
        CALCULATE_END_DATE.getMonth() - this.state.duration + 1, 1));

    for (let d = CALCULATE_START_DATE; d < CALCULATE_END_DATE;) {
        tickXLabels.push(AppUtils.normalizeDateMiddleOfMonth(d))
        d = new Date(d.setMonth(d.getMonth() + 1))
    }

    this.props.teamData.teamCarList.forEach(element => {
      if (this.props.teamData.teamCarReports && this.props.teamData.teamCarReports[element.id]) {
        let {arrTotalMoneySpend} = this.props.teamData.teamCarReports[element.id].moneyReport;

        if (teamNotMerge) {
            // Not Merge, display for Each Car
            let filteredArrTotalMoneySpend = [];
            // Only Keep numberOfMonth
            if (arrTotalMoneySpend && arrTotalMoneySpend.length) {
                arrTotalMoneySpend.forEach(item => {
                    let xDate = new Date(item.x);
                    if (xDate >= CALCULATE_START_DATE && xDate <= CALCULATE_END_DATE) {
                        item.x = xDate;
                        filteredArrTotalMoneySpend.push(item)
                        //AppUtils.pushInDateLabelsIfNotExist(tickXLabels, xDate)
                    }
                })
            }
            if (filteredArrTotalMoneySpend && filteredArrTotalMoneySpend.length > 0) {
                arrTotalAllCars.push(filteredArrTotalMoneySpend)
                legendLabels.push({name: element.licensePlate})
            }
        } else {
            // WIll Merge
            if (arrTotalMoneySpend && arrTotalMoneySpend.length > 0) {
                arrTotalMoneySpend.forEach(item => {
                    let xDate = new Date(item.x);
                    if (xDate >= CALCULATE_START_DATE && xDate <= CALCULATE_END_DATE) {
                        if (objTotalMoneySpend[""+item.x]) {
                            // exist
                            objTotalMoneySpend[""+item.x]+= item.y;
                        } else {
                            objTotalMoneySpend[""+item.x] = item.y;
                        }
                    }
                })
            }
        }
      }
    });
    if (!teamNotMerge) {
        // convert to Array for Chart
        for (var prop in objTotalMoneySpend) {
            if (Object.prototype.hasOwnProperty.call(objTotalMoneySpend, prop)) {
                arrTotalAllCars.push({x: new Date(prop), y: objTotalMoneySpend[""+prop]})
            }
        }
        arrTotalAllCars.sort(function(a, b) {
            let aDate = new Date(a.x);
            let bDate = new Date(b.x);

            return aDate - bDate;
        })
    }

    return {arrTotalAllCars, tickXLabels, legendLabels, theBarWidth, teamNotMerge};
  }
  calculateEachVehicleTotalMoneyTeam() {
      // {x: indexOfcar in teamcarlist, y: valueMoney}
    let arrTotalGasEachCars = [];
    let arrTotalOilEachCars = [];
    let arrTotalAuthEachCars = [];
    let arrTotalExpenseEachCars = [];
    let arrTotalServiceEachCars = [];

    let arrTotalGasEachCarsTmp = [];
    let arrTotalOilEachCarsTmp = [];
    let arrTotalAuthEachCarsTmp = [];
    let arrTotalExpenseEachCarsTmp = [];
    let arrTotalServiceEachCarsTmp = [];

    let arrTotalAll = [];
    let tickXLabelsIdx =[];
    let theBarWidthTop = 10;

    var CALCULATE_END_DATE = AppUtils.normalizeFillDate(new Date(this.state.tillDateTopCarTeam.getFullYear(),this.state.tillDateTopCarTeam.getMonth()+1,0));
    var CALCULATE_START_DATE = AppUtils.normalizeDateBegin(new Date(CALCULATE_END_DATE.getFullYear(), 
        CALCULATE_END_DATE.getMonth() - this.state.durationTopCarTeam + 1, 1));

    this.props.teamData.teamCarList.forEach((element, carIdx) => {
      if (this.props.teamData.teamCarReports && this.props.teamData.teamCarReports[element.id]) {
        let {arrGasSpend, arrOilSpend, arrAuthSpend, arrExpenseSpend, arrServiceSpend} 
            = this.props.teamData.teamCarReports[element.id].moneyReport;
        let xValue = carIdx + 1;
        //let xValue = element.licensePlate;
        //let xValue = element.licensePlate;
        let thisCarGasItem = {x: xValue, y: 0};
        let totalGas = 0;
        if (arrGasSpend && arrGasSpend.length) {
            arrGasSpend.forEach(item => {
                // TODO Fillter Date
                let xDate = new Date(item.x);
                if (xDate >= CALCULATE_START_DATE && xDate <= CALCULATE_END_DATE) {
                    thisCarGasItem.y += item.y;
                    totalGas += item.y;
                }
            })
        }
        arrTotalGasEachCarsTmp.push(thisCarGasItem);
        // let thisCarOilItem = {x: xValue, y: 0};
        // if (arrOilSpend && arrOilSpend.length) {
        //     arrOilSpend.forEach(item => {
        //         thisCarOilItem.y += item.y;
        //     })
        //     arrTotalOilEachCars.push(thisCarOilItem);
        // }
        let thisCarExpenseItem = {x: xValue, y: 0};
        let totalExpense = 0;
        if (arrExpenseSpend && arrExpenseSpend.length) {
            arrExpenseSpend.forEach(item => {
                let xDate = new Date(item.x);
                if (xDate >= CALCULATE_START_DATE && xDate <= CALCULATE_END_DATE) {
                    thisCarExpenseItem.y += item.y;
                    totalExpense += item.y;
                }
            })
        }
        arrTotalExpenseEachCarsTmp.push(thisCarExpenseItem);
        
        let thisCarAuthItem = {x: xValue, y: 0};
        let totalAuth = 0;
        if (arrAuthSpend && arrAuthSpend.length) {
            arrAuthSpend.forEach(item => {
                let xDate = new Date(item.x);
                if (xDate >= CALCULATE_START_DATE && xDate <= CALCULATE_END_DATE) {
                    thisCarAuthItem.y += item.y;
                    totalAuth += item.y;
                }
            })
        }
        arrTotalAuthEachCarsTmp.push(thisCarAuthItem);

        let thisCarServiceItem = {x: xValue, y: 0};
        let totalService = 0;
        if (arrServiceSpend && arrServiceSpend.length) {
            arrServiceSpend.forEach(item => {
                let xDate = new Date(item.x);
                if (xDate >= CALCULATE_START_DATE && xDate <= CALCULATE_END_DATE) {
                    thisCarServiceItem.y += item.y;
                    totalService += item.y;
                }
            })
        }
        arrTotalServiceEachCarsTmp.push(thisCarServiceItem);

        let totalMoney = totalGas + totalAuth + totalExpense + totalService;
        arrTotalAll.push({x: xValue, y: totalMoney, licensePlate: element.licensePlate})
      }
    });
    // Only Keep first 10 Vehicle
    arrTotalAll.sort(function(a, b) {
        return b.y - a.y;
    })
    let countCar = arrTotalAll.length;
    if (countCar > 10) {
        countCar = 10;
    }
    theBarWidthTop = ((Layout.window.width - 100) / countCar) * 0.8;
    if (theBarWidthTop && theBarWidthTop > 36) {
        theBarWidthTop = 36;
    }
    for (let l = 0; l < countCar; l++) {
        let {x, licensePlate} = arrTotalAll[l];
        tickXLabelsIdx.push(licensePlate)

        arrTotalGasEachCars.push({...arrTotalGasEachCarsTmp.filter(item => {
            return (item.x == x);
        })[0], x: (l+1)})
        arrTotalAuthEachCars.push({...arrTotalAuthEachCarsTmp.filter(item => {
            return (item.x == x);
        })[0], x: (l+1)})

        arrTotalExpenseEachCars.push({...arrTotalExpenseEachCarsTmp.filter(item => {
            return (item.x == x);
        })[0], x: (l+1)})

        arrTotalServiceEachCars.push({...arrTotalServiceEachCarsTmp.filter(item => {
            return (item.x == x);
        })[0], x: (l+1)})
        
    }

    return {arrTotalGasEachCars,arrTotalOilEachCars,arrTotalAuthEachCars,
        arrTotalExpenseEachCars, arrTotalServiceEachCars, tickXLabelsIdx, theBarWidthTop}
  }

  render() {
    if (this.props.currentVehicle || this.props.isTotalReport) {
        if (this.props.isTotalReport) {
            if (this.props.isTeamDisplay) {
                var {arrTotalAllCars, tickXLabels, legendLabels, theBarWidth, teamNotMerge} = this.calculateAllVehicleTotalMoneyTeam();
                var {arrTotalGasEachCars,arrTotalOilEachCars,arrTotalAuthEachCars,
                    arrTotalExpenseEachCars, arrTotalServiceEachCars, tickXLabelsIdx, theBarWidthTop}
                    = this.calculateEachVehicleTotalMoneyTeam();
            } else {
                // Tong Quan of Current User
                var {arrTotalAllCars, arrTotalEachCarsAllCategory, totalAllCarsAllCategory, tickXLabels, legendLabels, theBarWidth} 
                    = this.calculateAllVehicleTotalMoney();
                var {totalGasSpendPrivate,totalOilSpendPrivate,totalAuthSpendPrivate,
                    totalExpenseSpendPrivate, totalServiceSpendPrivate, totalAllSpendPrivate}
                    = this.calculateAllVehicleTotalMoneyPercentPrivate();
            }
        } else {
            // Detail Report each Car
            var {arrTotalGasOneCar,theBarWidth,arrTotalAuthOneCar,
                arrTotalExpenseOneCar, arrTotalServiceOneCar, tickXLabels, legendLabels}
                = this.calculateOneVehicleTotalMoneyPrivate(this.props.isTeamData);
        }
        
        var tickXLabels = AppUtils.reviseTickLabelsToCount(tickXLabels, 9);
        let isHasData = true;
        if ((this.props.isTotalReport && arrTotalAllCars.length <= 0) || 
        (!this.props.isTotalReport && !arrTotalGasOneCar.length && !arrTotalAuthOneCar.length
        && !arrTotalExpenseOneCar.length && !arrTotalServiceOneCar.length) ) {
            isHasData = false;
        }
        let isHasTeamData = true;
        if (this.props.isTotalReport && this.props.isTeamDisplay && !arrTotalGasEachCars.length && !arrTotalOilEachCars.length && !arrTotalAuthEachCars.length &&
            !arrTotalExpenseEachCars.length && !arrTotalServiceEachCars.length) {
            isHasTeamData = false;
        }

        return (
            <View style={styles.container}>
                
                <View style={styles.textRow}>
                    <Text><H3>
                    {this.props.isTotalReport ? 
                            AppLocales.t("HOME_MONEY_SPEND") :
                            AppLocales.t("CARDETAIL_H1_MONEY_USAGE_BYTIME")}
                    </H3></Text>
                </View>

                <View style={styles.textRowOption}>
                    <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" style={{fontSize: 16, color: "grey"}}/>}
                        selectedValue={this.state.duration}
                        onValueChange={this.onValueChangeDuration.bind(this)}
                        textStyle={{ color: "#1f77b4", fontSize: 14 }}
                        style={{width: 75}}
                        >
                        <Picker.Item label="6 Tháng" value={6} />
                        <Picker.Item label="9 Tháng" value={9} />
                        <Picker.Item label="12 Tháng" value={12} />
                        <Picker.Item label="18 Tháng" value={18} />
                        <Picker.Item label="24 Tháng" value={24} />
                        {/* <Picker.Item label={AppLocales.t("GENERAL_ALL")} 
                            value={AppLocales.t("GENERAL_ALL")} /> */}
                    </Picker>
                    <Text style={{fontSize: 13, marginLeft: 5}}>Gần Nhất Đến</Text>
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

                <View style={styles.statRow}>
                    {isHasData ? (
                    <View style={styles.moneyUsageStackContainer}>
                        <VictoryChart
                            width={Layout.window.width}
                            height={250}
                            padding={{top:10,bottom:30,left:3,right:10}}
                            domainPadding={{y: [0, 10], x: [40, 20]}}
                        >
                        {this.props.isTotalReport ? (
                            <VictoryStack
                                width={Layout.window.width}
                                // domainPadding={{y: [0, 10], x: [10, 0]}}
                                colorScale={AppConstants.COLOR_SCALE_10}
                            >
                            {(this.props.isTeamDisplay && !teamNotMerge) ? (
                                <VictoryBar
                                    barWidth={theBarWidth}
                                    data={arrTotalAllCars}
                                />
                            ) : (
                                arrTotalAllCars.map((item, idx) => (
                                    <VictoryBar
                                    barWidth={theBarWidth}
                                    key={idx}
                                    data={item}
                                    />
                                ))
                            )}
                            </VictoryStack>
                        ) : (
                        <VictoryStack
                            width={Layout.window.width}

                            colorScale={AppConstants.COLOR_SCALE_10}
                        >
                            {/* This is FOr One Car in Detail Report */}
                            {arrTotalGasOneCar && arrTotalGasOneCar.length ?
                            <VictoryBar
                                data={arrTotalGasOneCar}
                                barWidth={theBarWidth}
                                interpolation="linear"
                            /> : null}

                            {arrTotalExpenseOneCar && arrTotalExpenseOneCar.length ?
                            <VictoryBar
                                data={arrTotalExpenseOneCar}
                                barWidth={theBarWidth}
                                interpolation="linear"
                            /> : null}

                            {arrTotalAuthOneCar && arrTotalAuthOneCar.length ?
                            <VictoryBar
                                data={arrTotalAuthOneCar}
                                barWidth={theBarWidth}
                                interpolation="linear"
                            /> : null}

                            {arrTotalServiceOneCar && arrTotalServiceOneCar.length ?
                            <VictoryBar
                                data={arrTotalServiceOneCar}
                                barWidth={theBarWidth}
                                interpolation="linear"
                            /> : null}
                        
                        </VictoryStack>
                        )}
                        <VictoryAxis
                            crossAxis
                            standalone={false}
                            tickFormat={(t) => `${AppUtils.formatDateMonthYearVN(new Date(t))}`}
                            tickLabelComponent={<VictoryLabel style={{fontSize: 10}}/>}
                            // tickCount={arrKmPerWeek ? arrKmPerWeek.length/2 : 1}
                            tickValues={tickXLabels}
                            style={{
                                // grid: {stroke: "rgb(240,240,240)"},
                                ticks: {stroke: "grey", size: 5},
                                tickLabels: {fontSize: 10, padding: 5, angle: 30}
                            }}
                        />
                        <VictoryAxis
                            dependentAxis
                            standalone={false}
                            tickFormat={(t) => `${AppUtils.formatMoneyToK(t)}`}
                            // tickCount={arrKmPerWeek ? arrKmPerWeek.length/2 : 1}
                            //offSetX={400}
                            style={{
                                ticks: {stroke: "grey", size: 3},
                                tickLabels: {fontSize: 10, padding: -8,textAnchor:"start"}
                            }}
                        />
                        </VictoryChart>

                        {legendLabels&&legendLabels.length>0 ? 
                        <View>
                            <VictoryContainer
                                width={Layout.window.width}
                                height={35*Math.ceil(legendLabels.length/4)}
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
                    </View> ) : <NoDataText /> }
                </View>

                {(this.props.isTotalReport && this.props.isTeamDisplay) ? (
                <View>
                <View style={{...styles.textRow, marginTop: 5}}>
                    <Text><TypoH5>
                    {AppLocales.t("TEAM_REPORT_TOP_CAR_MONEYUSAGE")+" (" +this.state.durationTopCarTeam+" Tháng)"}
                    </TypoH5></Text>
                </View>

                <View style={styles.textRowOption}>
                    <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" style={{fontSize: 16, color: "grey"}}/>}
                        selectedValue={this.state.durationTopCarTeam}
                        onValueChange={this.onValueChangeDurationTopCarTeam.bind(this)}
                        textStyle={{ color: "#1f77b4", fontSize: 14 }}
                        style={{width: 75}}
                        >
                        <Picker.Item label="6 Tháng" value={6} />
                        <Picker.Item label="9 Tháng" value={9} />
                        <Picker.Item label="12 Tháng" value={12} />
                        <Picker.Item label="18 Tháng" value={18} />
                        <Picker.Item label="24 Tháng" value={24} />
                        <Picker.Item label={AppLocales.t("GENERAL_ALL")} 
                            value={240} />
                    </Picker>
                    <Text style={{fontSize: 13, marginLeft: 5}}>Gần Nhất Đến</Text>
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
                        onDateChange={this.onSetDateOptionTopCarTeam.bind(this)}
                        disabled={false}
                        iosIcon={<Icon name="arrow-down" style={{fontSize: 16, color: "grey"}}/>}
                    />
                </View>

                <View style={styles.statRow}>
                    {isHasTeamData ? (
                    <View style={styles.moneyUsageStackContainerEachCar}>
                        <VictoryChart
                            width={Layout.window.width}
                            height={250}
                            padding={{top:20,bottom:30,left:3,right:10}}
                            domainPadding={{y: [0, 0], x: [60, 20]}}
                        >
                        <VictoryStack
                            width={Layout.window.width}
                            //domainPadding={{y: [0, 10], x: [10, 0]}}
                            colorScale={AppConstants.COLOR_SCALE_10}
                        >
                            {arrTotalGasEachCars && arrTotalGasEachCars.length ?
                            <VictoryBar
                                data={arrTotalGasEachCars}
                                barWidth={theBarWidthTop}
                                interpolation="linear"
                            /> : null}

                            {arrTotalAuthEachCars && arrTotalAuthEachCars.length ?
                            <VictoryBar
                                data={arrTotalAuthEachCars}
                                barWidth={theBarWidthTop}
                                interpolation="linear"
                            /> : null}

                            {arrTotalExpenseEachCars && arrTotalExpenseEachCars.length ?
                            <VictoryBar
                                data={arrTotalExpenseEachCars}
                                barWidth={theBarWidthTop}
                                interpolation="linear"
                            /> : null}

                            {arrTotalServiceEachCars && arrTotalServiceEachCars.length ?
                            <VictoryBar
                                data={arrTotalServiceEachCars}
                                barWidth={theBarWidthTop}
                                interpolation="linear"
                            /> : null}
                        
                        </VictoryStack>
                        <VictoryAxis
                            crossAxis
                            standalone={false}
                            // tickFormat={(t) => `${(this.props.teamData.teamCarList && this.props.teamData.teamCarList[t-1])? 
                            //     this.props.teamData.teamCarList[t-1].licensePlate : t}`}
                            //tickFormat={(t) => t}
                            tickLabelComponent={<VictoryLabel style={{fontSize: 10}}/>}
                            tickValues={tickXLabelsIdx}
                            //tickCount={5}
                            style={{
                                // grid: {stroke: "rgb(240,240,240)"},
                                ticks: {stroke: "grey", size: 5},
                                tickLabels: {fontSize: 10, padding: 5, angle: 30}
                            }}
                        />
                        <VictoryAxis
                            dependentAxis
                            standalone={false}
                            tickFormat={(t) => `${AppUtils.formatMoneyToK(t)}`}
                            // tickCount={arrKmPerWeek ? arrKmPerWeek.length/2 : 1}
                            style={{
                                ticks: {stroke: "grey", size: 5},
                                tickLabels: {fontSize: 10, padding: -8,textAnchor:"start"},
                            }}
                        />
                        </VictoryChart>

                        <View>
                            <VictoryContainer
                                width={Layout.window.width}
                                height={35}
                            >
                            <VictoryLegend standalone={false}
                                x={15} y={5}
                                itemsPerRow={4}
                                colorScale={AppConstants.COLOR_SCALE_10}
                                orientation="horizontal"
                                gutter={5}
                                symbolSpacer={5}
                                labelComponent={<VictoryLabel style={{fontSize: 12}}/>}
                                data={AppConstants.LEGEND_CHITIEU}
                            />
                            </VictoryContainer>
                        </View>
                    </View> ) : <NoDataText />}
                </View>
                </View>
                ) : null }

                {(this.props.isTotalReport && !this.props.isTeamDisplay) ? (
                <View>
                    <View style={{...styles.textRow, marginTop: 5}}>
                    <Text><TypoH5>
                    {AppLocales.t("CARDETAIL_H1_MONEY_USAGE_CARs")+" (" +this.state.duration+" Tháng)"}
                    </TypoH5></Text>
                </View>
                {(arrTotalEachCarsAllCategory&&arrTotalEachCarsAllCategory.length>0) ? (
                <View style={styles.statRow}>
                    <View style={styles.moneyUsagePieContainer}>
                        <View style={{justifyContent: "center",alignItems: "center",alignSelf: "center", height: 250}}>
                        <VictoryPie
                            colorScale={AppConstants.COLOR_SCALE_10}
                            data={arrTotalEachCarsAllCategory}
                            innerRadius={80}
                            radius={90}
                            labels={({ datum }) => (datum&&datum.y > 0) ? (
                                AppUtils.formatMoneyToK(datum.y) + "\n"
                                +AppUtils.formatToPercent(datum.y, totalAllCarsAllCategory)) : ""}
                            labelRadius={({ radius }) => radius + 10 }
                            labelComponent={<VictoryLabel style={{fontSize: 12}}/>}
                            />
                        <View style={styles.labelProgress}>
                            <Text style={styles.labelProgressText}>
                                {AppUtils.formatMoneyToK(totalAllCarsAllCategory)}
                            </Text>
                        </View>
                        </View>

                        <View>
                            <VictoryContainer
                                width={Layout.window.width}
                                height={35*Math.ceil(legendLabels.length/4)}
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
                        </View>
                    </View>
                </View>
                ) : <NoDataText /> }

                <View style={{...styles.textRow, marginTop: 5}}>
                    <Text><TypoH5>
                    {AppLocales.t("CARDETAIL_H1_MONEY_USAGE")+" (" +this.state.duration+" Tháng)"}
                    </TypoH5></Text>
                </View>
                {(totalAllSpendPrivate>0) ? (
                <View style={styles.statRow}>
                    <View style={{...styles.moneyUsagePieContainer, height: 270}}>
                        <VictoryPie
                            colorScale={AppConstants.COLOR_SCALE_10}
                            data={[
                                { x: AppLocales.t("GENERAL_GAS"), y: totalGasSpendPrivate },
                                { x: AppLocales.t("GENERAL_EXPENSE"), y: totalExpenseSpendPrivate },
                                { x: AppLocales.t("GENERAL_AUTHROIZE"), y: totalAuthSpendPrivate },
                                { x: AppLocales.t("GENERAL_SERVICE"), y: totalServiceSpendPrivate },
                            ]}
                            innerRadius={80}
                            radius={90}
                            labels={({ datum }) => (datum&&datum.y > 0) ? (
                                AppUtils.formatMoneyToK(datum.y) + "\n"
                                +AppUtils.formatToPercent(datum.y, totalAllSpendPrivate)) : ""}
                            labelRadius={({ radius }) => radius+10 }
                            labelComponent={<VictoryLabel style={{fontSize: 12}}/>}
                        />
                        <View style={styles.labelProgress}>
                            <Text style={styles.labelProgressText}>
                                {AppUtils.formatMoneyToK(totalAllSpendPrivate)}
                            </Text>
                        </View>
                    </View>

                    <View>
                        <VictoryContainer
                            width={Layout.window.width}
                            height={30*Math.ceil(AppConstants.LEGEND_CHITIEU_2.length/2)}
                        >
                        <VictoryLegend standalone={false}
                            x={15} y={5}
                            itemsPerRow={4}
                            colorScale={AppConstants.COLOR_SCALE_10}
                            orientation="horizontal"
                            gutter={5}
                            symbolSpacer={5}
                            labelComponent={<VictoryLabel style={{fontSize: 12}}/>}
                            data={AppConstants.LEGEND_CHITIEU_2}
                            style={{paddingBottom: 10}}
                        />
                        </VictoryContainer>
                    </View>
                    
                </View>
                ) : <NoDataText /> }
                </View>
                ) : null}
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
      //borderWidth: 0.3,
      //borderColor: "grey",
      justifyContent: "space-between",
      marginBottom: 20,
    //   borderRadius: 7,
      paddingBottom: 15
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
        //height: 400,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
    },
    moneyUsageStackContainerEachCar: {
        //height: 280,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginBottom: 10
    },

    moneyUsagePieContainer: {
        width: Layout.window.width,
        //height: 250,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginBottom: 30
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
)(MoneyUsageByTimeReport);
