import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { View, StyleSheet, Image, TextInput, AsyncStorage, TouchableOpacity } from 'react-native';
import {Container, Header, Title, Segment, Left, Right,Content, Button, Text, Icon, 
    Card, CardItem, Body, H1, H2, H3, ActionSheet, Tab, Tabs, DatePicker, Picker } from 'native-base';
import Layout from '../constants/Layout'

import AppUtils from '../constants/AppUtils'
import AppConstants from '../constants/AppConstants';
import {VictoryLabel, VictoryScatter, VictoryGroup, VictoryChart, VictoryStack, VictoryArea, VictoryLine, VictoryAxis} from 'victory-native';

import { connect } from 'react-redux';
import AppLocales from '../constants/i18n'
import {NoDataText} from './StyledText';

class HomeTotalCasesByTime extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        country:AppLocales.t("NHOME_GENERAL_WORLD")
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
    console.log("this.state.country----------")
    console.log(this.state.country)
    if (this.state.country == AppLocales.t("NHOME_GENERAL_WORLD")) {
        if (inputData && inputData.data && inputData.data.length > 0) {
            inputData.data.forEach( item => {
                let xDate = new Date(item.date)
                AppUtils.pushInDateLabelsIfNotExist(tickXLabels, xDate)

                caseArr.push({x: xDate, y: item.world.case})
                deathArr.push({x: xDate, y: item.world.death})
            })
        }
    } else if (this.state.country == AppLocales.t("NHOME_GENERAL_OTHER_COUNTRY")) {
        // Other Country than China Mainland
        if (inputData && inputData.data && inputData.data.length > 0) {
            inputData.data.forEach( item => {
                let xDate = new Date(item.date)
                AppUtils.pushInDateLabelsIfNotExist(tickXLabels, xDate)

                let caseNo = item.world.case;
                let deathNo = item.world.death;
                if (item.countries.length > 0) {
                    caseArr.push({x: xDate, y: item.world.case - item.countries[0].case})
                    deathArr.push({x: xDate, y: item.world.death - item.countries[0].death})
                }
                
            })
        }
    } else {
        // Specific Country
        if (inputData && inputData.data && inputData.data.length > 0) {
            inputData.data.forEach( item => {
                let xDate = new Date(item.date)
                AppUtils.pushInDateLabelsIfNotExist(tickXLabels, xDate)

                let isExist = false;
                if (item.countries.length > 0) {
                    for(let i = 0; i < item.countries.length; i++) {
                        let theCountry = item.countries[i]
                        if (theCountry.name == this.state.country) {
                            caseArr.push({x: xDate, y: theCountry.case})
                            deathArr.push({x: xDate, y: theCountry.death})
                            isExist = true;
                            break;
                        }
                    }
                }

                if (!isExist) {
                    caseArr.push({x: xDate, y: 0})
                    deathArr.push({x: xDate, y: 0})
                }

                
            })
        }
    }

    return {caseArr, deathArr, tickXLabels};
  }
  renderDropdownItemCountry(inputData) {
    var dropdownView = [];
    dropdownView.push(
        <Picker.Item label={"--"+AppLocales.t("NHOME_GENERAL_WORLD")+"--"} value={AppLocales.t("NHOME_GENERAL_WORLD")} key={AppLocales.t("NHOME_GENERAL_WORLD")}/>
    )
    dropdownView.push(
        <Picker.Item label={"--"+AppLocales.t("NHOME_GENERAL_OTHER_COUNTRY")+"--"} value={AppLocales.t("NHOME_GENERAL_OTHER_COUNTRY")} 
            key={AppLocales.t("NHOME_GENERAL_OTHER_COUNTRY")}/>
    )

    if (inputData.data && inputData.data.length > 0 && inputData.data[0].countries) {
        inputData.data[0].countries.forEach(item => {
            dropdownView.push (
                <Picker.Item label={item.name} value={item.name} key={item.name}/>
            )
        })
    }
    
    return dropdownView;
  }
  render() {
        // Tong Quan of Current User
        var {caseArr, deathArr, tickXLabels} 
            = this.parseWorldCurrimulative(this.props.appData.ncov);
        tickXLabels = AppUtils.reviseTickLabelsToCount(tickXLabels, 9);

        // If Area Chart, it need 2 Points to DRAW, otherwise Chart will Error
        let dropdownView = this.renderDropdownItemCountry(this.props.appData.ncov);
        if (caseArr && caseArr.length > 1) {
            
            console.log("tickXLabels--------")
            console.log(tickXLabels)
        return (
            <View style={styles.container}>
                
                <View style={styles.rowContainerCarSelect}>
                    <Picker
                        style={{width: AppConstants.DEFAULT_FORM_WIDTH,
                            alignSelf:"center"}}
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" />}
                        placeholderStyle={{ color: "#bfc6ea", alignSelf:"center" }}
                        placeholderIconColor="#007aff"
                        selectedValue={this.state.country}
                        onValueChange={(itemValue, itemIndex) =>
                            this.setState({country: itemValue})
                        }
                    >
                        {dropdownView}
                    </Picker>
                </View>

                <View style={styles.textRow}>
                    <Text><H3>
                        {AppLocales.t("NHOME_HEADER_TOTAL_CASE_BYTIME")}
                    </H3></Text>
                    
                </View>

                <View style={styles.statRow}>
                    <View style={styles.moneyUsageStackContainer}>
                        <VictoryChart
                            width={Layout.window.width}
                            height={280}
                            padding={{top:7,bottom:20,left:5,right:0}}
                            domainPadding={{y: [10, 40], x: [22, 22]}}
                        >
                        <VictoryLine
                            interpolation="linear"
                            data={caseArr}
                            style={{
                                data: {
                                    //fill: AppConstants.COLOR_D3_MIDDLE_GREEN, fillOpacity: 0.08, 
                                    stroke: AppConstants.COLOR_HEADER_BG, strokeWidth: 1.5
                                },
                            }}
                            labels={({ datum }) => (datum&&datum.y > 0) ? (datum.y) : ""}
                            labelComponent={<VictoryLabel style={{fontSize: 9}}/>}
                            colorScale={AppConstants.COLOR_SCALE_10}
                        />

                        <VictoryScatter
                            style={{ data: { fill: AppConstants.COLOR_HEADER_BG } }}
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
                            tickFormat={(t) => `${(t>1) ? t : 0}`}
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
                            height={280}
                            padding={{top:7,bottom:20,left:5,right:0}}
                            domainPadding={{y: [10, 40], x: [22, 22]}}
                        >
                        <VictoryLine
                            interpolation="linear"
                            data={deathArr}
                            style={{
                                data: {
                                    //fill: AppConstants.COLOR_TOMATO, fillOpacity: 0.08, 
                                    stroke: AppConstants.COLOR_GOOGLE, strokeWidth: 1.5
                                },
                            }}
                            labels={({ datum }) => (datum&&datum.y > 0) ? (datum.y) : ""}
                            labelComponent={<VictoryLabel style={{fontSize: 9}}/>}
                            colorScale={AppConstants.COLOR_SCALE_10}
                        />
                        <VictoryScatter
                            style={{ data: { fill: AppConstants.COLOR_GOOGLE } }}
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
                            tickFormat={(t) => `${(t>1) ? t : 0}`}
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
                    <View style={styles.rowContainerCarSelect}>
                    <Picker
                        style={{width: AppConstants.DEFAULT_FORM_WIDTH,
                            alignSelf:"center"}}
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" />}
                        placeholderStyle={{ color: "#bfc6ea", alignSelf:"center" }}
                        placeholderIconColor="#007aff"
                        selectedValue={this.state.country}
                        onValueChange={(itemValue, itemIndex) =>
                            this.setState({country: itemValue})
                        }
                    >
                        {dropdownView}
                    </Picker>
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
      borderWidth: 0.5,
      borderColor: "rgb(220, 220, 220)",
      justifyContent: "space-between",
      marginBottom: 20,
      borderRadius: 7,
      paddingBottom: 20,
      marginTop: 10
    },
    rowContainerCarSelect: {
        flexDirection: "row",
        alignItems: "center", // vertial align
        justifyContent: "center",
        width: Layout.window.width-4,
        marginTop: 2,
        marginBottom: 5,

        alignSelf:"center",
        height: 40,
        borderColor: AppConstants.COLOR_HEADER_BG,
        borderWidth: 1,
        borderRadius: 5
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
        height: 280,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
    },
    moneyUsageStackContainerEachCar: {
        height: 280,
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
    appData: state.appData
});
const mapActionsToProps = {
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(HomeTotalCasesByTime);
