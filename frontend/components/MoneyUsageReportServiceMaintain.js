import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { View, StyleSheet, Image, TextInput, AsyncStorage, TouchableOpacity } from 'react-native';
import {Container, Header, Title, Segment, Left, Right,Content, Button, Text, Icon, 
    Card, CardItem, Body, H1, H2, H3, ActionSheet, Tab, Tabs, DatePicker, Picker } from 'native-base';
import Layout from '../constants/Layout'

import AppUtils from '../constants/AppUtils'
import AppConstants from '../constants/AppConstants';
import {VictoryLabel, VictoryPie, VictoryBar, VictoryChart, VictoryStack, VictoryArea, VictoryAxis, VictoryLegend, VictoryContainer} from 'victory-native';

import { connect } from 'react-redux';
import AppLocales from '../constants/i18n'
import { NoDataText, TypoH4, TypoH5 } from './StyledText';

class MoneyUsageReportServiceMaintain extends React.Component {
  constructor(props) {
    super(props);
  }

  calculateServiceTypeTeam() {
    let arrTeamServiceSpend = []; // [{x:"Bao DUong Nho", y: 200}]
    let totalTeamServiceSpend = 0;
    let legendLabels = [];

    let objectTemp = {}; // {"TienPhat": 200}
    this.props.teamData.teamCarList.forEach(element => {
    if (this.props.teamData.teamCarReports && this.props.teamData.teamCarReports[element.id] && 
            this.props.teamData.teamCarReports[element.id].serviceReport) {
        var {arrServiceTypeSpend, totalServiceSpend2}
            = this.props.teamData.teamCarReports[element.id].serviceReport;  

        arrServiceTypeSpend.forEach(item => {
            if (objectTemp[""+item.x]) {
                // Exist, increase
                objectTemp[""+item.x] += item.y;
            } else {
                objectTemp[""+item.x] = item.y;
            }
        })
    }})
    // convert to Array for Chart
    for (var prop in objectTemp) {
        if (Object.prototype.hasOwnProperty.call(objectTemp, prop)) {
            totalTeamServiceSpend += objectTemp[""+prop];
            arrTeamServiceSpend.push({
                y: objectTemp[""+prop],
                x: prop   
            })
            legendLabels.push({name: prop})
        }
    }
    return {arrTeamServiceSpend, totalTeamServiceSpend,legendLabels};
  }
  calculateServiceTypePrivate() {
    let arrPrivateServiceSpend = []; // [{x:"Bao DUong Nho", y: 200}]
    let totalPrivateServiceSpend = 0;
    let legendLabels = [];

    let objectTemp = {}; // {"TienPhat": 200}
    this.props.userData.vehicleList.forEach(element => {
        if (this.props.userData.carReports && this.props.userData.carReports[element.id] && 
            this.props.userData.carReports[element.id].serviceReport ) {
            var {arrServiceTypeSpend, totalServiceSpend2}
                = this.props.userData.carReports[element.id].serviceReport;  

                if (arrServiceTypeSpend) {
                    arrServiceTypeSpend.forEach(item => {
                    if (objectTemp[""+item.x]) {
                        // Exist, increase
                        objectTemp[""+item.x] += item.y;
                    } else {
                        objectTemp[""+item.x] = item.y;
                    }
                })
            }
        }
    })
    // convert to Array for Chart
    for (var prop in objectTemp) {
        if (Object.prototype.hasOwnProperty.call(objectTemp, prop)) {
            totalPrivateServiceSpend += objectTemp[""+prop];
            arrPrivateServiceSpend.push({
                y: objectTemp[""+prop],
                x: prop   
            })
            legendLabels.push({name: prop})
        }
    }
    return {arrPrivateServiceSpend, totalPrivateServiceSpend, legendLabels};
  }
  replaceLongBaoDuong(inText) {
    if (inText.indexOf("Bảo Dưỡng") >= 0) {
        return inText.replace("Bảo Dưỡng", "BD");
    } else if (inText.indexOf("Sửa Chữa") >= 0) {
        return inText.replace("Sửa Chữa", "");
    } 
    return inText;
    
  }
  render() {
      // Only Team or Private (Detail)
    if (this.props.currentVehicle || this.props.isTotalReport) {
        if (this.props.isTotalReport) {
            if (this.props.isTeamDisplay) {
                // this is Report Team
                var {arrTeamServiceSpend, totalTeamServiceSpend, legendLabels} = this.calculateServiceTypeTeam();
                var theArr = arrTeamServiceSpend;
                var theTotal = totalTeamServiceSpend;
            } else {
                // this is Report Private
                var {arrPrivateServiceSpend, totalPrivateServiceSpend, legendLabels} = this.calculateServiceTypePrivate();
                var theArr = arrPrivateServiceSpend;
                var theTotal = totalPrivateServiceSpend;
            }
        } else {
            if (this.props.isTeamData) {
                if (this.props.teamData.teamCarReports[this.props.currentVehicle.id].serviceReport) {
                    var {arrServiceTypeSpend, totalServiceSpend2} = 
                        this.props.teamData.teamCarReports[this.props.currentVehicle.id].serviceReport;
                    var legendLabels =[];
                    if (arrServiceTypeSpend && arrServiceTypeSpend.length > 0) {
                        arrServiceTypeSpend.forEach(item => {
                            legendLabels.push({name: item.x})
                        })
                    }
                    var theArr = arrServiceTypeSpend;
                    var theTotal = totalServiceSpend2;
                }
            } else {
                if (this.props.userData.carReports[this.props.currentVehicle.id].serviceReport) {
                    var {arrServiceTypeSpend, totalServiceSpend2} = 
                        this.props.userData.carReports[this.props.currentVehicle.id].serviceReport;
                    var legendLabels =[];
                    if (arrServiceTypeSpend && arrServiceTypeSpend.length > 0) {
                        arrServiceTypeSpend.forEach(item => {
                            legendLabels.push({name: item.x})
                        })
                    }
                    var theArr = arrServiceTypeSpend;
                    var theTotal = totalServiceSpend2;
                }
            }
            
        }
        return (
            <View style={styles.container}>
                {theArr ? (
                <View>
                <View style={{...styles.textRow, marginTop: 15}}>
                    <Text><TypoH5>
                    {this.props.isTotalReport ? (AppLocales.t("CARDETAIL_H1_SERVICE_USAGE_TOTAL")+" (Tất Cả Các Tháng)") : 
                    AppLocales.t("CARDETAIL_H1_SERVICE_USAGE")+" (Tất Cả Các Tháng)"}
                    </TypoH5></Text>
                </View>
                {theTotal > 0 ? (
                <View style={styles.statRow}>
                    <View style={styles.moneyUsagePieContainer}>
                        <VictoryPie
                            colorScale={AppConstants.COLOR_SCALE_10}
                            data={theArr}
                            innerRadius={80}
                            radius={90}
                            labels={({ datum }) => (datum&&datum.y > 0) ? ( 
                                AppUtils.formatMoneyToK(datum.y) + "\n"
                                +AppUtils.formatToPercent(datum.y, theTotal)) : ""}
                            labelRadius={({ radius }) => radius+10 }
                            labelComponent={<VictoryLabel style={{fontSize: 13}}/>}
                            />                      
                        <View style={styles.labelProgress}>
                            <Text style={styles.labelProgressText}>
                                {AppUtils.formatMoneyToK(theTotal)}
                            </Text>
                        </View>
                    </View>
                    <View>
                        <VictoryContainer
                            width={Layout.window.width}
                            height={35*Math.ceil(legendLabels.length/2)}
                        >
                        <VictoryLegend standalone={false}
                            x={5} y={5}
                            itemsPerRow={2}
                            colorScale={AppConstants.COLOR_SCALE_10}
                            orientation="horizontal"
                            gutter={5}
                            symbolSpacer={5}
                            labelComponent={<VictoryLabel style={{fontSize: 12}}/>}
                            data={legendLabels}
                            style={{paddingBottom: 20}}
                        />
                        </VictoryContainer>
                    </View>
                </View>
                ) : <NoDataText /> }
                </View>
                ) : null }
            </View>
        )
    } else {
        return (
            <Container>
            <Content>
            <View style={styles.container}>
                <NoDataText />
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
        //borderRadius: 7,
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
)(MoneyUsageReportServiceMaintain);
