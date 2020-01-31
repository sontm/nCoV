import React from 'react';
import { View, StyleSheet, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import AppConstants from '../../constants/AppConstants'
import { Container, Header, Left, Body, Right, Title, Content, Form, Icon, Item, Picker, Button, Text, Input, 
    Label, DatePicker, Toast } from 'native-base';
    import {HeaderText, NoDataText} from '../../components/StyledText'
import { connect } from 'react-redux';
import {actVehicleAddFillItem, actVehicleEditFillItem} from '../../redux/UserReducer'
import apputils from '../../constants/AppUtils';
import AppLocales from '../../constants/i18n';
import Layout from '../../constants/Layout';

class FillGasScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: 0,
            id: 0, // increment
            vehicleId: 0,
            fillDate: new Date().toLocaleString(),
            amount: "",
            price: "",
            currentKm: "",
            type: "gas",
            subType: "",
            remark: "",
        };

        this.save = this.save.bind(this)
        this.actualSave = this.actualSave.bind(this)
        this.onChooseVehicle = this.onChooseVehicle.bind(this)
        
    }
    componentWillMount() {
        if ((!this.props.navigation.state.params || !this.props.navigation.state.params.createNew) && 
                AppConstants.CURRENT_EDIT_FILL_ID) {
            // Load from Info
            apputils.CONSOLE_LOG("LoadGas From Info")
            apputils.CONSOLE_LOG(AppConstants.CURRENT_VEHICLE_ID)
            let currentVehicle = this.props.userData.vehicleList.find(item => item.id == AppConstants.CURRENT_VEHICLE_ID);
            this.currentVehicle = currentVehicle;
            
            for (let i = 0; i < currentVehicle.fillGasList.length; i++) {
                if (currentVehicle.fillGasList[i].id == AppConstants.CURRENT_EDIT_FILL_ID) {
                    this.isEditing = true;

                    this.isEditOverMaxMeter = false;
                    if (currentVehicle.maxMeter>0 && currentVehicle.fillGasList[i].currentKm > currentVehicle.maxMeter) {
                        this.isEditOverMaxMeter = true;
                    }
                    this.setState({
                        ...currentVehicle.fillGasList[i],
                        vehicleId: AppConstants.CURRENT_VEHICLE_ID,
                        id: AppConstants.CURRENT_EDIT_FILL_ID,
                        fillDate:currentVehicle.fillGasList[i].fillDate,
                        currentKm: (currentVehicle.maxMeter>0 && currentVehicle.fillGasList[i].currentKm > currentVehicle.maxMeter) ? 
                            (currentVehicle.fillGasList[i].currentKm - currentVehicle.maxMeter - 1):
                            currentVehicle.fillGasList[i].currentKm
                    })
                }
            }
        } else {
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
            apputils.CONSOLE_LOG("WIll Edit FillGas:")
            if (!this.isEditOverMaxMeter) {
                curMaxMeter = 0;
            }
            let newData = {
                ...this.state,

                vehicleId: (this.state.vehicleId),
                fillDate: this.state.fillDate,
                amount: Number(this.state.amount),
                price: Number(this.state.price),
                currentKm: Number(this.state.currentKm)+curMaxMeter
            }
            if (curMaxMeter) {
                newData.maxMeter = curMaxMeter;
            }

            this.props.actVehicleEditFillItem(newData, AppConstants.FILL_ITEM_GAS, this.props.userData)
            this.props.navigation.goBack()
        } else {
            apputils.CONSOLE_LOG("WIll Save Fill Gas:")
            let newData = {
                ...this.state,

                vehicleId: (this.state.vehicleId),
                fillDate: this.state.fillDate,
                amount: Number(this.state.amount),
                price: Number(this.state.price),
                currentKm: Number(this.state.currentKm)+curMaxMeter
            }
            if (curMaxMeter) {
                newData.maxMeter = curMaxMeter;
            }

            newData.id = "gas-"+this.state.vehicleId+"-"+apputils.uuidv4();
            apputils.CONSOLE_LOG(JSON.stringify(newData))
            // set Current VE ID so can ComeBack VehicleDetail
            AppConstants.CURRENT_VEHICLE_ID = this.state.vehicleId;

            this.props.actVehicleAddFillItem(newData, AppConstants.FILL_ITEM_GAS, this.props.userData)

            this.props.navigation.navigate('VehicleDetail', 
                {vehicleId: this.state.vehicleId, isMyVehicle: true})
        }
    }
    save() {
        // Validate 
        if (!this.state.vehicleId || !this.state.price || !this.state.currentKm) {
            Toast.show({
                text: AppLocales.t("TOAST_NEED_FILL_ENOUGH"),
                //buttonText: "Okay",
                position: "top",
                type: "danger"
            })
        } else {
            // Found Previous KM 
            // const currentVehicle = this.props.userData.vehicleList.find(item => 
            //     item.id == this.state.vehicleId);
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
                let limitKm = 95000; // bike
                if (currentVehicle.type == "car") {
                    limitKm = 990000;
                }

                if (!theMaxMeter && currentKm < 5000 && prevItem.currentKm > limitKm) {
                    // Validate Current KM if Over Max Odometer. 
                    Alert.alert(
                        "Km hiện tại (" + currentKm + ") nhỏ hơn lần trước (" + prevItem.currentKm + ") rất nhiều.",
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
        let theDate = new Date(this.state.fillDate);
        let today = new Date();
        if (today.getFullYear() == theDate.getFullYear && today.getMonth() == theDate.getMonth() &&
                today.getDate() == theDate.getDate()) {
            var datePlaceHoder = AppLocales.t("GENERAL_TODAY")+"(" + apputils.formatDateMonthDayYearVNShort(theDate) + ")";
        } else {
            var datePlaceHoder = apputils.formatDateMonthDayYearVNShort(theDate);
        }

        apputils.CONSOLE_LOG("000000000 this.isEditing && this.initialEditKm:" + this.isEditing +","+ this.initialEditKm)
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
                        onValueChange={(item) => this.onChooseVehicle(item)}
                        enabled={this.isEditing?false:true}
                    >
                        {this.props.userData.vehicleList.map(item => (
                            <Picker.Item label={item.brand + " " + item.model + " " + item.licensePlate}
                                value={item.id} key={item.id}/>
                        ))}
                    </Picker>
                </View>

                <View style={styles.rowContainer}>
                    <Item stackedLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                    <View style={{flexDirection:"row", alignSelf:"flex-start"}}>
                        <Label>{AppLocales.t("NEW_GAS_FILLDATE")}</Label>
                        {!this.state.fillDate ?
                        <Label style={{color: "red"}}>*</Label>
                        : null}
                    </View>
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
                {/* <View style={styles.rowContainer}>
                    <Item inlineLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                    <Label style={styles.rowLabel}>{AppLocales.t("NEW_GAS_AMOUNT")+": "}</Label>
                    <Input
                        style={styles.rowForm}
                        keyboardType="numeric"
                        onChangeText={(amount) => this.setState({amount})}
                        value={""+this.state.amount}
                    />
                    </Item>
                </View> */}

                <View style={styles.rowContainer}>
                    <Item stackedLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                    <View style={{flexDirection:"row", alignSelf:"flex-start"}}>
                        <Label>{AppLocales.t("NEW_GAS_PRICE")}</Label>
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
                        <Label>{AppLocales.t("NEW_GAS_CURRENTKM")}
                        </Label>
                        {!this.state.currentKm ?
                        <Label style={{color: "red"}}>*</Label>
                        : null}
                    </View>
                    <Label>
                        {(this.currentVehicle&&this.currentVehicle.maxMeter>0&&
                        (!this.isEditing || (this.isEditing && this.isEditOverMaxMeter))) ? 
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

                <View style={styles.rowContainer}>
                    <Item stackedLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                    <View style={{flexDirection:"row", alignSelf:"flex-start"}}>
                        <Label>{AppLocales.t("NEW_GAS_REMARK")}</Label>
                    </View>

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

FillGasScreen.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={{backgroundColor: AppConstants.COLOR_HEADER_BG, marginTop:-AppConstants.DEFAULT_IOS_STATUSBAR_HEIGHT}}>
          <Left>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" style={{color:"white"}}/>
            </Button>
          </Left>
          <Body>
            <Title><HeaderText>{AppLocales.t("NEW_GAS_HEADER")}</HeaderText></Title>
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
    flex: 2,
    borderBottomColor: "rgb(210, 210, 210)",
    borderBottomWidth: 0.5,
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
  }
});

const mapStateToProps = (state) => ({
    userData: state.userData
});
const mapActionsToProps = {
    actVehicleAddFillItem, actVehicleEditFillItem
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(FillGasScreen);
