import React from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Content, Form, Icon, Item, 
    Picker, Button, Text, Segment,Label, ListItem, CheckBox, H3,Tab, TabHeading, Tabs } from 'native-base';

import {HeaderText, WhiteText} from '../../components/StyledText'
import AppConstants from '../../constants/AppConstants'
import Layout from '../../constants/Layout';
import { connect } from 'react-redux';
import {actCustomDelServiceModule, actCustomDelServiceModuleBike} from '../../redux/UserReducer'
import apputils from '../../constants/AppUtils';
import AppLocales from '../../constants/i18n';

class SettingServiceScreenModules extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //serviceModule: [], // Bo Phan cua Xe Sua Chua
            serviceModule: {}, // DauMay: Thay Thế|Bảo Dưỡng|Kiểm Tra
        };

        this.onDeleteModule = this.onDeleteModule.bind(this)
        this.onChangeTab = this.onChangeTab.bind(this)
    }

    componentWillMount() {
        AppConstants.TEMPDATA_CREATESERVICEMODULE_ISBIKE = false;
    }

    // type: T, K, B
    onDeleteModule(item, isBike) {
        Alert.alert(
            AppLocales.t("MSG_REMOVE_CONFIRM"),
            ""+item.name,
            [
                {
                  text: AppLocales.t("GENERAL_NO"),
                  onPress: () => apputils.CONSOLE_LOG('Cancel Pressed'),
                  style: 'cancel',
                },
                {text: AppLocales.t("GENERAL_YES"), style: 'destructive' , onPress: () => {
                    if (isBike) {
                        apputils.CONSOLE_LOG("   Will delete SERvice module BIKE:" + item.name)
                        this.props.actCustomDelServiceModuleBike(item)
                    } else {
                        apputils.CONSOLE_LOG("   Will delete SERvice module CAR:" + item.name)
                        this.props.actCustomDelServiceModule(item)
                    }
                }},
            ],
            {cancelable: true}
        )
    }
    onChangeTab(param) {
        if (param.i == 1) {
            // Bike
            AppConstants.TEMPDATA_CREATESERVICEMODULE_ISBIKE = true;
        } else {
            AppConstants.TEMPDATA_CREATESERVICEMODULE_ISBIKE = false;
        }
    }

    render() {
        let customView = [];
        if (this.props.userData.customServiceModules&& this.props.userData.customServiceModules.length >0) {
            customView.push(
                <Text style={styles.textHeadingRow} key="userdefined">
                    {AppLocales.t("SETTING_SERVICEMODULEHEAD_USERDEFINED")}</Text>
            )

            this.props.userData.customServiceModules.forEach((item,idx) => {
                customView.push(
                    <ListItem key={item.name+idx}
                            style={{marginLeft: 5}}>
                        
                        <Body style={{flexDirection:"row", alignItems: "center"}}>
                            <Text style={{fontSize: 16, minWidth: Layout.window.width * 0.5}}>{item.name}</Text>
                        </Body>

                        <Right>
                            <TouchableOpacity 
                                onPress={() => this.onDeleteModule(item, AppConstants.TEMPDATA_CREATESERVICEMODULE_ISBIKE)}>
                                <Icon type="MaterialIcons" name="delete" style={styles.listItemDeleteIcon}/>
                            </TouchableOpacity>
                        </Right>
                    </ListItem>
                )
            })

            customView.push(
                <Text style={styles.textHeadingRow} key="systemdefined">
                    {AppLocales.t("SETTING_SERVICEMODULEHEAD_SYSTEMDEFINED")}</Text>
            )
        }

        let customViewBike = [];
        if (this.props.userData.customServiceModulesBike && 
                this.props.userData.customServiceModulesBike.length >0) {
            customViewBike.push(
                <Text style={styles.textHeadingRow} key="userdefined">
                    {AppLocales.t("SETTING_SERVICEMODULEHEAD_USERDEFINED")}</Text>
            )

            this.props.userData.customServiceModulesBike.forEach((item,idx) => {
                customViewBike.push(
                    <ListItem key={item.name+idx}
                            style={{marginLeft: 5}}>
                        
                        <Body style={{flexDirection:"row", alignItems: "center"}}>
                            <Text style={{fontSize: 16, minWidth: Layout.window.width * 0.5}}>{item.name}</Text>
                        </Body>

                        <Right>
                            <TouchableOpacity 
                                onPress={() => this.onDeleteModule(item, AppConstants.TEMPDATA_CREATESERVICEMODULE_ISBIKE)}>
                                <Icon type="MaterialIcons" name="delete" style={styles.listItemDeleteIcon}/>
                            </TouchableOpacity>
                        </Right>
                    </ListItem>
                )
            })

            customViewBike.push(
                <Text style={styles.textHeadingRow} key="systemdefined">
                    {AppLocales.t("SETTING_SERVICEMODULEHEAD_SYSTEMDEFINED")}</Text>
            )
        }

        return (
            <Container>
            <Tabs style={{flex: 1}} onChangeTab={this.onChangeTab}>
            <Tab heading={AppLocales.t("GENERAL_CAR")}
                tabStyle={{backgroundColor: AppConstants.COLOR_HEADER_BG}}
                activeTabStyle={{backgroundColor: AppConstants.COLOR_HEADER_BG}}>
            <Content>
                <View style={styles.formContainer}>
                {customView}
                {this.props.appData.typeService.map(item => (
                    <ListItem key={item.name}
                            style={{marginLeft: 5}}>

                        <Body style={{flexDirection:"row", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", flexGrow: 100}}>
                        <Text style={{fontSize: 16, minWidth: Layout.window.width * 0.2}}>{item.name}</Text>
                        
                        </Body>

                        <Right style={{flex: 0}}></Right>
                    </ListItem>
                ))} 

                </View>
            </Content>
            </Tab>

            <Tab heading={AppLocales.t("GENERAL_BIKE")}
                tabStyle={{backgroundColor: AppConstants.COLOR_HEADER_BG}}
                activeTabStyle={{backgroundColor: AppConstants.COLOR_HEADER_BG}}>
            <Content>
                <View style={styles.formContainer}>
                {customViewBike}
                {this.props.appData.typeServiceBike.map(item => (
                    <ListItem key={item.name}
                            style={{marginLeft: 5}}>

                        <Body style={{flexDirection:"row", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", flexGrow: 100}}>
                            <Text style={{fontSize: 16, minWidth: Layout.window.width * 0.2}}>{item.name}</Text>
                        </Body>

                        <Right style={{flex: 0}}></Right>
                    </ListItem>
                ))} 
                </View>
            </Content>
            </Tab>

            </Tabs>
            </Container>
        );
    }
}

SettingServiceScreenModules.navigationOptions = ({ navigation}) => ({
    header: (
        <Header style={{backgroundColor: AppConstants.COLOR_HEADER_BG, marginTop:-AppConstants.DEFAULT_IOS_STATUSBAR_HEIGHT}}>
          <Left style={{flex: 1}}>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" style={{color:"white"}}/>
            </Button>
          </Left>
          <Body  style={{flex: 4}}>
            <Title><HeaderText>{AppLocales.t("GENERAL_MAINTAIN_MODULE")}</HeaderText></Title>
          </Body>
          <Right style={{flex: 1}}>
            <Button transparent vertical onPress={() => {
                navigation.navigate("ServiceModuleCreate")
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
    actCustomDelServiceModule,actCustomDelServiceModuleBike
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(SettingServiceScreenModules);
