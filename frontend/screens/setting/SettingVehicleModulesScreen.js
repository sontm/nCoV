import React from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Content, Form, Icon, Item, 
    Picker, Button, Text, Segment,Label, ListItem, CheckBox, H3,Tab, TabHeading, Tabs } from 'native-base';

import {HeaderText, WhiteText, NoDataText} from '../../components/StyledText'
import AppConstants from '../../constants/AppConstants'
import Layout from '../../constants/Layout';
import { connect } from 'react-redux';
import {actUserDelNewVehicleModel} from '../../redux/UserReducer'
import apputils from '../../constants/AppUtils';
import AppLocales from '../../constants/i18n';

class SettingVehicleModulesScreen extends React.Component {
    constructor(props) {
        super(props);
        this.onDeleteModule = this.onDeleteModule.bind(this)
        this.onChangeTab = this.onChangeTab.bind(this)
    }
    componentWillMount() {
        AppConstants.TEMPDATA_CREATESERVICEMODULE_ISBIKE = false;
    }
    onChangeTab(param) {
        if (param.i == 1) {
            // Bike
            AppConstants.TEMPDATA_CREATESERVICEMODULE_ISBIKE = true;
        } else {
            AppConstants.TEMPDATA_CREATESERVICEMODULE_ISBIKE = false;
        }
    }

    onDeleteModule(brand, model, isBike) {
        Alert.alert(
            AppLocales.t("MSG_REMOVE_CONFIRM"),
            ""+brand + " " + model,
            [
                {
                  text: AppLocales.t("GENERAL_NO"),
                  onPress: () => {},
                  style: 'cancel',
                },
                {text: AppLocales.t("GENERAL_YES"), style: 'destructive' , onPress: () => {
                    if (isBike) {
                        this.props.actUserDelNewVehicleModel({brand, model, isBike})
                    } else {
                        this.props.actUserDelNewVehicleModel({brand, model, isBike})
                    }
                }},
            ],
            {cancelable: true}
        )
        
    }
    render() {
        let carView = [];
        let bikeView = [];
        this.props.userData.customVehicleModel.forEach(item => {
            if (item.type == "car" && item.models && item.models.length > 0) {
                item.models.forEach(m => {
                    carView.push(
                        <ListItem key={m.name+item.name}
                            style={{marginLeft: 3}}>
        
                        <Body style={{flex: 5}}>
                            <Text style={{fontSize: 16}}>{item.name+" " + m.name}</Text>
                        </Body>
        
                        <Right style={{flex: 1}}>
                            <TouchableOpacity 
                                onPress={() => this.onDeleteModule(item.name, m.name, AppConstants.TEMPDATA_CREATESERVICEMODULE_ISBIKE)}>
                                <Icon type="MaterialIcons" name="delete" style={styles.listItemDeleteIcon}/>
                            </TouchableOpacity>
                        </Right>
                    </ListItem>)
                })
            } else if (item.type == "bike" && item.models && item.models.length > 0) {
                item.models.forEach(m => {
                    bikeView.push(
                        <ListItem key={m.name+item.name}
                            style={{marginLeft: 3}}>
        
                        <Body style={{flex: 5}}>
                            <Text style={{fontSize: 16}}>{item.name+" " + m.name}</Text>
                        </Body>
        
                        <Right style={{flex: 1}}>
                            <TouchableOpacity 
                                onPress={() => this.onDeleteModule(item.name, m.name, AppConstants.TEMPDATA_CREATESERVICEMODULE_ISBIKE)}>
                                <Icon type="MaterialIcons" name="delete" style={styles.listItemDeleteIcon}/>
                            </TouchableOpacity>
                        </Right>
                    </ListItem>)
                })
            }
        })
        if (carView.length == 0) {
            carView.push(<NoDataText key="car"/>)
        }
        if (bikeView.length == 0) {
            bikeView.push(<NoDataText  key="bike"/>)
        }
        return (
            <Container>
            <Tabs style={{flex: 1}} onChangeTab={this.onChangeTab}>
            <Tab heading={AppLocales.t("GENERAL_CAR")}
                tabStyle={{backgroundColor: AppConstants.COLOR_HEADER_BG}}
                activeTabStyle={{backgroundColor: AppConstants.COLOR_HEADER_BG}}>
            <Content>
                <View style={styles.formContainer}>
                {carView}
                </View>
            </Content>
            </Tab>

            <Tab heading={AppLocales.t("GENERAL_BIKE")}
                tabStyle={{backgroundColor: AppConstants.COLOR_HEADER_BG}}
                activeTabStyle={{backgroundColor: AppConstants.COLOR_HEADER_BG}}>
            <Content>
                <View style={styles.formContainer}>
                {bikeView}
                </View>
            </Content>
            </Tab>

            </Tabs>
            </Container>
        );
    }
}

SettingVehicleModulesScreen.navigationOptions = ({ navigation}) => ({
    header: (
        <Header style={{backgroundColor: AppConstants.COLOR_HEADER_BG, marginTop:-AppConstants.DEFAULT_IOS_STATUSBAR_HEIGHT}}>
          <Left style={{flex: 1}}>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" style={{color:"white"}}/>
            </Button>
          </Left>

          <Body  style={{flex: 4}}>
            <Title><HeaderText>{AppLocales.t("SETTING_LBL_VEHICLE_MODELS_TITLE")}</HeaderText></Title>
          </Body>

          <Right style={{flex: 1}}>
            <Button transparent vertical onPress={() => {
                navigation.navigate("CreateVehicleModel")
            }}>
              <Icon type="AntDesign" name="plus" />
              <WhiteText style={styles.smallerText}>{AppLocales.t("GENERAL_ADD")}</WhiteText>
            </Button>
          </Right>
        </Header>
    )
});

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    //paddingTop: 15,
    paddingHorizontal: 3,
    backgroundColor: '#fff',
    flexDirection: "column"
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center", // vertial align
    justifyContent: "center",
    //height: 54,
    width: "90%",
    alignSelf:"center"
    
  },
  rowLabel: {
    flex: 1,
    textAlign: "right",
    paddingRight: 5,
    color: "rgb(120, 120, 120)"
  },
  rowForm: {
    flex: 2,
    borderBottomColor: "rgb(230, 230, 230)",
    borderBottomWidth: 0.5
  },
  rowButton: {
    marginTop: 20,
    alignSelf: "center",
  },
  btnSubmit: {

  },
  textHeadingRow: {
    flexDirection: "row",
    paddingTop: 10,
    paddingBottom: 5,
    justifyContent: "flex-start",
    flexWrap: "wrap",
    flexGrow: 100,
    marginLeft: 0,
    paddingLeft: 5,
    backgroundColor: AppConstants.COLOR_GREY_LIGHT_BG,
    fontSize: 20
  },

  smallerText: {
      fontSize: 10
  },

  activeSegment2: {
    //backgroundColor: AppConstants.COLOR_BUTTON_BG,
    backgroundColor: "white",
    color:AppConstants.COLOR_BUTTON_BG,
    borderColor: "white"
  },
  inActiveSegment2: {
    backgroundColor: "#aec7e8",
    color:AppConstants.COLOR_PICKER_TEXT,
    borderColor: "white"
  },
  activeSegmentText2: {
      //color:"white",
      color:AppConstants.COLOR_GOOGLE,
      fontSize: 12,
      textDecorationLine: "underline",
      fontWeight: "bold",
      marginLeft: 3,
      marginRight: 3,
  },
  inActiveSegmentText2: {
      color:AppConstants.COLOR_PICKER_TEXT,
      fontSize: 12,
      padding: 0,
      margin: 0,
      marginLeft: 3,
      marginRight: 3,
  },

  listItemDeleteIcon: {
    color: "rgb(250, 100, 100)",
    fontSize: 20
  },

});

const mapStateToProps = (state) => ({
    userData: state.userData,
    appData: state.appData
});
const mapActionsToProps = {
    actUserDelNewVehicleModel
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(SettingVehicleModulesScreen);
