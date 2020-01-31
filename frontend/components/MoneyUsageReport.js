import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { View, StyleSheet, Image, TextInput, AsyncStorage, TouchableOpacity } from 'react-native';
import {Container, Header, Title, Segment, Left, Right,Content, Button, Text, Icon, 
    Card, CardItem, Body, H1, H2, H3, ActionSheet, Tab, Tabs, DatePicker, Picker } from 'native-base';
import Layout from '../constants/Layout'

import AppUtils from '../constants/AppUtils'
import AppConstants from '../constants/AppConstants';
import {VictoryLabel, VictoryPie, VictoryLegend, VictoryChart, VictoryStack, VictoryArea, VictoryLine, VictoryContainer} from 'victory-native';

import { connect } from 'react-redux';
import AppLocales from '../constants/i18n'
import { NoDataText, TypoH4, TypoH6, TypoH5 } from './StyledText';

class MoneyUsageReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        duration: 6,
        tillDate: new Date(),
    };
  }
  onValueChangeDuration(value) {
    this.setState({
        duration: value
    });
  }

  // TODO for change Date
  onSetDateOption(newDate) {
    this.setState({
        tillDate: newDate
    });
  }
  
  calculateAllVehicleTotalMoneyPercentTeam(numberOfMonth) {
    let totalGasSpendTeam = 0, totalOilSpendTeam = 0, totalAuthSpendTeam = 0, 
        totalExpenseSpendTeam = 0, totalServiceSpendTeam = 0;
    this.props.teamData.teamCarList.forEach(element => {
      if (this.props.teamData.teamCarReports && this.props.teamData.teamCarReports[element.id]) {
        let {arrGasSpend, arrOilSpend, arrAuthSpend, arrExpenseSpend, arrServiceSpend} 
            = this.props.teamData.teamCarReports[element.id].moneyReport;
        // End date is ENd of This Month  
        var CALCULATE_END_DATE = AppUtils.normalizeFillDate(new Date(this.state.tillDate.getFullYear(),this.state.tillDate.getMonth()+1,0));
        var CALCULATE_START_DATE = AppUtils.normalizeDateBegin(new Date(CALCULATE_END_DATE.getFullYear(), 
            CALCULATE_END_DATE.getMonth() - this.state.duration + 1, 1));
           
            
        // Only Keep numberOfMonth
        if (arrGasSpend && arrGasSpend.length) {
            arrGasSpend.forEach(item => {
                let xDate = new Date(item.x);
                if (xDate >= CALCULATE_START_DATE && xDate <= CALCULATE_END_DATE) {
                    totalGasSpendTeam += item.y;
                }
            })
        }
        if (arrOilSpend && arrOilSpend.length) {
            arrOilSpend.forEach(item => {
                let xDate = new Date(item.x);
                if (xDate >= CALCULATE_START_DATE && xDate <= CALCULATE_END_DATE) {
                    totalOilSpendTeam += item.y;
                }
            })
        }
        if (arrExpenseSpend && arrExpenseSpend.length) {
            arrExpenseSpend.forEach(item => {
                let xDate = new Date(item.x);
                if (xDate >= CALCULATE_START_DATE && xDate <= CALCULATE_END_DATE) {
                    totalExpenseSpendTeam += item.y;
                }
            })
        }
        if (arrAuthSpend && arrAuthSpend.length) {
            arrAuthSpend.forEach(item => {
                let xDate = new Date(item.x);
                if (xDate >= CALCULATE_START_DATE && xDate <= CALCULATE_END_DATE) {
                    totalAuthSpendTeam += item.y;
                }
            })
        }

        if (arrServiceSpend && arrServiceSpend.length) {
            arrServiceSpend.forEach(item => {
                let xDate = new Date(item.x);
                if (xDate >= CALCULATE_START_DATE && xDate <= CALCULATE_END_DATE) {
                    totalServiceSpendTeam += item.y;
                }
            })
        }
      }
    });
    return {totalGasSpendTeam,totalOilSpendTeam,totalAuthSpendTeam,
        totalExpenseSpendTeam, totalServiceSpendTeam};
  }

  calculateAllVehicleTotalMoneyPercentPrivate(isTeamData) {
    let totalGasSpendPrivate = 0, totalOilSpendPrivate = 0, totalAuthSpendPrivate = 0, 
        totalExpenseSpendPrivate = 0, totalServiceSpendPrivate = 0;
    if (this.props.currentVehicle && this.props.currentVehicle.id && 
        ((!isTeamData && this.props.userData.carReports[this.props.currentVehicle.id]) || 
        (isTeamData && this.props.teamData.teamCarReports[this.props.currentVehicle.id]))) {
        if (isTeamData) {
            var {arrGasSpend, arrOilSpend, arrAuthSpend, arrExpenseSpend, arrServiceSpend}
                = this.props.teamData.teamCarReports[this.props.currentVehicle.id].moneyReport; 
        } else {
        var {arrGasSpend, arrOilSpend, arrAuthSpend, arrExpenseSpend, arrServiceSpend}
            = this.props.userData.carReports[this.props.currentVehicle.id].moneyReport;   
        } 
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
    return {totalGasSpendPrivate,totalOilSpendPrivate,totalAuthSpendPrivate,
        totalExpenseSpendPrivate, totalServiceSpendPrivate};
  }



  //arrExpenseTypeByTime: [{"TienPhat": [{x: 2019-03-03, y: 200(K)}, {x: 2019-04-03, y: 100(K)}]}]
  calculateExpenseTypeFromArr(arrExpenseTypeByTime) {
    let arrSubExpenseSpend = []; // [{x:"tienPhat", y: 200}]
    let legendLabels = [];
    let totalSubExpenseSpend = 0;
    if (arrExpenseTypeByTime && arrExpenseTypeByTime.length > 0) {
  
        // End date is ENd of This Month  
        var CALCULATE_END_DATE = AppUtils.normalizeFillDate(new Date(this.state.tillDate.getFullYear(),this.state.tillDate.getMonth()+1,0));
        var CALCULATE_START_DATE = AppUtils.normalizeDateBegin(new Date(CALCULATE_END_DATE.getFullYear(), 
            CALCULATE_END_DATE.getMonth() - this.state.duration + 1, 1));
           
        
        arrExpenseTypeByTime.forEach(item => {
            for (var prop in item) {
                if (Object.prototype.hasOwnProperty.call(item, prop)) {
                    let arrSub = item[""+prop];
                    // Only Keep numberOfMonth
                    let yVal = 0;
                    if (arrSub && arrSub.length) {
                        arrSub.forEach(e => {
                            let xDate = new Date(e.x);
                            if (xDate >= CALCULATE_START_DATE && xDate <= CALCULATE_END_DATE) {
                                yVal += e.y;
                            }
                        })
                    }
                    if (yVal) {
                        arrSubExpenseSpend.push({x: prop, y: yVal})
                        legendLabels.push({name: prop})
                        totalSubExpenseSpend += yVal;
                    }
                }
            }
        })
        
    }
    return {arrSubExpenseSpend,totalSubExpenseSpend, legendLabels};
  }

  //arrExpenseTypeByTime: [{"TienPhat": [{x: 2019-03-03, y: 200(K)}, {x: 2019-04-03, y: 100(K)}]}]
  calculateExpenseTypeTeam() {
    let arrSubExpenseSpend = []; // [{x:"tienPhat", y: 200}]
    let legendLabels = [];
    let totalSubExpenseSpend = 0;
    let objectTemp = {}; // {"TienPhat": 200}
    this.props.teamData.teamCarList.forEach(element => {
    if (this.props.teamData.teamCarReports && this.props.teamData.teamCarReports[element.id]) {
        var {arrExpenseTypeSpend, arrExpenseTypeByTime}
            = this.props.teamData.teamCarReports[element.id].expenseReport;  
  
        // End date is ENd of This Month  
        var CALCULATE_END_DATE = AppUtils.normalizeFillDate(new Date(this.state.tillDate.getFullYear(),this.state.tillDate.getMonth()+1,0));
        var CALCULATE_START_DATE = AppUtils.normalizeDateBegin(new Date(CALCULATE_END_DATE.getFullYear(), 
            CALCULATE_END_DATE.getMonth() - this.state.duration + 1, 1));
           
        
        arrExpenseTypeByTime.forEach(item => {
            for (var prop in item) {
                if (Object.prototype.hasOwnProperty.call(item, prop)) {
                    let arrSub = item[""+prop];
                    // Only Keep numberOfMonth
                    let yVal = 0;
                    if (arrSub && arrSub.length) {
                        arrSub.forEach(e => {
                            let xDate = new Date(e.x);
                            if (xDate >= CALCULATE_START_DATE && xDate <= CALCULATE_END_DATE) {
                                yVal += e.y;
                            }
                        })
                    }
                    if (yVal) {
                        if (objectTemp[""+prop]) {
                            // Exist, increase
                            objectTemp[""+prop] += yVal;
                        } else {
                            objectTemp[""+prop] = yVal;
                        }
                    }
                }
            }
        })
    }})
    // convert to Array for Chart
    for (var prop in objectTemp) {
        if (Object.prototype.hasOwnProperty.call(objectTemp, prop)) {
            totalSubExpenseSpend += objectTemp[""+prop];
            arrSubExpenseSpend.push({
                y: objectTemp[""+prop],
                x: prop   
            })
            legendLabels.push({name: prop})
        }
    }
    return {arrSubExpenseSpend, legendLabels};
  }
  render() {
      // Only Team or Private (Detail)
    if (this.props.currentVehicle || this.props.isTotalReport) {
        if (this.props.isTotalReport) {
            let {totalGasSpendTeam,totalOilSpendTeam,totalAuthSpendTeam,
                totalExpenseSpendTeam, totalServiceSpendTeam} = this.calculateAllVehicleTotalMoneyPercentTeam();
            
            var totalGasSpend = totalGasSpendTeam;
            var totalOilSpend = totalOilSpendTeam;
            var totalAuthSpend = totalAuthSpendTeam;
            var totalExpenseSpend = totalExpenseSpendTeam;
            var totalServiceSpend = totalServiceSpendTeam;
            var totalAlSpend = totalGasSpend+totalOilSpend+totalAuthSpend+totalExpenseSpend+totalServiceSpend;

            var {arrSubExpenseSpend, totalSubExpenseSpend, legendLabels} = this.calculateExpenseTypeTeam();
        } else {
            var {totalGasSpendPrivate,totalOilSpendPrivate,totalAuthSpendPrivate,
                totalExpenseSpendPrivate, totalServiceSpendPrivate}
                = this.calculateAllVehicleTotalMoneyPercentPrivate(this.props.isTeamData)

            var totalGasSpend = totalGasSpendPrivate;
            var totalOilSpend = totalOilSpendPrivate
            var totalAuthSpend = totalAuthSpendPrivate;
            var totalExpenseSpend = totalExpenseSpendPrivate;
            var totalServiceSpend = totalServiceSpendPrivate;
            var totalAlSpend = totalGasSpend+totalOilSpend+totalAuthSpend+totalExpenseSpend+totalServiceSpend;

            if (this.props.isTeamData) {
                var {arrExpenseTypeSpend, arrExpenseTypeByTime} = this.props.teamData.teamCarReports[this.props.currentVehicle.id].expenseReport;
            } else {
                var {arrExpenseTypeSpend, arrExpenseTypeByTime} = this.props.userData.carReports[this.props.currentVehicle.id].expenseReport;
            }
            var {arrSubExpenseSpend, totalSubExpenseSpend, legendLabels} = this.calculateExpenseTypeFromArr(arrExpenseTypeByTime);
        }

        return (
            <View style={styles.container}>
                
                <View style={styles.textRow}>
                    <Text><H3>
                    {AppLocales.t("CARDETAIL_H1_MONEY_USAGE")}
                    </H3></Text>
                </View>
                <View style={styles.textRowOption}>
                    <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" style={{fontSize: 16, color: "grey"}}/>}
                        selectedValue={this.state.duration}
                        onValueChange={this.onValueChangeDuration.bind(this)}
                        textStyle={{ color: "#1f77b4", fontSize: 16 }}
                        style={{width: 75}}
                        >
                        <Picker.Item label="6 Tháng" value={6} />
                        <Picker.Item label="9 Tháng" value={9} />
                        <Picker.Item label="12 Tháng" value={12} />
                        <Picker.Item label="18 Tháng" value={18} />
                        <Picker.Item label="24 Tháng" value={24} />
                        <Picker.Item label={AppLocales.t("GENERAL_ALL")} value={240} />
                    </Picker>

                    <Text style={{fontSize: 15, marginLeft: 10}}>Gần Nhất Đến</Text>
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

                {totalAlSpend > 0 ? (
                <View style={styles.statRow}>
                    <View style={styles.moneyUsagePieContainer}>
                        <VictoryPie
                            colorScale={AppConstants.COLOR_SCALE_10}
                            data={[
                                { x: AppLocales.t("GENERAL_GAS"), y: totalGasSpend },
                                { x: AppLocales.t("GENERAL_EXPENSE"), y: totalExpenseSpend },
                                { x: AppLocales.t("GENERAL_AUTHROIZE"), y: totalAuthSpend },
                                { x: AppLocales.t("GENERAL_SERVICE"), y: totalServiceSpend },
                            ]}
                            innerRadius={80}
                            radius={90}
                            labels={({ datum }) => (datum&&datum.y>0) ? (
                                AppUtils.formatMoneyToK(datum.y) + "\n"
                                +AppUtils.formatToPercent(datum.y, totalAlSpend)) : ""}
                            labelRadius={({ radius }) => radius + 10 }
                            labelComponent={<VictoryLabel style={{fontSize: 13}}/>}
                            />
                        <View style={styles.labelProgress}>
                            <Text style={styles.labelProgressText}>
                                {AppUtils.formatMoneyToK(totalAlSpend)}
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
                </View>) : <NoDataText />}

                <View>
                <View style={{...styles.textRow, marginTop: 15, alignSelf:"center"}}>
                    <Text><TypoH5>
                    {AppLocales.t("CARDETAIL_H1_EXPENSE_USAGE")+" ("+this.state.duration+" Tháng)"}
                    </TypoH5></Text>
                </View>

                {totalExpenseSpend > 0 ? (
                <View style={{...styles.statRow, marginTop: 10}}>
                    
                    <View style={styles.moneyUsagePieContainer}>
                        <VictoryPie
                            colorScale={AppConstants.COLOR_SCALE_10}
                            data={arrSubExpenseSpend}
                            innerRadius={80}
                            radius={90}
                            labels={({ datum }) => (datum&&datum.y > 0) ? (
                                AppUtils.formatMoneyToK(datum.y) + "\n"
                                +AppUtils.formatToPercent(datum.y, totalExpenseSpend)) : ""}
                            labelRadius={({ radius }) => radius + 10 }
                            labelComponent={<VictoryLabel style={{fontSize: 13}}/>}
                            />
                        <View style={styles.labelProgress}>
                            <Text style={styles.labelProgressText}>
                                {AppUtils.formatMoneyToK(totalExpenseSpend)}
                            </Text>
                        </View>
                    </View>

                    <View>
                        <VictoryContainer
                            width={Layout.window.width}
                            height={30*Math.ceil(legendLabels.length/2)}
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
                            style={{paddingBottom: 10}}
                        />
                        </VictoryContainer>
                    </View>
                </View>) : <NoDataText />}
                </View>

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
        // borderRadius: 7,
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
        marginTop: 15,
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
)(MoneyUsageReport);
