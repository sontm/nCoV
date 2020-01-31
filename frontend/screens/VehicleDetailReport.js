import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { View, StyleSheet, Image, TextInput, Picker, AsyncStorage, TouchableOpacity, ScrollView } from 'react-native';
import {Container, Header, Title, Segment, Left, Right,Content, Button, Text, Icon, 
    Card, CardItem, Body, H1, H2, H3, ActionSheet, Tab, Tabs, TabHeading, ScrollableTab } from 'native-base';
import Layout from '../constants/Layout'
import {HeaderText, NoDataText} from '../components/StyledText'
import AppUtils from '../constants/AppUtils'
import AppConstants from '../constants/AppConstants';
import {VictoryLabel, VictoryPie, VictoryBar, VictoryChart, VictoryStack, VictoryArea, VictoryLine, VictoryAxis} from 'victory-native';

import GasUsageReport from '../components/GasUsageReport'
import MoneyUsageReport from '../components/MoneyUsageReport'
import MoneyUsageByTimeReport from '../components/MoneyUsageByTimeReport'
import ServiceMaintainTable from '../components/ServiceMaintainTable';
import MoneyUsageReportServiceMaintain from '../components/MoneyUsageReportServiceMaintain';

import { connect } from 'react-redux';
import AppLocales from '../constants/i18n'
import {actTempCalculateCarReport} from '../redux/UserReducer'

class VehicleDetailReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        vehicle: {},
    };

  }

  componentDidMount() {
    AppUtils.CONSOLE_LOG("~~~~~~~~~~~~DetailReport DidMount:" + AppConstants.CURRENT_VEHICLE_ID)
  }
  componentDidUpdate() {
    AppUtils.CONSOLE_LOG("~~~~~~~~~~~~DetailReport DidUpdate:" + AppConstants.CURRENT_VEHICLE_ID)
  }
  render() {
    AppUtils.CONSOLE_LOG("~~~~~~~~~~~~DetailReport Render:" + AppConstants.CURRENT_VEHICLE_ID)
    AppUtils.CONSOLE_LOG(this.props.navigation.state.params)
    if (this.props.navigation && this.props.navigation.state.params && this.props.navigation.state.params.vehicle) {
        var currentVehicle = this.props.navigation.state.params.vehicle;
    } else {
        var currentVehicle = this.props.userData.vehicleList.find(item => item.id == AppConstants.CURRENT_VEHICLE_ID);
    }

    if (currentVehicle) {
        AppConstants.CURRENT_VEHICLE_ID = currentVehicle.id;
        //AppUtils.CONSOLE_LOG("CALL actTempCalculateCarReport from Detail Report:")
        //this.props.actTempCalculateCarReport(currentVehicle, null, this.props.userData)
        //AppUtils.CONSOLE_LOG("END actTempCalculateCarReport:")
        // let {lastDate, lastKm, averageKmPerDay} = AppUtils.getLastDateAndKmFromGas(currentVehicle.fillGasList);
        // let {lastKmOil, lastDateOil, totalMoneyOil, passedKmFromPreviousOil, nextEstimateDateForOil}
        //     = AppUtils.getInfoForOilUsage(currentVehicle.fillOilList, 
        //         lastDate, lastKm, averageKmPerDay);
        // let {diffDayFromLastAuthorize, nextAuthorizeDate, totalMoneyAuthorize} 
        //     = AppUtils.getInfoCarAuthorizeDate(currentVehicle.authorizeCarList)
        // let {arrGasSpend, arrOilSpend, arrAuthSpend, arrExpenseSpend, arrServiceSpend,
        //     totalGasSpend, totalOilSpend, totalAuthSpend, totalExpenseSpend, totalServiceSpend}
        //     = AppUtils.getInfoMoneySpend(currentVehicle.fillGasList, currentVehicle.fillOilList, 
        //         currentVehicle.authorizeCarList, currentVehicle.expenseList, currentVehicle.serviceList);
        // let {arrExpenseTypeSpend} = AppUtils.getInfoMoneySpendInExpense(currentVehicle.expenseList);
        let theReport = this.props.userData.carReports[currentVehicle.id];
        let isTeamData = false;
        if (!theReport) {
            theReport = this.props.teamData.teamCarReports[currentVehicle.id];
            isTeamData = true;
        }

        let imgSource = AppUtils.loadImageSourceOfBrand(currentVehicle.brand.toLowerCase(), currentVehicle.type!="car")
        // calcualte Service maintain date or KM
        //totalNextDay
        if (theReport && theReport.maintainRemind) {
            var passedDay =  AppUtils.calculateDiffDayOf2Date(theReport.maintainRemind.lastDateMaintain,
                new Date());
            var totalDayForMaintain = theReport.maintainRemind.totalNextDay;
            if (!totalDayForMaintain) {
                totalDayForMaintain = AppUtils.calculateDiffDayOf2Date(theReport.maintainRemind.lastDateMaintain,
                    theReport.maintainRemind.nextEstimatedDateForMaintain);
            }
            var percentByDate = 1.0 * passedDay/totalDayForMaintain;
            var percentByKm = 1.0 * theReport.maintainRemind.passedKmFromPreviousMaintain/
            theReport.maintainRemind.lastMaintainKmValidFor;
            if (percentByDate > percentByKm) {
                // Will Show by Date
                var passService = passedDay;
                var totalNeedService = totalDayForMaintain;
                var unitService = AppLocales.t("GENERAL_DAY");
                var nextDateService = theReport.maintainRemind.nextEstimatedDateForMaintain;

                var passServiceSub = theReport.maintainRemind.passedKmFromPreviousMaintain;
                var totalNeedServiceSub = theReport.maintainRemind.lastMaintainKmValidFor;
                var unitServiceSub = "Km";
            } else {
                var passServiceSub = passedDay;
                var totalNeedServiceSub = totalDayForMaintain;
                var unitServiceSub = AppLocales.t("GENERAL_DAY");
                var nextDateServiceSub = theReport.maintainRemind.nextEstimatedDateForMaintain;

                var passService = theReport.maintainRemind.passedKmFromPreviousMaintain;
                var totalNeedService = theReport.maintainRemind.lastMaintainKmValidFor;
                var unitService = "Km";
            }
            var isHaveRemindData = false;
            if ((theReport.maintainRemind && totalNeedService) ||
                    (theReport.authReport.lastAuthDaysValidFor) ||
                    (theReport.authReport.lastAuthDaysValidForInsurance) ||
                    (theReport.authReport.lastAuthDaysValidForRoadFee)) {
                isHaveRemindData = true;
            }
        }
        AppUtils.CONSOLE_LOG("currentVehicle.brand")
        AppUtils.CONSOLE_LOG(":" + currentVehicle.brand + ":")
        
        return (
            <Container>
            <Header hasTabs style={{backgroundColor: AppConstants.COLOR_HEADER_BG, marginTop:-AppConstants.DEFAULT_IOS_STATUSBAR_HEIGHT}}>
            <Left style={{flex:1}}>
                <Button transparent onPress={() => this.props.navigation.goBack()}>
                <Icon name="arrow-back" style={{color:"white"}}/>
                </Button>
            </Left>
            <Body  style={{flex:5}}>
                <Title><HeaderText style={{fontSize:16, fontWeight: 'normal'}}>{currentVehicle.brand == "Xe Tải" ?
                    (currentVehicle.model + " " + currentVehicle.licensePlate) : 
                    (currentVehicle.brand + " " + currentVehicle.model + " " + currentVehicle.licensePlate)}</HeaderText></Title>
            </Body>
            <Right style={{flex:1}}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate("VehicleHistory", 
                    {vehicle: currentVehicle, 
                        isMyVehicle:this.props.navigation.state.params ? this.props.navigation.state.params.isMyVehicle : false})}>
                    <View style={styles.rightHistoryView}>
                    <Icon type="MaterialCommunityIcons" name="file-document-outline" style={styles.rightHistoryIcon}/>
                    <Text style={styles.rightHistoryText}>{AppLocales.t("GENERAL_HISTORY")}</Text>
                    </View>
                </TouchableOpacity>
                
            </Right>
            </Header>

            {theReport ? (
            // <Tabs locked={true} renderTabBar={()=> <ScrollableTab tabsContainerStyle={{backgroundColor: AppConstants.COLOR_HEADER_BG}}/>}>
            <Tabs locked={true}>
                <Tab heading={AppLocales.t("GENERAL_MONEYUSAGE")} tabStyle={{backgroundColor: AppConstants.COLOR_HEADER_BG}}
                        activeTabStyle={{backgroundColor: AppConstants.COLOR_HEADER_BG}}
                        textStyle={{fontSize: 14, color: AppConstants.COLOR_TEXT_INACTIVE_TAB}} 
                        activeTextStyle={{fontSize: 14,color: "white"}}>
                    <Content>
                    <ScrollView>
                    <MoneyUsageByTimeReport currentVehicle={currentVehicle} isTeamData={isTeamData}/>
                    <MoneyUsageReport currentVehicle={currentVehicle} isTeamData={isTeamData}/>
                    <MoneyUsageReportServiceMaintain currentVehicle={currentVehicle} isTeamData={isTeamData}/>
                    </ScrollView>
                    </Content>
                </Tab>
                <Tab heading={AppLocales.t("GENERAL_GAS")} tabStyle={{backgroundColor: AppConstants.COLOR_HEADER_BG}}
                        activeTabStyle={{backgroundColor: AppConstants.COLOR_HEADER_BG}}
                        textStyle={{fontSize: 14, color: AppConstants.COLOR_TEXT_INACTIVE_TAB}} 
                        activeTextStyle={{fontSize: 14,color: "white"}}>
                    <Content>
                    <GasUsageReport currentVehicle={currentVehicle} isTeamData={isTeamData}/>
                    </Content>
                </Tab>
                <Tab heading={AppLocales.t("CARDETAIL_REMINDER")}
                        tabStyle={{backgroundColor: AppConstants.COLOR_HEADER_BG}}
                        activeTabStyle={{backgroundColor: AppConstants.COLOR_HEADER_BG}}
                        textStyle={{fontSize: 14, color: AppConstants.COLOR_TEXT_INACTIVE_TAB}} 
                        activeTextStyle={{fontSize: 14,color: "white"}}>
                    <Content>
                    <View style={styles.container}>
                        <View style={styles.reminderContainer}>
                        <View style={styles.textRow}>
                            <Text><H3>
                                {AppLocales.t("CARDETAIL_REMINDER")}
                            </H3></Text>
                        </View>
                        
                        <View style={styles.statRow}>
                            {theReport.authReport.lastAuthDaysValidFor ? 
                            <View style={styles.remindItemContainer}>
                            <View style={styles.progressContainer}>
                                <VictoryPie
                                    colorScale={[AppUtils.getColorForProgress(theReport.authReport.lastAuthDaysValidFor
                                            -theReport.authReport.diffDayFromLastAuthorize, "Day"), 
                                            AppConstants.COLOR_GREY_MIDDLE_LIGHT_BG]}
                                    data={[
                                        { x: "", y: theReport.authReport.diffDayFromLastAuthorize },
                                        { x: "", y: (theReport.authReport.lastAuthDaysValidFor -
                                            theReport.authReport.diffDayFromLastAuthorize) },
                                    ]}
                                    height={140}
                                    innerRadius={58}
                                    radius={65}
                                    labels={() => null}
                                    />
                                <View style={styles.labelProgress}>
                                    <Text style={styles.progressTitle}>{AppLocales.t("GENERAL_AUTHROIZE_AUTH")}</Text>
                                    <Text style={styles.labelProgressText}>
                                        {theReport.authReport.diffDayFromLastAuthorize}/
                                        {theReport.authReport.lastAuthDaysValidFor}
                                    </Text>
                                    <Text>{AppLocales.t("GENERAL_DAY")}</Text>
                                </View>
                                <Text style={{fontSize: 14}}>{AppLocales.t("GENERAL_NEXT") + ": "}{theReport.authReport.nextAuthorizeDate ? 
                                    AppUtils.formatDateMonthDayYearVNShort(
                                        theReport.authReport.nextAuthorizeDate): "NA"}</Text>
                            </View>
                            </View> : null}

                            {theReport.authReport.lastAuthDaysValidForInsurance ?  (
                            <View style={styles.remindItemContainer}>
                            <View style={styles.progressContainer}>
                                <VictoryPie
                                    colorScale={[AppUtils.getColorForProgress(theReport.authReport.lastAuthDaysValidForInsurance
                                        -theReport.authReport.diffDayFromLastAuthorizeInsurance, "Day"), 
                                        AppConstants.COLOR_GREY_MIDDLE_LIGHT_BG]}
                                    data={[
                                        { x: "", y: theReport.authReport.diffDayFromLastAuthorizeInsurance },
                                        { x: "", y: (theReport.authReport.lastAuthDaysValidForInsurance -
                                            theReport.authReport.diffDayFromLastAuthorizeInsurance) },
                                    ]}
                                    height={140}
                                    innerRadius={58}
                                    radius={65}
                                    labels={() => null}
                                    />
                                <View style={styles.labelProgress}>
                                    <Text style={styles.progressTitle}>{AppLocales.t("GENERAL_AUTHROIZE_INSURANCE")}</Text>
                                    <Text style={styles.labelProgressText}>
                                        {theReport.authReport.diffDayFromLastAuthorizeInsurance}/
                                        {theReport.authReport.lastAuthDaysValidForInsurance}
                                    </Text>
                                    <Text>{AppLocales.t("GENERAL_DAY")}</Text>
                                </View>
                                <Text style={{fontSize: 14}}>{AppLocales.t("GENERAL_NEXT") + ": "}{theReport.authReport.nextAuthorizeDateInsurance ? 
                                    AppUtils.formatDateMonthDayYearVNShort(
                                        theReport.authReport.nextAuthorizeDateInsurance): "NA"}</Text>
                            </View></View>) : null}

                            {theReport.authReport.lastAuthDaysValidForRoadFee ? (
                            <View style={styles.remindItemContainer}>
                            <View style={styles.progressContainer}>
                                <VictoryPie
                                    colorScale={[AppUtils.getColorForProgress(theReport.authReport.lastAuthDaysValidForRoadFee
                                        -theReport.authReport.diffDayFromLastAuthorizeRoadFee, "Day"), 
                                        AppConstants.COLOR_GREY_MIDDLE_LIGHT_BG]}
                                    data={[
                                        { x: "", y: theReport.authReport.diffDayFromLastAuthorizeRoadFee },
                                        { x: "", y: (theReport.authReport.lastAuthDaysValidForRoadFee -
                                            theReport.authReport.diffDayFromLastAuthorizeRoadFee) },
                                    ]}
                                    height={140}
                                    innerRadius={58}
                                    radius={65}
                                    labels={() => null}
                                    />
                                <View style={styles.labelProgress}>
                                    <Text style={styles.progressTitle}>{AppLocales.t("GENERAL_AUTHROIZE_ROADFEE")}</Text>
                                    <Text style={styles.labelProgressText}>
                                        {theReport.authReport.diffDayFromLastAuthorizeRoadFee}/
                                        {theReport.authReport.lastAuthDaysValidForRoadFee}
                                    </Text>
                                    <Text>{AppLocales.t("GENERAL_DAY")}</Text>
                                </View>
                                <Text style={{fontSize: 14}}>{AppLocales.t("GENERAL_NEXT") + ": "}{theReport.authReport.nextAuthorizeDateRoadFee ? 
                                    AppUtils.formatDateMonthDayYearVNShort(
                                        theReport.authReport.nextAuthorizeDateRoadFee): "NA"}
                                </Text>
                            </View></View>
                            ) : null}

                            {(theReport.maintainRemind && totalNeedService )? (
                            <View style={styles.remindItemContainer}>
                            <View style={styles.progressContainer}>
                            <VictoryPie
                                colorScale={[AppUtils.getColorForProgress(totalNeedService - passService,unitService), 
                                    AppConstants.COLOR_GREY_MIDDLE_LIGHT_BG]}
                                data={[
                                    { x: "", y: passService },
                                    { x: "", y: (totalNeedService - passService) },
                                ]}
                                height={140}
                                innerRadius={58}
                                radius={65}
                                labels={() => null}
                                labelComponent={<VictoryLabel style={{fontSize: 10}}/>}
                                />
                            <View style={styles.labelProgress}>
                                <Text style={styles.progressTitle}>{AppLocales.t("GENERAL_SERVICE")}</Text>
                                <Text style={{fontSize: 20}}>
                                    {passService}/
                                    {totalNeedService}
                                </Text>
                                <Text>{unitService}</Text>
                            </View>
                            {nextDateService ? 
                            <Text style={{fontSize: 14}}>{AppLocales.t("GENERAL_NEXT") + ": "}
                                {AppUtils.formatDateMonthDayYearVNShort(nextDateService)}
                            </Text> : null}
                            </View>
                            {passServiceSub > 0 ?
                            <Text style={{fontSize: 12, textAlign:"center", alignSelf:"center"}}>{"(Nếu Theo "+ unitServiceSub + ": "}
                                {passServiceSub+"/"+ totalNeedServiceSub+ unitServiceSub+")"}
                                {/* {!nextDateServiceSub ? ")" : ""} */}
                            </Text> : null}
                            {/* {nextDateServiceSub ? 
                            <Text style={{fontSize: 13}}>{AppLocales.t("GENERAL_NEXT") + ": "}
                                {AppUtils.formatDateMonthDayYearVNShort(nextDateServiceSub)+")"}
                            </Text> : null} */}
                            </View>
                            ) : null }

                        </View>
                        {!isHaveRemindData ? 
                        (<NoDataText />) : null}
                    </View>
                    </View>
                    </Content>
                </Tab>
                
                <Tab heading={AppLocales.t("CARDETAIL_SERVICE_TABLE_SHORT")} tabStyle={{backgroundColor: AppConstants.COLOR_HEADER_BG}}
                        activeTabStyle={{backgroundColor: AppConstants.COLOR_HEADER_BG}}
                        textStyle={{fontSize: 14, color: AppConstants.COLOR_TEXT_INACTIVE_TAB}} 
                        activeTextStyle={{fontSize: 14,color: "white"}}>
                    <Content>
                    <ServiceMaintainTable  currentVehicle={currentVehicle}/>
                    </Content>
                </Tab>
            </Tabs>
            ) : null}
            </Container>
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

VehicleDetailReport.navigationOptions = ({navigation}) => ({
    header: null
});

const styles = StyleSheet.create({
    container: {
      //backgroundColor: AppConstants.COLOR_GREY_LIGHT_BG,
      flexDirection: "column",
    //   borderWidth: 0.5,
    //   borderColor: "grey",
      justifyContent: "space-between",
    },


    vehicleInfoRow: {
        backgroundColor: "white",
        height: 80,
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 20,
    },
    vehicleLogo: {
        width: 78,
        height: 78,
        resizeMode: 'contain',
        marginTop: 2,
        marginLeft: 5,
        marginRight: 10
    },
    vehicleInfoText: {
        flexDirection:"column",
        justifyContent: "space-around"
    },
    vehicleInfoTextBrand: {
        fontSize: 25
    },
    vehicleInfoTextPlate: {
        fontSize: 20,
        color: "blue"
    },

    rightHistoryView: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    rightHistoryIcon: {
        fontSize: 20,
        color: AppConstants.COLOR_HEADER_BUTTON
    },
    rightHistoryText: {
        textAlign: "center",
        fontSize: 12,
        color: AppConstants.COLOR_HEADER_BUTTON
    },

    reminderContainer: {
        backgroundColor: "white",
        //borderWidth: 0.5,
        //borderColor: "grey",
        marginBottom: 20,
        //borderRadius: 7,
       
    },

    textRow: {
        backgroundColor: "white",
        flexDirection: "row",
        paddingTop: 10,
        paddingLeft: 5,
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        flexGrow: 100,
        borderRadius: 7,
    },
    statRow: {
        backgroundColor: "white",
        flexDirection: "row",
        padding: 3,
        justifyContent: "center",
        flexWrap: "wrap",
        flexGrow: 100,
        borderRadius: 7,
        backgroundColor: "white"
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

    remindItemContainer: {
        width: 150,
        height: 180,
        justifyContent: "flex-start",
        alignItems: "center",
        alignSelf: "center",
        paddingTop: 5,
        marginBottom: 10,
    },
    progressContainer: {
        width: 150,
        height: 150,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginBottom: 5,
    },
    labelProgress: {
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
    },
    labelProgressText: {
        fontSize: 22
    },
    progressTitle: {
        fontSize: 13
    },


    gasUsageContainer: {
        width: "96%",
        height: 350,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
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


})

const mapStateToProps = (state) => ({
    userData: state.userData,
    teamData: state.teamData
});
const mapActionsToProps = {
    actTempCalculateCarReport
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(VehicleDetailReport);
