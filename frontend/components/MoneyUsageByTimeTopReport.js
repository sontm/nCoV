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
import { NoDataText } from './StyledText';

class MoneyUsageByTimeTopReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        duration: 6,
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

  calculateOneVehicleTotalMoneyPrivate() {
    let arrTotalGasOneCar = [];
    let arrTotalOilOneCar = [];
    let arrTotalAuthOneCar = [];
    let arrTotalExpenseOneCar = [];
    let arrTotalServiceOneCar = [];

    this.props.teamData.teamCarList.forEach((element, carIdx) => {
      if (this.props.teamData.teamCarReports && this.props.teamData.teamCarReports[element.id]) {
        let {arrGasSpend, arrOilSpend, arrAuthSpend, arrExpenseSpend, arrServiceSpend} 
            = this.props.teamData.teamCarReports[element.id].moneyReport;
        let xValue = carIdx + 1;

        let thisCarGasItem = {x: xValue, y: 0};
        if (arrGasSpend && arrGasSpend.length) {
            arrGasSpend.forEach(item => {
                thisCarGasItem.y += item.y;
            })
            arrTotalGasOneCar.push(thisCarGasItem);
        }
        let thisCarOilItem = {x: xValue, y: 0};
        if (arrOilSpend && arrOilSpend.length) {
            arrOilSpend.forEach(item => {
                thisCarOilItem.y += item.y;
            })
            arrTotalOilOneCar.push(thisCarOilItem);
        }
        let thisCarAuthItem = {x: xValue, y: 0};
        if (arrAuthSpend && arrAuthSpend.length) {
            arrAuthSpend.forEach(item => {
                thisCarAuthItem.y += item.y;
            })
            arrTotalAuthOneCar.push(thisCarAuthItem);
        }
        let thisCarExpenseItem = {x: xValue, y: 0};
        if (arrExpenseSpend && arrExpenseSpend.length) {
            arrExpenseSpend.forEach(item => {
                thisCarExpenseItem.y += item.y;
            })
            arrTotalExpenseOneCar.push(thisCarExpenseItem);
        }
        let thisCarServiceItem = {x: xValue, y: 0};
        if (arrServiceSpend && arrServiceSpend.length) {
            arrServiceSpend.forEach(item => {
                thisCarServiceItem.y += item.y;
            })
            arrTotalServiceOneCar.push(thisCarServiceItem);
        }
      }
    });
    return {arrTotalGasOneCar,arrTotalOilOneCar,arrTotalAuthOneCar,
        arrTotalExpenseOneCar, arrTotalServiceOneCar}
  }


  calculateAllVehicleTotalMoney() {
    let arrTotalAllCars = [];
    let arrTotalEachCarsAllCategory = [];
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
                if (xDate >= CALCULATE_START_DATE && xDate <= CALCULATE_END_DATE) {
                    item.x = xDate;
                    filteredArrTotalMoneySpend.push(item)
                }
            })
        }

        arrTotalAllCars.push(filteredArrTotalMoneySpend)
        
        if (filteredArrTotalMoneySpend && filteredArrTotalMoneySpend.length) {
            let totalThisCarMoney = {
                x: ""+element.licensePlate,
                y: 0
            };
            filteredArrTotalMoneySpend.forEach(item => {
                totalThisCarMoney.y += item.y;
            })
            arrTotalEachCarsAllCategory.push(totalThisCarMoney)
        }
      }
    });
    return {arrTotalAllCars, arrTotalEachCarsAllCategory};
  }
  calculateAllVehicleTotalMoneyPercentPrivate() {
    let totalGasSpendPrivate = 0, totalOilSpendPrivate = 0, totalAuthSpendPrivate = 0, 
        totalExpenseSpendPrivate = 0, totalServiceSpendPrivate = 0;
    this.props.userData.vehicleList.forEach(element => {
      if (this.props.userData.carReports && this.props.userData.carReports[element.id]) {
        var {arrGasSpend, arrOilSpend, arrAuthSpend, arrExpenseSpend, arrServiceSpend}
        = this.props.userData.carReports[element.id].moneyReport;
        // End date is ENd of This Month  
        var CALCULATE_END_DATE = AppUtils.normalizeFillDate(new Date(this.state.tillDate.getFullYear(),this.state.tillDate.getMonth()+1,0));
        var CALCULATE_START_DATE = AppUtils.normalizeDateBegin(new Date(CALCULATE_END_DATE.getFullYear(), 
            CALCULATE_END_DATE.getMonth() - this.state.duration + 1, 1));
           
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
        if (arrAuthSpend && arrAuthSpend.length) {
            arrAuthSpend.forEach(item => {
                let xDate = new Date(item.x);
                if (xDate >= CALCULATE_START_DATE && xDate <= CALCULATE_END_DATE) {
                    totalAuthSpendPrivate += item.y;
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
    return {totalGasSpendPrivate,totalOilSpendPrivate,totalAuthSpendPrivate,
        totalExpenseSpendPrivate, totalServiceSpendPrivate};
  }



  calculateAllVehicleTotalMoneyTeam(numberOfMonth) {
    let arrTotalAllCars = [];
    this.props.teamData.teamCarList.forEach(element => {
      if (this.props.teamData.teamCarReports && this.props.teamData.teamCarReports[element.id]) {
        let {arrTotalMoneySpend} = this.props.teamData.teamCarReports[element.id].moneyReport;
        // End date is ENd of This Month  
        var CALCULATE_END_DATE = AppUtils.normalizeFillDate(new Date(this.state.tillDate.getFullYear(),this.state.tillDate.getMonth()+1,0));
        var CALCULATE_START_DATE = AppUtils.normalizeDateBegin(new Date(CALCULATE_END_DATE.getFullYear(), 
            CALCULATE_END_DATE.getMonth() - this.state.duration + 1, 1));

        let filteredArrTotalMoneySpend = [];
        // Only Keep numberOfMonth
        if (arrTotalMoneySpend && arrTotalMoneySpend.length) {
            arrTotalMoneySpend.forEach(item => {
                let xDate = new Date(item.x);
                if (xDate >= CALCULATE_START_DATE && xDate <= CALCULATE_END_DATE) {
                    item.x = xDate;
                    filteredArrTotalMoneySpend.push(item)
                }
            })
        }
        if (filteredArrTotalMoneySpend && filteredArrTotalMoneySpend.length > 0)
            arrTotalAllCars.push(filteredArrTotalMoneySpend)
      }
    });
    return arrTotalAllCars;
  }
  calculateEachVehicleTotalMoneyTeam(numberOfMonth) {
    let arrTotalGasEachCars = [];
    let arrTotalOilEachCars = [];
    let arrTotalAuthEachCars = [];
    let arrTotalExpenseEachCars = [];
    let arrTotalServiceEachCars = [];

    this.props.teamData.teamCarList.forEach((element, carIdx) => {
      if (this.props.teamData.teamCarReports && this.props.teamData.teamCarReports[element.id]) {
        let {arrGasSpend, arrOilSpend, arrAuthSpend, arrExpenseSpend, arrServiceSpend} 
            = this.props.teamData.teamCarReports[element.id].moneyReport;
        let xValue = carIdx + 1;
        //let xValue = element.licensePlate;
        //let xValue = element.licensePlate;
        let thisCarGasItem = {x: xValue, y: 0};
        if (arrGasSpend && arrGasSpend.length) {
            arrGasSpend.forEach(item => {
                thisCarGasItem.y += item.y;
            })
            arrTotalGasEachCars.push(thisCarGasItem);
        }
        let thisCarOilItem = {x: xValue, y: 0};
        if (arrOilSpend && arrOilSpend.length) {
            arrOilSpend.forEach(item => {
                thisCarOilItem.y += item.y;
            })
            arrTotalOilEachCars.push(thisCarOilItem);
        }
        let thisCarAuthItem = {x: xValue, y: 0};
        if (arrAuthSpend && arrAuthSpend.length) {
            arrAuthSpend.forEach(item => {
                thisCarAuthItem.y += item.y;
            })
            arrTotalAuthEachCars.push(thisCarAuthItem);
        }
        let thisCarExpenseItem = {x: xValue, y: 0};
        if (arrExpenseSpend && arrExpenseSpend.length) {
            arrExpenseSpend.forEach(item => {
                thisCarExpenseItem.y += item.y;
            })
            arrTotalExpenseEachCars.push(thisCarExpenseItem);
        }
        let thisCarServiceItem = {x: xValue, y: 0};
        if (arrServiceSpend && arrServiceSpend.length) {
            arrServiceSpend.forEach(item => {
                thisCarServiceItem.y += item.y;
            })
            arrTotalServiceEachCars.push(thisCarServiceItem);
        }
      }
    });
    return {arrTotalGasEachCars,arrTotalOilEachCars,arrTotalAuthEachCars,
        arrTotalExpenseEachCars, arrTotalServiceEachCars}
  }
  render() {
    if (this.props.currentVehicle || this.props.isTotalReport) {
        if (this.props.isTotalReport) {
            if (this.props.isTeamDisplay) {
                var arrTotalAllCars = this.calculateAllVehicleTotalMoneyTeam(6);
                var {arrTotalGasEachCars,arrTotalOilEachCars,arrTotalAuthEachCars,
                    arrTotalExpenseEachCars, arrTotalServiceEachCars}
                    = this.calculateEachVehicleTotalMoneyTeam();
            } else {
                var {arrTotalAllCars, arrTotalEachCarsAllCategory} = this.calculateAllVehicleTotalMoney(6);
                var {totalGasSpendPrivate,totalOilSpendPrivate,totalAuthSpendPrivate,
                    totalExpenseSpendPrivate, totalServiceSpendPrivate}
                    = this.calculateAllVehicleTotalMoneyPercentPrivate();
            }
        } else {
            var {arrTotalGasOneCar,arrTotalOilOneCar,arrTotalAuthOneCar,
                arrTotalExpenseOneCar, arrTotalServiceOneCar}
                = this.calculateOneVehicleTotalMoneyPrivate();
        }
        let isHasData = true;
        if ((this.props.isTotalReport && arrTotalAllCars.length <= 0) || 
            (!arrTotalGasOneCar.length && !arrTotalOilOneCar.length && !arrTotalAuthOneCar.length 
                && !arrTotalExpenseOneCar.length && !arrTotalServiceEachCars.length)) {
            isHasData = false;
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
                        <Picker.Item label="6" value={6} />
                        <Picker.Item label="9" value={9} />
                        <Picker.Item label="12" value={12} />
                        <Picker.Item label="18" value={18} />
                        <Picker.Item label="24" value={24} />
                        <Picker.Item label={AppLocales.t("GENERAL_ALL")} value={240} />
                    </Picker>
                    <Picker
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

                <View style={styles.statRow}>
                    {isHasData ? (
                    <View style={styles.moneyUsageStackContainer}>
                        <VictoryChart
                            width={Layout.window.width}
                            height={300}
                            padding={{top:10,bottom:30,left:50,right:20}}
                        >
                        {/* TODO, Date X axis not Match */}
                        {this.props.isTotalReport ? (
                            <VictoryStack
                                width={Layout.window.width}
                                domainPadding={{y: [0, 10], x: [10, 0]}}
                                colorScale={AppConstants.COLOR_SCALE_10}
                            >
                            {arrTotalAllCars.map((item, idx) => (
                                <VictoryBar
                                key={idx}
                                data={item}
                                />
                            ))}
                            </VictoryStack>
                        ) : (
                        <VictoryStack
                            width={Layout.window.width}
                            domainPadding={{y: [0, 10], x: [10, 0]}}
                            colorScale={AppConstants.COLOR_SCALE_10}
                        >
                            {/* This is FOr One Car in Detail Report */}
                            {arrTotalGasOneCar && arrTotalGasOneCar.length ?
                            <VictoryBar
                                data={arrTotalGasOneCar}
                                interpolation="linear"
                            /> : null}

                            {arrTotalOilOneCar && arrTotalOilOneCar.length ?
                            <VictoryBar
                                data={arrTotalOilOneCar}
                                interpolation="linear"
                            /> : null}

                            {arrTotalAuthOneCar && arrTotalAuthOneCar.length ?
                            <VictoryBar
                                data={arrTotalAuthOneCar}
                                interpolation="linear"
                            /> : null}

                            {arrTotalExpenseOneCar && arrTotalExpenseOneCar.length ?
                            <VictoryBar
                                data={arrTotalExpenseOneCar}
                                interpolation="linear"
                            /> : null}

                            {arrTotalServiceOneCar && arrTotalServiceOneCar.length ?
                            <VictoryBar
                                data={arrTotalServiceOneCar}
                                interpolation="linear"
                            /> : null}
                        
                        </VictoryStack>
                        )}
                        <VictoryAxis
                            crossAxis
                            standalone={false}
                            tickFormat={(t) => `${AppUtils.formatDateMonthYearVN(new Date(t))}`}
                            tickLabelComponent={<VictoryLabel style={{fontSize: 12}}/>}
                            // tickCount={arrKmPerWeek ? arrKmPerWeek.length/2 : 1}
                            style={{
                                // grid: {stroke: "rgb(240,240,240)"},
                                ticks: {stroke: "grey", size: 5},
                                tickLabels: {fontSize: 12, padding: 5, angle: 30}
                            }}
                        />
                        <VictoryAxis
                            dependentAxis
                            standalone={false}
                            tickFormat={(t) => `${AppUtils.formatMoneyToK(t)}`}
                            // tickCount={arrKmPerWeek ? arrKmPerWeek.length/2 : 1}
                            style={{
                                ticks: {stroke: "grey", size: 5},
                                tickLabels: {fontSize: 12, padding: -8,textAnchor:"start"}
                            }}
                        />

                        </VictoryChart>
                    </View>
                    ) : <NoDataText />}
                </View>

                {(this.props.isTotalReport && this.props.isTeamDisplay) ? (
                <View>
                <View style={{...styles.textRow, marginTop: 5}}>
                    <Text><H3>
                    {AppLocales.t("TEAM_REPORT_TOP_CAR_MONEYUSAGE")}
                    </H3></Text>
                </View>

                <View style={styles.statRow}>
                    <View style={styles.moneyUsageStackContainerEachCar}>
                        <VictoryChart
                            width={Layout.window.width}
                            height={300}
                            padding={{top:10,bottom:30,left:50,right:20}}
                        >
                        <VictoryStack
                            width={Layout.window.width}
                            domainPadding={{y: [0, 10], x: [10, 0]}}
                            colorScale={AppConstants.COLOR_SCALE_10}
                        >
                            {arrTotalGasEachCars && arrTotalGasEachCars.length ?
                            <VictoryBar
                                data={arrTotalGasEachCars}
                                interpolation="linear"
                            /> : null}

                            {arrTotalOilEachCars && arrTotalOilEachCars.length ?
                            <VictoryBar
                                data={arrTotalOilEachCars}
                                interpolation="linear"
                            /> : null}

                            {arrTotalAuthEachCars && arrTotalAuthEachCars.length ?
                            <VictoryBar
                                data={arrTotalAuthEachCars}
                                interpolation="linear"
                            /> : null}

                            {arrTotalExpenseEachCars && arrTotalExpenseEachCars.length ?
                            <VictoryBar
                                data={arrTotalExpenseEachCars}
                                interpolation="linear"
                            /> : null}

                            {arrTotalServiceEachCars && arrTotalServiceEachCars.length ?
                            <VictoryBar
                                data={arrTotalServiceEachCars}
                                interpolation="linear"
                            /> : null}
                        
                        </VictoryStack>
                        <VictoryAxis
                            crossAxis
                            standalone={false}
                            tickFormat={(t) => `${(this.props.teamData.teamCarList && this.props.teamData.teamCarList[t-1])? 
                                this.props.teamData.teamCarList[t-1].licensePlate : t}`}
                            tickLabelComponent={<VictoryLabel style={{fontSize: 12}}/>}
                            // tickCount={arrKmPerWeek ? arrKmPerWeek.length/2 : 1}
                            style={{
                                // grid: {stroke: "rgb(240,240,240)"},
                                ticks: {stroke: "grey", size: 5},
                                tickLabels: {fontSize: 12, padding: 5, angle: 30}
                            }}
                        />
                        <VictoryAxis
                            dependentAxis
                            standalone={false}
                            tickFormat={(t) => `${AppUtils.formatMoneyToK(t)}`}
                            // tickCount={arrKmPerWeek ? arrKmPerWeek.length/2 : 1}
                            style={{
                                ticks: {stroke: "grey", size: 5},
                                tickLabels: {fontSize: 12, padding: -8,textAnchor:"start"},
                            }}
                        />
                        </VictoryChart>
                    </View>
                </View>
                </View>
                ) : null }

                {(this.props.isTotalReport && !this.props.isTeamDisplay) ? (
                <View>
                <View style={styles.statRow}>
                    <View style={styles.moneyUsagePieContainer}>
                        <VictoryPie
                            colorScale={AppConstants.COLOR_SCALE_10}
                            data={arrTotalEachCarsAllCategory}
                            innerRadius={80}
                            radius={90}
                            labels={({ datum }) => (datum&&datum.y > 0) ? (datum.x + "\n(" + datum.y/1000 + "K)") : ""}
                            labelRadius={({ radius }) => radius + 10 }
                            labelComponent={<VictoryLabel style={{fontSize: 12}}/>}
                            />
                    </View>
                </View>
                <View style={styles.statRow}>
                    <View style={styles.moneyUsagePieContainer}>
                        <VictoryPie
                            colorScale={AppConstants.COLOR_SCALE_10}
                            data={[
                                { x: AppLocales.t("GENERAL_GAS"), y: totalGasSpendPrivate },
                                { x: AppLocales.t("GENERAL_OIL"), y: totalOilSpendPrivate },
                                { x: AppLocales.t("GENERAL_AUTHROIZE"), y: totalAuthSpendPrivate },
                                { x: AppLocales.t("GENERAL_EXPENSE"), y: totalExpenseSpendPrivate },
                                { x: AppLocales.t("GENERAL_SERVICE"), y: totalServiceSpendPrivate },
                            ]}
                            innerRadius={80}
                            radius={90}
                            labels={({ datum }) => (datum&&datum.y > 0) ? ? (datum.x + "\n(" + datum.y/1000 + "K)") : ""}
                            labelRadius={({ radius }) => radius+10 }
                            labelComponent={<VictoryLabel style={{fontSize: 12}}/>}
                            />
                    </View>
                </View>
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
      //borderWidth: 0.5,
      //borderColor: "grey",
      justifyContent: "space-between",
      marginBottom: 20,
      borderRadius: 7,
      paddingBottom: 20
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


})

const mapStateToProps = (state) => ({
    userData: state.userData,
    teamData: state.teamData
});
const mapActionsToProps = {
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(MoneyUsageByTimeTopReport);
