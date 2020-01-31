import React from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Content, Form, Icon, Item, Picker, Button, Text, Input,Label, DatePicker, Toast } from 'native-base';

import {HeaderText} from '../../components/StyledText'
import Layout from '../../constants/Layout';

import { connect } from 'react-redux';
import {actVehicleAddFillItem, actVehicleEditFillItem} from '../../redux/UserReducer'
import AppConstants from '../../constants/AppConstants';
import apputils from '../../constants/AppUtils';
import AppLocales from '../../constants/i18n';

class PayExpenseScreen extends React.Component {
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
            type: "expense",
            subType: "",
            remark: "",
        };
        this.save = this.save.bind(this)
    }

    componentWillMount() {
        if ((!this.props.navigation.state.params || !this.props.navigation.state.params.createNew) && AppConstants.CURRENT_EDIT_FILL_ID) {
            // Load from Info
            const currentVehicle = this.props.userData.vehicleList.find(item => item.id == AppConstants.CURRENT_VEHICLE_ID);
            for (let i = 0; i < currentVehicle.expenseList.length; i++) {
                if (currentVehicle.expenseList[i].id == AppConstants.CURRENT_EDIT_FILL_ID) {
                    this.setState({
                        ...currentVehicle.expenseList[i],
                        vehicleId: AppConstants.CURRENT_VEHICLE_ID,
                        id: AppConstants.CURRENT_EDIT_FILL_ID,
                        fillDate:currentVehicle.expenseList[i].fillDate,
                    })
                    this.isEditing = true;
                }
            }
        } else {
            // If There is No Current Vehicle ID, Set to the First 
            var defaultType = "";
            if (this.props.appData.typeExpense && this.props.appData.typeExpense.length > 0) {
                defaultType = this.props.appData.typeExpense[0].name;
            }
            if (!AppConstants.CURRENT_VEHICLE_ID || AppConstants.CURRENT_VEHICLE_ID == 0) {
                apputils.CONSOLE_LOG(this.props.userData.vehicleList)
                if (this.props.userData.vehicleList && this.props.userData.vehicleList.length > 0) {
                    apputils.CONSOLE_LOG(this.props.userData.vehicleList[0].id)
                    this.setState({
                        vehicleId: this.props.userData.vehicleList[0].id,
                        subType: defaultType
                    })
                    this.isEditing = false;
                }
            } else {
                this.setState({
                    vehicleId: AppConstants.CURRENT_VEHICLE_ID,
                    subType: defaultType
                })
                this.isEditing = false;
            }
        }
    }
    
    save = async (newVehicle) => {
        if (!this.state.vehicleId || !this.state.price || !this.state.subType) {
            Toast.show({
                text: AppLocales.t("TOAST_NEED_FILL_ENOUGH"),
                //buttonText: "Okay",
                position: "top",
                type: "danger"
            })
        } else {

            if ((!this.props.navigation.state.params || !this.props.navigation.state.params.createNew) && AppConstants.CURRENT_VEHICLE_ID) {
                apputils.CONSOLE_LOG("WIll Edit Expense:")
                let newData = {
                    ...this.state,

                    vehicleId: (this.state.vehicleId),
                    fillDate: this.state.fillDate,
                    price: Number(this.state.price)
                }

                this.props.actVehicleEditFillItem(newData, AppConstants.FILL_ITEM_EXPENSE, this.props.userData)
                this.props.navigation.goBack()
            } else {
                apputils.CONSOLE_LOG("WIll Save Expense:")
                let newData = {
                    ...this.state,
                    
                    vehicleId: (this.state.vehicleId),
                    fillDate: this.state.fillDate,
                    price: Number(this.state.price)
                }
                
                // let maxId = 0;
                // this.props.userData.expenseList.forEach(item => {
                //     if (maxId < item.id) {
                //         maxId = item.id
                //     }
                // })
                newData.id = "exp-"+this.state.vehicleId+"-"+apputils.uuidv4();
                apputils.CONSOLE_LOG(newData)
                // set Current VE ID so can ComeBack VehicleDetail
                AppConstants.CURRENT_VEHICLE_ID = this.state.vehicleId;
                this.props.actVehicleAddFillItem(newData, AppConstants.FILL_ITEM_EXPENSE, this.props.userData)

                this.props.navigation.navigate('VehicleDetail', {vehicleId: this.state.vehicleId, isMyVehicle: true})
            }
        }
    }

    render() {
        if (!this.state.vehicleId) {
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
        apputils.CONSOLE_LOG(this.state)
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
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({vehicleId: itemValue})
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
                        <Label>{AppLocales.t("NEW_GAS_FILLDATE")}</Label>
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
                        <Label>{AppLocales.t("NEW_EXPENSE_TYPE")}</Label>
                        <View style={styles.rowForm}>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down" />}
                                style={{width: AppConstants.DEFAULT_FORM_WIDTH}}
                                placeholderStyle={{ color: "#bfc6ea" }}
                                placeholderIconColor="#007aff"
                                selectedValue={this.state.subType}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState({subType: itemValue})
                                }
                            >
                                {this.props.appData.typeExpense.map(item => (
                                    <Picker.Item label={item.name} value={item.name} key={item.id}/>
                                ))}
                            </Picker>
                        </View>
                        </Item>
                    </View>

                    <View style={styles.rowContainer}>
                        <Item stackedLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                        <Label>{AppLocales.t("NEW_GAS_REMARK")}</Label>
                        <Input
                            style={styles.rowForm}
                            onChangeText={(remark) => this.setState({remark})}
                            value={this.state.remark}
                        />
                        </Item>
                    </View>

                    <View style={styles.rowButton}>
                        <Button primary rounded
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

PayExpenseScreen.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={{backgroundColor: AppConstants.COLOR_HEADER_BG, marginTop:-AppConstants.DEFAULT_IOS_STATUSBAR_HEIGHT}}>
          <Left>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" style={{color:"white"}}/>
            </Button>
          </Left>
          <Body>
            <Title><HeaderText>{AppLocales.t("NEW_EXPENSE_HEADER")}</HeaderText></Title>
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
    userData: state.userData,
    appData: state.appData
});
const mapActionsToProps = {
    actVehicleAddFillItem,
    actVehicleEditFillItem
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(PayExpenseScreen);
