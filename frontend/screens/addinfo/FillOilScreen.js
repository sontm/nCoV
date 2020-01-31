import React from 'react';
import { View, StyleSheet, TextInput, AsyncStorage } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Content, Form, Icon, Item, Picker, Button, Text, Input, 
    Label, DatePicker, Card, CardItem } from 'native-base';

    import {HeaderText} from '../../components/StyledText'
import { connect } from 'react-redux';
import {actVehicleAddFillItem, actVehicleEditFillItem} from '../../redux/UserReducer'
import AppConstants from '../../constants/AppConstants';
import apputils from '../../constants/AppUtils';
import AppLocales from '../../constants/i18n';
import Layout from '../../constants/Layout';

class FillOilScreen extends React.Component {
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
            validFor:"", // i.e Each Fill oil valid in 1000 KM, App will Remind
            type: "oil",
            subType: "",
            remark: "",
        };

        this.save = this.save.bind(this)
    }

    componentWillMount() {
        apputils.CONSOLE_LOG("FILL OIL WILL MOUNT:")
        apputils.CONSOLE_LOG(this.props.navigation.state.params)
        if ((!this.props.navigation.state.params || !this.props.navigation.state.params.createNew) && AppConstants.CURRENT_EDIT_FILL_ID) {
            // Load from Info
            const currentVehicle = this.props.userData.vehicleList.find(item => item.id == AppConstants.CURRENT_VEHICLE_ID);
            for (let i = 0; i < currentVehicle.fillOilList.length; i++) {
                if (currentVehicle.fillOilList[i].id == AppConstants.CURRENT_EDIT_FILL_ID) {
                    this.setState({
                        ...currentVehicle.fillOilList[i],
                        vehicleId: AppConstants.CURRENT_VEHICLE_ID,
                        id: AppConstants.CURRENT_EDIT_FILL_ID,
                        fillDate:currentVehicle.fillOilList[i].fillDate,
                    })
                }
            }
        } else {
            this.setState({
                vehicleId: AppConstants.CURRENT_VEHICLE_ID
            })
        }
    }
    
    save = async (newVehicle) => {
        if ((!this.props.navigation.state.params || !this.props.navigation.state.params.createNew) && AppConstants.CURRENT_VEHICLE_ID) {
            apputils.CONSOLE_LOG("WIll Edit FillOil:")
            let newData = {
                ...this.state,

                vehicleId: (this.state.vehicleId),
                fillDate: this.state.fillDate,
                amount: Number(this.state.amount),
                price: Number(this.state.price),
                currentKm: Number(this.state.currentKm),
                validFor: Number(this.state.validFor)
            }

            this.props.actVehicleEditFillItem(newData, AppConstants.FILL_ITEM_OIL, this.props.userData)
            this.props.navigation.goBack()
        } else {
            apputils.CONSOLE_LOG("WIll Save FillOil:")
            let newData = {
                ...this.state,
                
                vehicleId: (this.state.vehicleId),
                fillDate: this.state.fillDate,
                price: Number(this.state.price),
                currentKm: Number(this.state.currentKm),
                validFor: Number(this.state.validFor)
            }
            apputils.CONSOLE_LOG(newData)

            newData.id = apputils.uuidv4();

            this.props.actVehicleAddFillItem(newData, AppConstants.FILL_ITEM_OIL, this.props.userData)

            this.props.navigation.navigate('VehicleDetail',{vehicleId: this.state.vehicleId, isMyVehicle: true})
        }
    }

    render() {
        let theDate = new Date(this.state.fillDate);
        let today = new Date();
        if (today.getFullYear() == theDate.getFullYear && today.getMonth() == theDate.getMonth() &&
                today.getDate() == theDate.getDate()) {
            var datePlaceHoder = AppLocales.t("GENERAL_TODAY")+"(" + apputils.formatDateMonthDayYearVNShort(theDate) + ")";
        } else {
            var datePlaceHoder = apputils.formatDateMonthDayYearVNShort(theDate);
        }
        return (
            <Container>
            <Content>
                <View style={styles.formContainer}>
                    <View style={styles.rowContainer}>
                        <Picker
                            style={{width: (Layout.window.width-40)*0.9, borderColor: "#1f77b4",borderWidth: 0.3,
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
                            {this.props.userData.vehicleList.map(item => (
                                <Picker.Item label={item.brand + " " + item.model + " " + item.licensePlate}
                                    value={item.id} key={item.id}/>
                            ))}
                        </Picker>
                    </View>


                    <View style={styles.rowContainer}>
                        <Item inlineLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                        <Label style={styles.rowLabel}>{AppLocales.t("NEW_GAS_FILLDATE")+": "}</Label>
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
                        <Item inlineLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                        <Label style={styles.rowLabel}>{AppLocales.t("NEW_GAS_PRICE")+": "}</Label>
                        <Input
                            style={styles.rowForm}
                            keyboardType="numeric"
                            onChangeText={(price) => this.setState({price})}
                            value={""+this.state.price}
                        />
                        </Item>
                    </View>

                    <View style={styles.rowContainer}>
                        <Item inlineLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                        <Label style={styles.rowLabel}>{AppLocales.t("NEW_GAS_CURRENTKM")+": "}</Label>
                        <Input
                            style={styles.rowForm}
                            keyboardType="numeric"
                            onChangeText={(currentKm) => this.setState({currentKm})}
                            value={""+this.state.currentKm}
                        />
                        </Item>
                    </View>

                    <View style={styles.rowContainer}>
                        <Item inlineLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                        <Label style={styles.rowLabel}>{AppLocales.t("NEW_OIL_VALIDFOR")+": "}</Label>
                        <Input
                            style={styles.rowForm}
                            keyboardType="numeric"
                            onChangeText={(validFor) => this.setState({validFor})}
                            value={""+this.state.validFor}
                        />
                        </Item>
                    </View>
                    
                    <View style={styles.rowContainer}>
                        <Item inlineLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                        <Label style={styles.rowLabel}>{AppLocales.t("NEW_GAS_REMARK")+": "}</Label>
                        <Input
                            style={styles.rowForm}
                            onChangeText={(remark) => this.setState({remark})}
                            value={this.state.remark}
                        />
                        </Item>
                    </View>
                    
                    <View style={styles.rowButton}>
                    <Button
                        rounded style={{backgroundColor: AppConstants.COLOR_HEADER_BG}}
                        onPress={() => this.save(this.state)}
                    ><Text>{AppLocales.t("GENERAL_ADDDATA")}</Text></Button>
                    </View>

                    <View style={styles.rowNote}>
                        <Card>
                            <CardItem>
                            <Body style={{flexDirection:"row", justifyContent:"center"}}>
                                <Text>
                                {AppLocales.t("NOTE_VALIDFOR_OIL")}
                                </Text>
                            </Body>
                            </CardItem>
                        </Card>
                    </View>

                </View>
            </Content>
            </Container>
        );
    }
}

FillOilScreen.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={{backgroundColor: AppConstants.COLOR_HEADER_BG, marginTop:-AppConstants.DEFAULT_IOS_STATUSBAR_HEIGHT}}>
          <Left>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" style={{color:"white"}}/>
            </Button>
          </Left>
          <Body>
            <Title><HeaderText>{AppLocales.t("NEW_OIL_HEADER")}</HeaderText></Title>
          </Body>
          <Right />
        </Header>
    )
});

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    paddingTop: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    flexDirection: "column"
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "flex-end", // vertial align
    justifyContent: "center",
    height: 50,
    width: "96%",
    alignSelf:"center"
  },
  rowLabel: {
    flex: 2,
    textAlign: "right",
    paddingRight: 5,
    color: "rgb(120, 120, 120)",
    fontSize:15
  },
  rowForm: {
    flex: 3,
    borderBottomColor: "rgb(230, 230, 230)",
    borderBottomWidth: 0.5
  },
  rowButton: {
    marginTop: 20,
    alignSelf: "center",
  },

  rowNote: {
    marginTop: 20,
    alignSelf:"center",
    width: "96%",
  },
  btnSubmit: {

  }
});

const mapStateToProps = (state) => ({
    userData: state.userData
});
const mapActionsToProps = {
    actVehicleAddFillItem,
    actVehicleEditFillItem
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(FillOilScreen);
