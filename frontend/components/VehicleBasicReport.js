import React, { Component } from 'react'
import { View, StyleSheet, Image, TextInput, Picker, AsyncStorage, TouchableOpacity, 
    TouchableWithoutFeedback, ProgressViewIOS, ProgressBarAndroid, Alert, Platform } from 'react-native';
import {Content, Button, Text, Icon, Card, CardItem, Body, H1, H2, H3, ActionSheet, Tab, Tabs, CheckBox } from 'native-base';
import Layout from '../constants/Layout'
import {checkAndShowInterestial} from '../components/AdsManager'
import AppUtils from '../constants/AppUtils'
import AppConstants from '../constants/AppConstants';
import {VictoryLabel, VictoryPie, VictoryBar, VictoryChart, VictoryStack, VictoryArea, VictoryLine, VictoryAxis} from 'victory-native';
import AppLocales from '../constants/i18n'
import { connect } from 'react-redux';
import {actTempCalculateCarReport} from '../redux/UserReducer'
import {BRAND_IMAGES} from '../redux/AppDataReducer'

const data = [
    { x: new Date("2018-01-15"), y: 13000 },
    { x: new Date("2018-02-15"), y: 16500 },
    { x: new Date("2018-03-15"), y: 14250 },
    { x: new Date("2018-05-15"), y: 19000 }
  ];

// props.vehicle
    // brand: '',
    // model: '',
    // licensePlate: '',
    // checkedDate:

// props.vehicleList:[],
    //   fillGasList:[],
    //   fillOilList:[],
    //   authorizeCarList: []
class VehicleBasicReport extends Component {
    constructor(props) {
        super(props);

        this.handleDeleteVehicle = this.handleDeleteVehicle.bind(this)
        this.handleEditVehicle = this.handleEditVehicle.bind(this)
    }
    handleEditVehicle() {
        AppConstants.CURRENT_VEHICLE_ID = this.props.vehicle.id;
        this.props.navigation.navigate("NewVehicle");
    }
    handleDeleteVehicle() {
        Alert.alert(
            AppLocales.t("MSG_REMOVE_CONFIRM"),
            this.props.vehicle.brand + " " + this.props.vehicle.model + ", " + this.props.vehicle.licensePlate,
            [
                {
                  text: AppLocales.t("GENERAL_NO"),
                  onPress: () => {},
                  style: 'cancel',
                },
                {text: AppLocales.t("GENERAL_YES"), style: 'destructive' , 
                    onPress: () => this.props.handleDeleteVehicle(this.props.vehicle.id, this.props.vehicle.licensePlate)},
            ],
            {cancelable: true}
        )

    }
    componentWillMount() {
        if (this.props.vehicle) {
            var currentVehicle = this.props.vehicle;
        } else {
            var currentVehicle = this.props.userData.vehicleList.find(item => item.id == this.props.vehicle.id);
        }
        if (currentVehicle) {
            //this.props.actTempCalculateCarReport(currentVehicle, null, this.props.userData)
        }
    }
    // there is props "requestDisplay to display some Part of Information only. "all" for display all "
    //      "all", "auth", "oil", "km", "gasEffective", "moneyTotal"
    // props: isTeamDisplay:
    // props: isMyVehicle: is display my vehicle, can Edit/Delete
    render() {

        if (this.props.vehicle) {
            var currentVehicle = this.props.vehicle;
        } else {
            var currentVehicle = this.props.userData.vehicleList.find(item => item.id == this.props.vehicle.id);
        }
        if (currentVehicle) {
            //this.props.actTempCalculateCarReport(currentVehicle, null, this.props.userData)
        }
        if (this.props.isTeamDisplay) {
            var currentData = this.props.teamData.teamCarReports[currentVehicle.id];
        } else {
            var currentData = this.props.userData.carReports[currentVehicle.id];
        }
        
        // let {averageKmPerLiter, averageMoneyPerLiter, averageMoneyPerDay, averageKmPerDay, averageMoneyPerKmPerDay, 
        //     lastDate, lastKm,
        //     arrMoneyPerWeek, arrKmPerWeek, totalMoneyGas}
        //     = AppUtils.getStatForGasUsage(currentVehicle.fillGasList);
        // let {lastKmOil, lastDateOil, totalMoneyOil, passedKmFromPreviousOil, nextEstimateDateForOil}
        //     = AppUtils.getInfoForOilUsage( currentVehicle.fillOilList, lastDate, lastKm, averageKmPerDay);
        // let {diffDayFromLastAuthorize, nextAuthorizeDate, totalMoneyAuthorize} 
        //     = AppUtils.getInfoCarAuthorizeDate(currentVehicle.authorizeCarList)

        let imgSource = AppUtils.loadImageSourceOfBrand(this.props.vehicle.brand.toLowerCase(), this.props.vehicle.type!="car")
        return (
            <Content>
            <TouchableOpacity 
                onPress={() => {
                    AppConstants.CURRENT_VEHICLE_ID = this.props.vehicle.id;
                    checkAndShowInterestial();
                    this.props.navigation.navigate("VehicleDetail", 
                          {vehicleId: this.props.vehicle.id, vehicle: currentVehicle, isMyVehicle:this.props.isMyVehicle})
                    }
                }
            >

                <View style={styles.container} elevation={5}>
                    <View style={styles.vehicleInfoRow}>
                        <View style={{flexDirection: "row"}}>
                            <Image
                                source={imgSource}
                                style={styles.vehicleLogo}
                            />

                            <View style={styles.vehicleInfoText}>
                                <View style={{flexDirection: "row", alignItems: "center"}}>
                                    <Text style={styles.vehicleInfoTextBrand}>
                                        {this.props.vehicle.brand + " " + this.props.vehicle.model}
                                    </Text>
                                    {/* {(this.props.isMyVehicle && this.props.vehicle.isDefault) ? 
                                        <CheckBox checked={true} color={AppConstants.COLOR_D3_DARK_GREEN}/> : null} */}
                                </View>
                                <Text style={styles.vehicleInfoTextPlate}>
                                        {this.props.vehicle.licensePlate}
                                </Text>
                            </View>
                        </View>

                        {this.props.isMyVehicle ? (
                        <View style={styles.rightVehicleButtonViewContainer}>
                            <TouchableOpacity 
                                    onPress={() => this.handleEditVehicle()}>
                                <View style={styles.rightVehicleButtonView}>
                                    <Icon type="Feather" name="edit-3" style={styles.rightVehicleButtonIcon}/>
                                    <Text style={styles.rightVehicleButtonText}>Sửa</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                    onPress={() => this.handleDeleteVehicle()}>
                                <View style={styles.rightVehicleButtonView}>
                                    <Icon type="MaterialIcons" name="delete" style={styles.rightVehicleButtonIconDelete}/>
                                    <Text style={styles.rightVehicleButtonText}>Xoá</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        ): null}

                        {this.props.isTeamDisplay ? (
                            <View style={styles.rightVehicleUserOwner}>
                                <Text style={styles.txtUserOwner}>
                                    {"@"+currentVehicle.ownerFullName}
                                </Text>
                            </View>
                        ) : null}
                    </View>

                    {((this.props.requestDisplay=="all"||this.props.requestDisplay=="service") && currentData && currentData.maintainRemind) ? (
                    <View style={styles.statRowRemind}>
                        {Platform.OS === 'ios' ? (
                        <ProgressViewIOS 
                            style={styles.progressBarRemind}
                            progress={currentData.maintainRemind.passedKmFromPreviousMaintain? 
                                ((currentData.maintainRemind.passedKmFromPreviousMaintain>0 ? currentData.maintainRemind.passedKmFromPreviousMaintain : 0)
                                /
                                currentData.maintainRemind.lastMaintainKmValidFor) : 0}
                            progressViewStyle = 'default'
                            progressTintColor = {AppUtils.getColorForProgress(currentData.maintainRemind.lastMaintainKmValidFor
                                -currentData.maintainRemind.passedKmFromPreviousMaintain, "Km")}
                            trackTintColor = "rgba(230, 230, 230, 1)"
                            />
                        ) : (
                        <ProgressBarAndroid
                            style={styles.progressBarRemind}
                            color={AppUtils.getColorForProgress(currentData.maintainRemind.lastMaintainKmValidFor
                                -currentData.maintainRemind.passedKmFromPreviousMaintain, "Km")}
                            styleAttr="Horizontal"
                            indeterminate={false}
                            progress={currentData.maintainRemind.passedKmFromPreviousMaintain? 
                                ((currentData.maintainRemind.passedKmFromPreviousMaintain>0 ? currentData.maintainRemind.passedKmFromPreviousMaintain : 0)
                                /
                                currentData.maintainRemind.lastMaintainKmValidFor) : 0}
                            />
                        )}
                        <Text style={styles.textRemind}>
                            {currentData.maintainRemind.passedKmFromPreviousMaintain>0?currentData.maintainRemind.passedKmFromPreviousMaintain:"-"}/
                            {currentData.maintainRemind.lastMaintainKmValidFor?currentData.maintainRemind.lastMaintainKmValidFor:"-"} Km
                            ({AppLocales.t("GENERAL_SERVICE")})
                        </Text>
                    </View>
                    ): null }

                    {((this.props.requestDisplay=="all"||this.props.requestDisplay=="auth") && 
                            currentData) ? (
                    <View style={styles.statRowRemind}>
                        {Platform.OS === 'ios' ? (
                        <ProgressViewIOS 
                            style={styles.progressBarRemind}
                            progress={currentData.authReport.diffDayFromLastAuthorize ?
                                (currentData.authReport.diffDayFromLastAuthorize/
                                currentData.authReport.lastAuthDaysValidFor): 0}
                            progressViewStyle = 'default'
                            progressTintColor = {AppUtils.getColorForProgress(currentData.authReport.lastAuthDaysValidFor
                                -currentData.authReport.diffDayFromLastAuthorize, "Day")}
                            trackTintColor = "rgba(230, 230, 230, 1)"
                            />
                        ) : (
                        <ProgressBarAndroid
                            style={styles.progressBarRemind}
                            color={AppUtils.getColorForProgress(currentData.authReport.lastAuthDaysValidFor
                                -currentData.authReport.diffDayFromLastAuthorize, "Day")}
                            styleAttr="Horizontal"
                            indeterminate={false}
                            progress={currentData.authReport.diffDayFromLastAuthorize ?
                                (currentData.authReport.diffDayFromLastAuthorize/
                                currentData.authReport.lastAuthDaysValidFor): 0}
                            />
                        )}
                        <Text style={styles.textRemind}>
                        {currentData.authReport.diffDayFromLastAuthorize?currentData.authReport.diffDayFromLastAuthorize:"-"}/
                        {currentData.authReport.lastAuthDaysValidFor?currentData.authReport.lastAuthDaysValidFor:"-"} {AppLocales.t("GENERAL_DAY")} ({AppLocales.t("GENERAL_AUTHROIZE_AUTH")})
                        </Text>
                    </View>
                    ): null }

                    {((this.props.requestDisplay=="all"||this.props.requestDisplay=="insurance") && 
                            currentData) ? (
                    <View style={styles.statRowRemind}>
                        {Platform.OS === 'ios' ? (
                        <ProgressViewIOS 
                            style={styles.progressBarRemind}
                            progress={currentData.authReport.diffDayFromLastAuthorizeInsurance ?
                                (currentData.authReport.diffDayFromLastAuthorizeInsurance/
                                currentData.authReport.lastAuthDaysValidForInsurance):0}
                            progressViewStyle = 'default'
                            progressTintColor = {AppUtils.getColorForProgress(currentData.authReport.lastAuthDaysValidForInsurance
                                -currentData.authReport.diffDayFromLastAuthorizeInsurance, "Day")}
                            trackTintColor = "rgba(230, 230, 230, 1)"
                            />
                        ) : (
                        <ProgressBarAndroid
                            style={styles.progressBarRemind}
                            color={AppUtils.getColorForProgress(currentData.authReport.lastAuthDaysValidForInsurance
                                -currentData.authReport.diffDayFromLastAuthorizeInsurance, "Day")}
                            styleAttr="Horizontal"
                            indeterminate={false}
                            progress={currentData.authReport.diffDayFromLastAuthorizeInsurance ?
                                (currentData.authReport.diffDayFromLastAuthorizeInsurance/
                                currentData.authReport.lastAuthDaysValidForInsurance):0}
                            />
                        )}
                        <Text style={styles.textRemind}>
                        {currentData.authReport.diffDayFromLastAuthorizeInsurance?currentData.authReport.diffDayFromLastAuthorizeInsurance:"-"}/
                        {currentData.authReport.lastAuthDaysValidForInsurance?currentData.authReport.lastAuthDaysValidForInsurance:"-"} {AppLocales.t("GENERAL_DAY")} ({AppLocales.t("GENERAL_AUTHROIZE_INSURANCE")})
                        </Text>
                    </View>
                    ): null }

                    {((this.props.requestDisplay=="all"||this.props.requestDisplay=="roadfee") &&  //roadfee
                            currentData) ? (
                    <View style={styles.statRowRemind}>
                        {Platform.OS === 'ios' ? (
                        <ProgressViewIOS 
                            style={styles.progressBarRemind}
                            progress={currentData.authReport.diffDayFromLastAuthorizeRoadFee ?
                                (currentData.authReport.diffDayFromLastAuthorizeRoadFee/
                                currentData.authReport.lastAuthDaysValidForRoadFee):0}
                            progressViewStyle = 'default'
                            progressTintColor = {AppUtils.getColorForProgress(currentData.authReport.lastAuthDaysValidForRoadFee
                                -currentData.authReport.diffDayFromLastAuthorizeRoadFee, "Day")}
                            trackTintColor = "rgba(230, 230, 230, 1)"
                            />
                        ) : (
                        <ProgressBarAndroid
                            style={styles.progressBarRemind}
                            color={AppUtils.getColorForProgress(currentData.authReport.lastAuthDaysValidForRoadFee
                                -currentData.authReport.diffDayFromLastAuthorizeRoadFee, "Day")}
                            styleAttr="Horizontal"
                            indeterminate={false}
                            progress={currentData.authReport.diffDayFromLastAuthorizeRoadFee ?
                                (currentData.authReport.diffDayFromLastAuthorizeRoadFee/
                                currentData.authReport.lastAuthDaysValidForRoadFee):0}
                            />
                        )}
                        <Text style={styles.textRemind}>
                        {currentData.authReport.diffDayFromLastAuthorizeRoadFee ? currentData.authReport.diffDayFromLastAuthorizeRoadFee : "-"}/
                        {currentData.authReport.lastAuthDaysValidForRoadFee?currentData.authReport.lastAuthDaysValidForRoadFee: "-"} {AppLocales.t("GENERAL_DAY")} ({AppLocales.t("GENERAL_AUTHROIZE_ROADFEE")})
                        </Text>
                    </View>
                    ): null }

                    <View style={styles.statRow}>
                        {((this.props.requestDisplay=="all"||this.props.requestDisplay=="km") && 
                            currentData) ? (
                        <View style={styles.infoStatRow}>
                            <Body style={this.props.isTeamDisplay? styles.horizontalCard: null}>
                                <Text style={styles.infoCardValue}>
                                    {currentData.gasReport.avgKmMonthly ? 
                                        (currentData.gasReport.avgKmMonthly.toFixed(1)+" ") : "-- "}
                                </Text>
                                <Text style={styles.infoCardText}>{"Km/Tháng"}</Text>
                                <Text style={styles.infoCardText}>{"(Di chuyển)"}</Text>
                            </Body>
                        </View>
                        ): null }

                        {((this.props.requestDisplay=="all"||this.props.requestDisplay=="gasEffective") && 
                            currentData) ? (
                        <View style={styles.infoStatRow}>
                            <Body style={this.props.isTeamDisplay? styles.horizontalCard: null}>
                                <Text style={styles.infoCardValue}>
                                    {(currentData.gasReport.totalKmGas && currentData.gasReport.totalMoneyGas) ? 
                                    ((currentData.gasReport.totalMoneyGas/currentData.gasReport.totalKmGas).toFixed(0)) : "-- "}
                                </Text>
                                <Text style={styles.infoCardText}>{"đ/Km"}</Text>
                                <Text style={styles.infoCardText}>{"(Hiệu suất Xăng)"}</Text>
                            </Body>
                        </View>
                        ): null }

                        {((this.props.requestDisplay=="all"||this.props.requestDisplay=="moneyTotal") && 
                            currentData) ? (
                        <View style={styles.infoStatRow}>
                            <Body style={this.props.isTeamDisplay? styles.horizontalCard: null}>
                                <Text style={styles.infoCardValue}>
                                    {currentData.moneyReport.totalMoneySpend ? 
                                    (AppUtils.formatMoneyToK((currentData.moneyReport.totalMoneySpend).toFixed(0))+" ") : "-- "}
                                </Text>
                                <Text style={styles.infoCardText}>{"đ"}</Text>
                                <Text style={styles.infoCardText}>{"(Tổng Chi Tiêu)"}</Text>
                            </Body>
                        </View>
                        ): null }
                    </View>

                </View>
            </TouchableOpacity>
            </Content>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginLeft: 5,
        marginRight: 5,
        marginTop: 6,
        marginBottom: 6,
        backgroundColor: "white",
        flexDirection: "column",
        borderRadius: 10,
        borderColor: "rgb(220, 220, 220)",
        borderWidth: 1,
        justifyContent: "flex-start",

        shadowColor: "#777777",
        shadowOpacity: 0.4,
        shadowRadius: 3,
        shadowOffset: {
            height: 3,
            width: 1
        }
    },


    vehicleInfoRow: {
        height: 60,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    vehicleLogo: {
        width: 60,
        height: 60,
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
        fontSize: 19
    },
    vehicleInfoTextPlate: {
        fontSize: 18,
        color: "blue"
    },
    vehicleButtons: {
        alignSelf: "flex-start",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "flex-start",
        marginRight: -10
    },
    vehicleButtonItem: {
        margin: 0,
        padding: 0
    },

    rightVehicleButtonViewContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "flex-start",
        marginRight: 0,
    },
    rightVehicleButtonView: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
        marginLeft: 10,
        marginTop: 5
    },
    rightVehicleButtonIcon: {
        fontSize: 23,
        color: "rgb(70,70,70)"
    },
    rightVehicleButtonIconDelete: {
        fontSize: 22,
        color: "rgb(250, 100, 100)"
    },
    rightVehicleButtonText: {
        textAlign: "center",
        fontSize: 12,
        color: "rgb(100,100,100)"
    },

    statRowRemind: {
        flexDirection: "row",
        padding: 3,
        justifyContent: "flex-start"
    },
    progressBarRemind: {
        transform: [{ scaleX: 1.0 }, { scaleY: 1 }],
        width: "30%",
        alignSelf: "center"
    },
    textRemind: {
        paddingLeft: 10,
        fontSize: 14,
    },  

    statRow: {
        flexDirection: "row",
        paddingBottom: 3,
        paddingTop: 5,
        justifyContent: "center",
    },
    infoStatRow: {
        flex: 1,
        borderRightColor: "rgb(220,220,220)",
        borderRightWidth: 0.5,
    },
    infoCardValue: {
        fontSize: 18,
    },
    infoCardText: {
        color: AppConstants.COLOR_TEXT_LIGHT_INFO,
        fontSize: 12
    },
    horizontalCard: {
        flexDirection: "row",
        justifyContent:"flex-start",
        alignItems:"center",
        marginLeft: 10
    },

    rightVehicleUserOwner: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "flex-start",
        marginTop: 35,
        marginRight: 5,
    },
    txtUserOwner: {
        color: AppConstants.COLOR_PICKER_TEXT,
        fontSize: 14,
        // textDecorationLine: 'underline'
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
)(VehicleBasicReport);
