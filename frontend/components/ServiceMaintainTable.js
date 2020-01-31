import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { View, StyleSheet, Image, TextInput, AsyncStorage, TouchableOpacity, ScrollView } from 'react-native';
import {Container, Header, Title, Segment, Left, Right,Content, Button, Text, Icon, 
    Card, CardItem, Body, H1, H2, H3, CheckBox, Tab, Tabs, DatePicker, Picker } from 'native-base';
import Layout from '../constants/Layout'

import AppUtils from '../constants/AppUtils'
import AppConstants from '../constants/AppConstants';
import {VictoryLabel, VictoryPie, VictoryBar, VictoryChart, VictoryStack, VictoryArea, VictoryLine, VictoryAxis} from 'victory-native';

import { connect } from 'react-redux';
import AppLocales from '../constants/i18n'
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import { NoDataText } from './StyledText';

class ServiceMaintainTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        vehicleId: 0,
        onlyShowDataRow: false
    }
  }

  parseMaintainTableData(theVehicle, baseWidth) {
    let arrCurrentKm = [];
    let arrDiffKm = ["-"];
    let arrCurrentDate = [];
    let arrDiffDay = ["-"];
    let tableData = []; // 2 dimensional array
    let widthArr = [];
    let firstCol = [];
    let arrMaintainType = [];

    let objTableData = {}; // {DauMay: [ThayThe,"","",BaoDUong]}

    let prevKm = 0;
    let prevDate = 0;
    let serviceArr = this.props.appData.typeService;
    if (theVehicle.type != "car") {
        serviceArr = this.props.appData.typeServiceBike;
    }
    let customArr = this.props.userData.customServiceModules;
    if (theVehicle.type != "car") {
        customArr = this.props.userData.customServiceModulesBike;
    }
    if (customArr) {
        customArr.forEach(item => {
            objTableData[""+item.name] = [];
        })
    }

    serviceArr.forEach(item => {
        objTableData[""+item.name] = [];
    })

    let itemHaveData = [];

    if (theVehicle.serviceList && theVehicle.serviceList.length > 0) {
        theVehicle.serviceList.forEach(item => {
            let itemDate = AppUtils.normalizeFillDate(new Date(item.fillDate));


            arrCurrentDate.push(itemDate);
            arrCurrentKm.push(item.currentKm+"Km\n"+AppUtils.formatDateMonthDayYearVNShortShort(itemDate));
            if (!prevKm) {prevKm=item.currentKm; prevDate=itemDate}
            else {
                
                let diffTime = Math.abs(itemDate - prevDate); // in ms
                let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                
                let diffMonth = (diffDays/30).toFixed(1);
                arrDiffDay.push(diffMonth);
                arrDiffKm.push((item.currentKm - prevKm)+"Km\n"+"trong "+diffMonth+"tháng");

                prevKm=item.currentKm; prevDate=itemDate
            }

            if (item.isConstantFix) {
                arrMaintainType.push("Sửa Chữa Phát Sinh");
            } else {
                if (item.validFor > 100) {
                    arrMaintainType.push(item.validFor+" Km");
                } else {
                    arrMaintainType.push(item.validFor+" Tháng");
                }
            }

            for (let prop in objTableData) {
                // Because these two Obj share same prop, so set in 1 for loop
                if (Object.prototype.hasOwnProperty.call(objTableData, prop) && 
                        Object.prototype.hasOwnProperty.call(objTableData, prop)) {

                    if (item.serviceModule[""+prop]) {
                        // this time, this Module is in Maintain
                        objTableData[""+prop].push(item.serviceModule[""+prop][0]);
                        itemHaveData.push(prop)
                    } else {
                        // Not in Service list, add empty
                        objTableData[""+prop].push("");
                    }
                }
            }
            widthArr.push(baseWidth);
        })
    }

    for (let prop in objTableData) {
        // Because these two Obj share same prop, so set in 1 for loop
        if (Object.prototype.hasOwnProperty.call(objTableData, prop) && 
                Object.prototype.hasOwnProperty.call(objTableData, prop)) {

            if (!this.state.onlyShowDataRow || itemHaveData.indexOf(prop) >= 0) {
                let rowData = [];
                rowData.push(...objTableData[""+prop])

                tableData.push(rowData)

                firstCol.push([prop]);
            }
        }
    }
    return {tableData, arrCurrentKm, arrDiffKm, arrCurrentDate, arrDiffDay, arrMaintainType, widthArr, firstCol, itemHaveData};
  }

  
  render() {

    let currentVehicle = null;
    if (this.props.currentVehicle) {
        currentVehicle = this.props.currentVehicle;
    } else if (this.props.selectFromList) {
        for (let i = 0; i < this.props.teamData.teamCarList.length; i++) {
            if (this.props.teamData.teamCarList[i].id == this.state.vehicleId) {
                currentVehicle = this.props.teamData.teamCarList[i];
                break;
            }
        }
    }
    var dropdownView = [];
    dropdownView.push(
        <Picker.Item label={"--" + AppLocales.t("TEXT_PLEASE_SELECT_CAR_SERVICES") + "--"}
            value={0} key={0}/>)
    this.props.teamData.teamCarList.forEach(item => {
        dropdownView.push (
            <Picker.Item label={item.brand + " " + item.model + " " + item.licensePlate + ", " + item.ownerFullName}
            value={item.id} key={item.id}/>
        )
    })
    if (currentVehicle) {
        // Calculate Width
        // General, Width is divided into 5.5; First Col will be 1.5
        //   If Less than 4 Column Data, divided to ColCount+1.5
        if (!currentVehicle.serviceList || currentVehicle.serviceList.length == 0) {
            // No Data
            return (
                <Container>
                <Content>
                <View style={styles.container}>
                    {this.props.selectFromList ? (
                    <View style={styles.rowContainerCarSelect}>
                        <Picker
                            style={{width: AppConstants.DEFAULT_FORM_WIDTH,
                                alignSelf:"center"}}
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" />}
                            placeholder={"--"+AppLocales.t("NEW_GAS_CAR")+"--"}
                            placeholderStyle={{ color: "#bfc6ea", alignSelf:"center" }}
                            placeholderIconColor="#007aff"
                            selectedValue={this.state.vehicleId}
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({vehicleId: itemValue})
                            }
                        >
                            {dropdownView}
                        </Picker>
                    </View>) : null}
                
                    <NoDataText />
                </View>
                </Content>
                </Container>
            )
        } else {
            // MinBaseWidth is 60, 
            var baseWidth = Layout.window.width / (currentVehicle.serviceList.length+1.5);
            if (baseWidth < 60) {
                baseWidth = 60;
            }
        }

        // const state = this.state;
        // const tableData = [];
        // for (let i = 0; i < 30; i += 1) {
        // const rowData = [];
        // for (let j = 0; j < 9; j += 1) {
        //     rowData.push(`${i}${j}`);
        // }
        // tableData.push(rowData);
        // }
        var {tableData, arrCurrentKm, arrDiffKm, arrCurrentDate, arrDiffDay, arrMaintainType, widthArr, firstCol, itemHaveData} = 
            this.parseMaintainTableData(currentVehicle, baseWidth)
    }
    
    return (
        <View style={styles.container}>
            {this.props.selectFromList ? (
            <View style={styles.rowContainerCarSelect}>
                <Picker
                    style={{width: AppConstants.DEFAULT_FORM_WIDTH,
                        alignSelf:"center"}}
                    mode="dropdown"
                    iosIcon={<Icon name="arrow-down" />}
                    placeholder={"--"+AppLocales.t("NEW_GAS_CAR")+"--"}
                    placeholderStyle={{ color: "#bfc6ea", alignSelf:"center" }}
                    placeholderIconColor="#007aff"
                    selectedValue={this.state.vehicleId}
                    onValueChange={(itemValue, itemIndex) =>
                        this.setState({vehicleId: itemValue})
                    }
                >
                    {dropdownView}
                </Picker>
            </View>) : null}

            {baseWidth ? (
            <View>
            <View style={{...styles.textRow, marginTop: 7, marginBottom: 7}}>
                <Text><H3>
                {AppLocales.t("CARDETAIL_SERVICE_TABLE")}
                </H3></Text>
            </View>

            
            <View style={{flexDirection: "row", marginTop: 7, marginLeft: 15, marginBottom: 10}}>
                <CheckBox checked={this.state.onlyShowDataRow} 
                    onPress={() =>this.setState({onlyShowDataRow: !this.state.onlyShowDataRow})}/>
                <TouchableOpacity onPress={() =>this.setState({onlyShowDataRow: !this.state.onlyShowDataRow})}>
                <Text style={{marginLeft: 18, fontSize: 15}}>
                    {"Chỉ hiển thị dòng có dữ liệu"}
                </Text>
                </TouchableOpacity>
            </View>

            <View style={{flexDirection: "row"}}>
            <View style={{width: baseWidth*1.5}}>
                <Table borderStyle={{borderWidth: 1, borderColor: AppConstants.COLOR_GREY_LIGHT_BG}}>
                    <Row data={["Loại Bảo Dưỡng"]} style={styles.headerFirst} textStyle={styles.textHeader}/>
                    <Row data={["Tại Km,Ngày"]} style={styles.headerFirst} textStyle={styles.textHeader}/>
                    {/* <Row data={["Đi Thực Tế"]} style={styles.headerHighFirst} textStyle={styles.textHeader}/> */}
                </Table>
                <ScrollView style={styles.dataWrapper}>
                <Table borderStyle={{borderWidth: 1, borderColor: AppConstants.COLOR_GREY_LIGHT_BG}}>
                    {
                    firstCol.map((rowData, index) => (
                        <Row
                        key={index}
                        data={rowData}
                        style={[styles.row, index%2 && {backgroundColor: 'white'}]}
                        textStyle={styles.textSmallFirstCol}
                        />
                    ))
                    }
                </Table>
                </ScrollView>
            </View>

            <ScrollView horizontal={true} style={{}}>
                <View>
                    <Table borderStyle={{borderWidth: 0.8, borderColor: AppConstants.COLOR_GREY_LIGHT_BG}}>
                        <Row data={arrMaintainType} widthArr={widthArr} style={styles.header} textStyle={styles.textHeader}/>
                        <Row data={arrCurrentKm} widthArr={widthArr} style={styles.header} textStyle={styles.textHeaderMedium}/>
                        {/* <Row data={arrDiffKm} widthArr={widthArr} style={styles.headerHigh} textStyle={styles.textHeaderSmall}/> */}
                    </Table>
                    <ScrollView style={styles.dataWrapper}>
                    <Table borderStyle={{borderWidth: 0.8, borderColor: AppConstants.COLOR_GREY_LIGHT_BG}}>
                        {
                        tableData.map((rowData, index) => (
                            <Row
                            key={index}
                            data={rowData}
                            widthArr={widthArr}
                            style={[styles.row, index%2 && {backgroundColor: 'white'}]}
                            textStyle={styles.text}
                            />
                        ))
                        }
                    </Table>
                    </ScrollView>
                </View>
            </ScrollView>
            </View>

            <View style={styles.textRow}>
                <Text style={{fontSize: 14, fontStyle: "italic"}}>
                    {AppLocales.t("GENERAL_MAINTAIN_THAYTHE")[0]+": " + AppLocales.t("GENERAL_MAINTAIN_THAYTHE") + ". "}
                    {AppLocales.t("GENERAL_MAINTAIN_KIEMTRA")[0]+": " + AppLocales.t("GENERAL_MAINTAIN_KIEMTRA") + ". "}
                    {AppLocales.t("GENERAL_MAINTAIN_BAODUONG")[0]+": " + AppLocales.t("GENERAL_MAINTAIN_BAODUONG") + " (Sửa Chữa Nhỏ)."}
                    
                </Text>
            </View>
            </View>
            ) : null }
        </View>
    )
    }
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: "white",
      flexDirection: "column",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    rowContainerCarSelect: {
        flexDirection: "row",
        alignItems: "center", // vertial align
        justifyContent: "center",
        width: AppConstants.DEFAULT_FORM_WIDTH,
        marginTop: 15,
        alignSelf:"center",
        height: 60,
        borderColor: AppConstants.COLOR_HEADER_BG,
        borderWidth: 1,
        borderRadius: 10
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
    header: { height: 30, backgroundColor: AppConstants.COLOR_HEADER_BG},
    headerHigh: {height: 40, backgroundColor: AppConstants.COLOR_HEADER_BG},
    headerFirst: { height: 30, backgroundColor: AppConstants.COLOR_HEADER_BG_DARKER },
    headerHighFirst: {height: 40, backgroundColor: AppConstants.COLOR_HEADER_BG_DARKER},

    text: { textAlign: 'center', fontWeight: '100' },
    textSmall: { textAlign: 'center', fontSize: 12, },
    textSmallFirstCol: { textAlign: 'center', fontSize: 12, color: AppConstants.COLOR_HEADER_BG_DARKER},
    textHeader: {textAlign: 'center', fontSize: 13, color: "white"},
    textHeaderMedium: {textAlign: 'center', fontSize: 12, color: "white"},
    textHeaderSmall: {textAlign: 'center', fontSize: 12, color: "white"},
    dataWrapper: { marginTop: -1 },
    row: { height: 25, backgroundColor: AppConstants.COLOR_GREY_LIGHT_BG }

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
)(ServiceMaintainTable);
