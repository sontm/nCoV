import React from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Content, Form, Icon, Item, 
    Picker, Button, Text, Input,Label, DatePicker, CheckBox, ListItem, Toast } from 'native-base';

import {HeaderText} from '../../components/StyledText'
import AppConstants from '../../constants/AppConstants'
import Layout from '../../constants/Layout';
import { connect } from 'react-redux';
import {actVehicleAddFillItem, actVehicleEditFillItem} from '../../redux/UserReducer'
import apputils from '../../constants/AppUtils';
import AppLocales from '../../constants/i18n';
import { NoDataText } from '../../components/StyledText';

function renderMaintainModuleItem(item, onRemove) {
    return (
    <View style={{flexDirection:"row", backgroundColor: "cyan"}} key={item}>
        <Text>{item}</Text>
        <Icon type="FontAwesome" name="remove" style={{fontSize: 12}}/>
    </View>
    )
}

class PayServiceScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: 0,
            id: 0, // increment
            vehicleId: 0,
            fillDate: new Date().toLocaleString(),
            price: "",
            currentKm: "",
            amount: "",
            type: "service",
            subType: "", // not used
            remark: "",
            validFor: 5000, // km or Month
            validForIndex: 0, // index in array of maintain type
            serviceModule: {}, // Bo Phan cua Xe Sua Chua
            isConstantFix: false // when FIx sudden a problem of Car, not Maintainance 
        };

        this.save = this.save.bind(this)
        this.setMaintainType = this.setMaintainType.bind(this)
        this.onUpdateMaintainModules = this.onUpdateMaintainModules.bind(this)
        this.removeMaintainModule = this.removeMaintainModule.bind(this)

        this.actualSave = this.actualSave.bind(this)
        this.onChooseVehicle = this.onChooseVehicle.bind(this)
        
        this.currentVehileIsBike = false;
    }

    componentWillMount() {
        apputils.CONSOLE_LOG("            PayService Screen WillMount")
        if ((!this.props.navigation.state.params || !this.props.navigation.state.params.createNew) && AppConstants.CURRENT_EDIT_FILL_ID) {
            // Load from Info
            const currentVehicle = this.props.userData.vehicleList.find(item => item.id == AppConstants.CURRENT_VEHICLE_ID);
            this.currentVehicle = currentVehicle;

            for (let i = 0; i < currentVehicle.serviceList.length; i++) {
                if (currentVehicle.serviceList[i].id == AppConstants.CURRENT_EDIT_FILL_ID) {
                    AppConstants.TEMPDATA_SERVICE_MAINTAIN_MODULES = currentVehicle.serviceList[i].serviceModule;
                    this.isEditing = true;
                    this.setState({
                        ...currentVehicle.serviceList[i],
                        vehicleId: AppConstants.CURRENT_VEHICLE_ID,
                        id: AppConstants.CURRENT_EDIT_FILL_ID,
                        fillDate:currentVehicle.serviceList[i].fillDate.toLocaleString(),
                    })
                }
            }
        } else {
           
            AppConstants.TEMPDATA_SERVICE_MAINTAIN_MODULES = {};
            this.isEditing = false;
            // If There is No Current Vehicle ID, Set to the First 
            if (!AppConstants.CURRENT_VEHICLE_ID || AppConstants.CURRENT_VEHICLE_ID == 0) {
                if (this.props.userData.vehicleList && this.props.userData.vehicleList.length > 0) {
                    let currentVehicle = this.props.userData.vehicleList.find(item => item.id == this.props.userData.vehicleList[0].id);
                    this.currentVehicle = currentVehicle;

                    this.setState({
                        vehicleId: this.props.userData.vehicleList[0].id
                    })
                }
            } else {
                let currentVehicle = this.props.userData.vehicleList.find(item => item.id == AppConstants.CURRENT_VEHICLE_ID);
                this.currentVehicle = currentVehicle;

                this.setState({
                    vehicleId: AppConstants.CURRENT_VEHICLE_ID
                })
            }
        }
    }
    actualSave(maxMeter) {
        let curMaxMeter = 0;
        if (maxMeter) {
            curMaxMeter = maxMeter+1;
        }
        if ((!this.props.navigation.state.params || !this.props.navigation.state.params.createNew) && AppConstants.CURRENT_VEHICLE_ID) {
            apputils.CONSOLE_LOG("WIll Edit Service:")
            let newData = {
                ...this.state,

                vehicleId: (this.state.vehicleId),
                fillDate: this.state.fillDate,
                price: Number(this.state.price),
                currentKm: Number(this.state.currentKm)+curMaxMeter
            }
            if (curMaxMeter) {
                newData.maxMeter = curMaxMeter;
            }
            apputils.CONSOLE_LOG(newData)

            this.props.actVehicleEditFillItem(newData, AppConstants.FILL_ITEM_SERVICE, this.props.userData)
            this.props.navigation.goBack()
        } else {
            apputils.CONSOLE_LOG("WIll Save Car Authorize:")
            let newData = {
                ...this.state,
                
                vehicleId: (this.state.vehicleId),
                fillDate: this.state.fillDate,
                price: Number(this.state.price),
                currentKm: Number(this.state.currentKm)+curMaxMeter
            }
            if (curMaxMeter) {
                newData.maxMeter = curMaxMeter;
            }
            // let maxId = 0;
            // this.props.userData.serviceList.forEach(item => {
            //     if (maxId < item.id) {
            //         maxId = item.id
            //     }
            // })
            newData.id = "ser-"+this.state.vehicleId+"-"+apputils.uuidv4();
            apputils.CONSOLE_LOG(newData)
            // set Current VE ID so can ComeBack VehicleDetail
            AppConstants.CURRENT_VEHICLE_ID = this.state.vehicleId;

            this.props.actVehicleAddFillItem(newData, AppConstants.FILL_ITEM_SERVICE, this.props.userData)

            this.props.navigation.navigate('VehicleDetail', {vehicleId: this.state.vehicleId, isMyVehicle: true})
        }
    }
    save = async (newVehicle) => {
        if (!this.state.vehicleId || !this.state.price || !this.state.currentKm || Object.keys(this.state.serviceModule) == 0) {
            Toast.show({
                text: AppLocales.t("TOAST_NEED_FILL_ENOUGH"),
                //buttonText: "Okay",
                position: "top",
                type: "danger"
            })
        } else {
            let currentVehicle = this.currentVehicle;
            
            apputils.CONSOLE_LOG("-----maxMeter")
            apputils.CONSOLE_LOG(currentVehicle.maxMeter)
            let theMaxMeter = 0;
            if (currentVehicle.maxMeter) {
                theMaxMeter = currentVehicle.maxMeter;
            }

            let prevItem = null;
            let currentKm = Number(this.state.currentKm);

            if (currentVehicle.fillGasList && currentVehicle.fillGasList.length > 0) {
                for (let l = currentVehicle.fillGasList.length -1; l >= 0; l--) {
                    // if the Date is Smaller than this date, that is the Previous
                    let item = currentVehicle.fillGasList[l];
                    if (new Date(this.state.fillDate).getTime() > new Date(item.fillDate).getTime()) {
                        prevItem = item;
                        break;
                    }
                }
            }
            if (prevItem) {
                // Bike Odometer ussually 99999, Car is 999999
                apputils.CONSOLE_LOG("currentKm:" + currentKm)
                apputils.CONSOLE_LOG("prevItem.currentKm:" + prevItem.currentKm)
                if (!theMaxMeter && currentKm < 30000 && prevItem.currentKm > 90000) {
                    // Validate Current KM if Over Max Odometer. 
                    Alert.alert(
                        "Km hiện tại (" + currentKm + ") nhỏ hơn lần đổ xăng trước (" + prevItem.currentKm + ") rất nhiều.",
                        "Công tơ mét đã quay hết vòng ? Hãy Nhập Số Lớn Nhất của Công tơ mét!",
                        [
                            {
                                text: 'Không Phải, Tiếp Tục Lưu',
                                onPress: () => {this.actualSave()},
                                style: 'destructive',
                            },
                            {text: 'OK, Nhập Số', 
                                onPress: () => {
                                    // go to props
                                    this.props.navigation.navigate("SetMaxOdometer", {vehicleId: this.state.vehicleId})
                                } 
                            },
                            
                        ],
                        {cancelable: true}
                    );
                } else if (currentKm+theMaxMeter < prevItem.currentKm) {
                    // Validate if Current KM Smaller than Previous
                    Alert.alert(
                        "Km hiện tại (" + currentKm + (theMaxMeter>0?(" " +theMaxMeter):"") +") nhỏ hơn lần trước (" + prevItem.currentKm + ").",
                        "Bạn có muốn Huỷ và Nhập Lại?",
                        [
                            {text: 'Không, Tiếp Tục Lưu', style: 'destructive' , 
                                onPress: () => {
                                    this.actualSave(currentVehicle.maxMeter)
                                } 
                            },
                            {
                                text: 'Huỷ, Nhập Lại',
                                onPress: () => apputils.CONSOLE_LOG('Cancel Pressed'),
                                style: 'cancel',
                            },
                        ],
                        {cancelable: true}
                    );
                } else {
                    this.actualSave(currentVehicle.maxMeter)
                }

                
            } else {
                this.actualSave(currentVehicle.maxMeter)
            }
            
        }
    }

    setMaintainType(value, index) {
        apputils.CONSOLE_LOG("setMaintainType validForIndex:" + index)
        this.setState({
            validForIndex: index,
            validFor: value
        })
    }
    combineMaintainType(settingService) {
        let result = [];
        apputils.CONSOLE_LOG(" combine MainTain Type:" + this.currentVehileIsBike)
        apputils.CONSOLE_LOG(settingService)
        if (settingService) {
            if (this.currentVehileIsBike) {
                if (settingService.KmBike && settingService.KmBike.length > 0 &&
                        settingService.MonthBike && settingService.MonthBike.length > 0) {
                    settingService.KmBike.forEach((item, idx) => {
                        if (settingService.LevelBikeEnable[idx]) {
                            result.push({
                                text: settingService.KmBike[idx]+"Km ("+AppLocales.t("GENERAL_OR")+" "+
                                settingService.MonthBike[idx]+" "+AppLocales.t("GENERAL_MONTH") +")",
                                kmValue: settingService.KmBike[idx],
                                index: idx
                            })
                        }
                    })
                    
                }
            } else {
                if (settingService.Km && settingService.Km.length > 0 &&
                        settingService.Month && settingService.Month.length > 0) {
                    settingService.Km.forEach((item, idx) => {
                        if (settingService.LevelEnable && settingService.LevelEnable[idx]) {
                            result.push({
                                text: settingService.Km[idx]+"Km ("+AppLocales.t("GENERAL_OR")+" "+
                                settingService.Month[idx]+" "+AppLocales.t("GENERAL_MONTH") +")",
                                kmValue: settingService.Km[idx],
                                index: idx
                            })
                        }
                    })
                    
                }
            }
            
        }
        return result; 
    }

    // called by ServiceScreenModules to re-render after go Back
    onUpdateMaintainModules(values) {
        apputils.CONSOLE_LOG("OK from CHILD calleddddddddddddddddddddddddddd")
        apputils.CONSOLE_LOG(values)
        this.setState({
            serviceModule: values
        })
    }
    removeMaintainModule(value) {
        apputils.CONSOLE_LOG(" remove Maintain Module calledddd")
        apputils.CONSOLE_LOG(value)
        apputils.CONSOLE_LOG(this.state.serviceModule[""+value])
        if (this.state.serviceModule[""+value]) {
            let prevList = this.state.serviceModule;
            delete prevList[""+value];

            this.setState({
                serviceModule: prevList
            })
        }
    }

    //this.state.vehicleId}
    checkCurrentVehicleIsBikeFromSelected() {
        
        if (this.props.userData.vehicleList && this.props.userData.vehicleList.length > 0) {
            this.currentVehileIsBike = false;
            for (let l = 0; l < this.props.userData.vehicleList.length; l++) {
                if (this.props.userData.vehicleList[l].id == this.state.vehicleId) {
                    if (this.props.userData.vehicleList[l].type != "car") {
                        this.currentVehileIsBike = true;
                    }
                }
            }
        }
    }
    onChooseVehicle(veId) {
        apputils.CONSOLE_LOG("onChoose:" + veId)
        this.currentVehicle = this.props.userData.vehicleList.find(item => item.id == veId);

        this.setState({
            vehicleId: veId
        })
    }
    render() {
        if (!this.currentVehicle) {
            // No Car Associated,
            return (
                <View style={styles.formContainer}>
                    <NoDataText content="Không Có Xe Tương Ứng!"/>
                </View>
            )
        } 

        apputils.CONSOLE_LOG(this.state)
        this.checkCurrentVehicleIsBikeFromSelected();
        
        let theDate = new Date(this.state.fillDate);
        let today = new Date();
        if (today.getFullYear() == theDate.getFullYear && today.getMonth() == theDate.getMonth() &&
                today.getDate() == theDate.getDate()) {
            var datePlaceHoder = AppLocales.t("GENERAL_TODAY")+"(" + apputils.formatDateMonthDayYearVNShort(theDate) + ")";
        } else {
            var datePlaceHoder = apputils.formatDateMonthDayYearVNShort(theDate);
        }
        let maintainTypeArr = this.combineMaintainType(this.props.userData.settingService)
        apputils.CONSOLE_LOG("            PayServiceScreen render")
        apputils.CONSOLE_LOG(AppConstants.TEMPDATA_SERVICE_MAINTAIN_MODULES)

        let viewServiceModule = [];
        for (let prop in this.state.serviceModule) {
            // Because these two Obj share same prop, so set in 1 for loop
            if (Object.prototype.hasOwnProperty.call(this.state.serviceModule, prop) && 
                    Object.prototype.hasOwnProperty.call(this.state.serviceModule, prop)) {

                let item = this.state.serviceModule[""+prop];
                viewServiceModule.push(
                    <ListItem key={prop+""+item} style={{flexDirection:"row", 
                        justifyContent: "space-between", borderWidth: 0, borderColor: "rgba(0,0,0,0)", 
                        paddingVertical: 0, marginVertical: -5}}>
                        <Text style={{fontSize: 13}}>{prop+": " + item}</Text>
                        <TouchableOpacity 
                                onPress={() => this.removeMaintainModule(prop)}>
                            <Icon type="FontAwesome" name="remove" style={{fontSize: 20, color: "grey", marginLeft: 7}} />
                        </TouchableOpacity>
                    </ListItem>
                )
            }
        }
        
        return (
            <Container>
            <KeyboardAvoidingView style={{flex: 1, justifyContent: 'center'}} keyboardVerticalOffset={100} 
                behavior={Platform.OS === "ios" ? 'padding' : 'height'}>
            <Content>
                <View style={styles.formContainer}>
                    <View style={styles.rowContainerCarSelect}>
                        <Picker
                            style={{width: AppConstants.DEFAULT_FORM_WIDTH, color:AppConstants.COLOR_HEADER_BG, fontSize: 30,
                                alignSelf:"center"}}
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" />}
                            placeholder={"--"+AppLocales.t("NEW_GAS_CAR")+"--"}
                            placeholderStyle={{ color: "#bfc6ea", alignSelf:"center" }}
                            placeholderIconColor="#007aff"
                            selectedValue={this.state.vehicleId}
                            enabled={this.isEditing?false:true}
                            onValueChange={(itemValue) =>
                                this.onChooseVehicle(itemValue)
                            }
                        >
                            {this.props.userData.vehicleList.map(item => (
                                <Picker.Item label={item.brand + " " + item.model + " " + item.licensePlate}
                                    value={item.id} key={item.id}/>
                            ))}
                        </Picker>
                    </View>

                    <View style={styles.rowContainer}>
                        <Item stackedLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                        <Label style={styles.rowLabel}>{AppLocales.t("NEW_GAS_FILLDATE")}</Label>
                        <View style={styles.rowForm}>
                        <DatePicker
                            defaultDate={theDate}
                            minimumDate={new Date(2010, 1, 1)}
                            maximumDate={new Date(2100, 12, 31)}
                            locale={"vi"}
                            timeZoneOffsetInMinutes={undefined}
                            modalTransparent={false}
                            animationType={"fade"}
                            androidMode={"default"}
                            placeHolderText={datePlaceHoder}
                            textStyle={{ color: AppConstants.COLOR_PICKER_TEXT }}
                            placeHolderTextStyle={{ color: AppConstants.COLOR_PICKER_TEXT }}
                            onDateChange={(fillDate) => this.setState({fillDate})}
                            disabled={false}
                            iosIcon={<Icon name="arrow-down" style={{fontSize: 16, color: "grey"}}/>}
                        />
                        </View>
                        </Item>
                    </View>

                    <View style={styles.rowContainer}>
                        <Item stackedLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                            <Label>{AppLocales.t("NEW_SERVICE_TYPE")}</Label>
                            <View style={{...styles.rowFormNoBorder, marginTop: 10}}>

                            <TouchableOpacity
                                style={{flexDirection: "row", justifyContent:"flex-start", alignItems:"center"}}>
                            <CheckBox checked={this.state.isConstantFix != true} 
                                onPress={() =>this.setState({isConstantFix: false})}/>
                            <Text style={{...styles.smallerText, marginLeft: 12}}  onPress={() =>this.setState({isConstantFix: false})}>
                                {AppLocales.t("NEW_SERVICE_MAINTAIN")+""}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{flexDirection: "row", justifyContent:"flex-start", alignItems:"center"}}>
                            <CheckBox style={{marginLeft: 10}}checked={this.state.isConstantFix == true} 
                                onPress={() =>this.setState({isConstantFix: true})}/>
                            <Text style={{...styles.smallerText, marginLeft: 12}} onPress={() =>this.setState({isConstantFix: true})}>
                                {AppLocales.t("NEW_SERVICE_CONSANTFIX")+""}</Text>
                            </TouchableOpacity>
                            </View>
                        </Item>
                    </View>
                    
                    {!this.state.isConstantFix ? 
                    <View style={styles.rowContainer}>
                        <View style={styles.rowForm}>
                        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                            <Label style={styles.rowLabel}>{AppLocales.t("NEW_SERVICE_MAINTAIN_TYPE")}</Label>
                            <Button small style={{backgroundColor: AppConstants.COLOR_HEADER_BG}}
                                    onPress={() => {
                                        this.props.navigation.navigate("ServiceMaintainSetting")
                                }}>
                                    <Text>{AppLocales.t("NEW_SERVICE_MAINTAIN_TYPE_SET")}</Text>
                            </Button>
                        </View>
                        <Item style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down" />}
                                style={{width: AppConstants.DEFAULT_FORM_WIDTH, color:AppConstants.COLOR_HEADER_BG, fontSize: 30,
                                    alignSelf:"center"}}
                                placeholderStyle={{ color: "#bfc6ea" }}
                                placeholderIconColor="#007aff"
                                selectedValue={this.state.validFor}
                                onValueChange={(itemValue, itemIndex) =>
                                   this.setMaintainType(itemValue, itemIndex)
                                }
                            >
                                { maintainTypeArr.map((item, idx) => (
                                    <Picker.Item label={""+item.text} value={item.kmValue} key={idx}/>
                                ))}
                            </Picker>
                        </Item>
                        </View>
                    </View> : null}

                    <View style={styles.rowContainer}>
                        <Item stackedLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                        <View style={{flexDirection:"row", alignSelf:"flex-start"}}>
                            <Label style={styles.rowLabel}>{AppLocales.t("NEW_GAS_PRICE")}</Label>
                            {!this.state.price ?
                            <Label style={{color: "red"}}>*</Label>
                            : null}
                        </View>

                        <Input
                            style={styles.rowForm}
                            keyboardType="numeric"
                            onChangeText={(price) => this.setState({price})}
                            value={""+this.state.price}
                        />
                        </Item>
                    </View>

                    <View style={styles.rowContainer}>
                        <Item stackedLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                        <View style={{flexDirection:"row", alignSelf:"flex-start"}}>
                            <Label style={styles.rowLabel}>{AppLocales.t("NEW_GAS_CURRENTKM")}</Label>
                            {!this.state.currentKm ?
                            <Label style={{color: "red"}}>*</Label>
                            : null}
                        </View>
                        <Label>
                        {(this.currentVehicle&&this.currentVehicle.maxMeter>0) ? 
                            "(Đã qua vòng Công tơ mét "+ this.currentVehicle.maxMeter + "Km)" : null}
                        </Label>
                        <Input
                            style={styles.rowForm}
                            keyboardType="numeric"
                            onChangeText={(currentKm) => this.setState({currentKm})}
                            value={""+this.state.currentKm}
                        />
                        </Item>
                    </View>

                    <View style={styles.rowContainerVertical}>
                        <View style={{flexDirection: "row", justifyContent: "space-between", 
                            alignItems:"center", width: AppConstants.DEFAULT_FORM_WIDTH}}>
                            <View style={{flexDirection: "row"}}>
                            <Text style={{fontSize: 16, color: AppConstants.COLOR_TEXT_DARKDER_INFO}}>
                                {AppLocales.t("NEW_SERVICE_MODULES")}</Text>
                            {Object.keys(this.state.serviceModule).length == 0 ?
                            <Text style={{color: "red"}}>*</Text>
                            : null}
                            </View> 
                            <Button small  style={{backgroundColor: AppConstants.COLOR_HEADER_BG}}
                                    onPress={() => {
                                        this.props.navigation.navigate("ServiceModules", 
                                        {onOk: this.onUpdateMaintainModules,
                                        isBike: this.currentVehileIsBike})
                                }}>
                                    <Text>{AppLocales.t("MAINTAIN_ADD_MODULE")}</Text>
                                    <Icon type="Entypo" name="plus" style={{fontSize: 14, marginLeft: -10}}/>
                            </Button>
                        </View>
                        <View style={{flexDirection: "column", alignItems: "flex-end", minHeight: 60, 
                            width: AppConstants.DEFAULT_FORM_WIDTH}}>
                            {viewServiceModule}
                        </View>
                    </View>

                    <View style={styles.rowContainer}>
                        <Item stackedLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                        <Label style={styles.rowLabel}>{AppLocales.t("NEW_GAS_REMARK")+": "}</Label>
                        <Input
                            style={styles.rowForm}
                            onChangeText={(remark) => this.setState({remark})}
                            value={this.state.remark}
                        />
                        </Item>
                    </View>

                    <View style={styles.rowButton}>
                        <Button rounded
                            style={styles.btnSubmit}
                            onPress={() => this.save(this.state)}
                        ><Text>{this.isEditing ? AppLocales.t("GENERAL_EDITDATA") : AppLocales.t("GENERAL_ADDDATA")}</Text></Button>
                    </View>
                </View>
            </Content>
            </KeyboardAvoidingView>
            </Container>
        );
    }
}

PayServiceScreen.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={{backgroundColor: AppConstants.COLOR_HEADER_BG, marginTop:-AppConstants.DEFAULT_IOS_STATUSBAR_HEIGHT}}>
          <Left>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" style={{color:"white"}}/>
            </Button>
          </Left>
          <Body>
            <Title><HeaderText>{AppLocales.t("NEW_SERVICE_HEADER")}</HeaderText></Title>
          </Body>
          <Right />
        </Header>
    )
});

const styles = StyleSheet.create({
    formContainer: {
      flex: 1,
      paddingTop: 10,
      paddingHorizontal: AppConstants.DEFAULT_FORM_PADDING_HORIZON,
      //backgroundColor: '#fff',
      flexDirection: "column",
      paddingBottom: 150
    },
    rowContainerCarSelect: {
      flexDirection: "row",
      alignItems: "center", // vertial align
      justifyContent: "center",
      width: AppConstants.DEFAULT_FORM_WIDTH,
      alignSelf:"center",
      height: 60,
      borderColor: AppConstants.COLOR_HEADER_BG,
      borderWidth: 1,
      borderRadius: 10
    },
    rowContainerVertical: {
        flexDirection: "column",
        alignItems: "center", // vertial align
        justifyContent: "center",
        width: AppConstants.DEFAULT_FORM_WIDTH,
        marginTop: 10,
        alignSelf:"center"
        // borderWidth: 1,
        // borderColor:"grey"
    },

    rowContainer: {
      flexDirection: "row",
      alignItems: "center", // vertial align
      justifyContent: "center",
      width: AppConstants.DEFAULT_FORM_WIDTH,
      marginTop: 10,
      alignSelf:"center"
      // borderWidth: 1,
      // borderColor:"grey"
    },
    rowForm: {
      borderBottomColor: "rgb(210, 210, 210)",
      borderBottomWidth: 0.5,
      width: AppConstants.DEFAULT_FORM_WIDTH,
      justifyContent: "center"
    },
    rowFormNoBorder: {
        flexDirection: "row",
        width: AppConstants.DEFAULT_FORM_WIDTH,
    },
    rowButton: {
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "center",
        marginTop: 15,
        marginBottom: 30
    },
    rowButtonAbsolute: {
        alignItems: "center",
        alignSelf: "center",
        position: 'absolute',
        justifyContent: "center",
        bottom: 3,
        left: 0,
        right: 0,
    },
    btnSubmit: {
      width: AppConstants.DEFAULT_FORM_BUTTON_WIDTH,
      backgroundColor: AppConstants.COLOR_BUTTON_BG,
      justifyContent: "center",
    },
    smallerText: {
        fontSize: 13
    }
});


const mapStateToProps = (state) => ({
    userData: state.userData,
    appData: state.appData
});
const mapActionsToProps = {
    actVehicleAddFillItem,
    actVehicleEditFillItem
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(PayServiceScreen);
