import React from 'react';
import { View, StyleSheet, TextInput, Clipboard, Platform, KeyboardAvoidingView } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Content, Form, Icon, 
    Item, Picker, Button, Text, Input,Label, Toast, CheckBox } from 'native-base';

import AppConstants from '../../constants/AppConstants'
import { HeaderText } from '../../components/StyledText';
import { connect } from 'react-redux';
import {actUserCreateTeamOK} from '../../redux/UserReducer'
import Backend from '../../constants/Backend'
import apputils from '../../constants/AppUtils';
import AppLocales from '../../constants/i18n';
import NetInfo from "@react-native-community/netinfo";
import { TouchableOpacity } from 'react-native-gesture-handler';
import QRCode from 'react-native-qrcode-svg';

class CreateTeamScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            code: "",
            id: 0,
            canMemberViewReport: false,
            excludeMyCar: false
        };

        this.handleCreate = this.handleCreate.bind(this)
        this.toogleMemberCanViewReport = this.toogleMemberCanViewReport.bind(this)
        this.toggleExcludeMyCar = this.toggleExcludeMyCar.bind(this)
        
        
    }

    componentWillMount() {
        if (this.props.navigation.state.params.isEdit) {
            // Edit mode
            if (this.props.userData.teamInfo && this.props.userData.teamInfo.code) {
                this.setState({
                    name: this.props.userData.teamInfo.name,
                    code: this.props.userData.teamInfo.code,
                    id: this.props.userData.teamInfo.id,
                    canMemberViewReport: this.props.userData.teamInfo.canMemberViewReport,
                    excludeMyCar: this.props.userData.teamInfo.excludeMyCar ? true : false
                })
            }
        } else {
            this.setState({
                code: apputils.makeRandomAlphaNumeric(12)
            })
        }
    }
    toogleMemberCanViewReport() {
        this.setState({
            canMemberViewReport: !this.state.canMemberViewReport
        })
    }
    toggleExcludeMyCar() {
        this.setState({
            excludeMyCar: !this.state.excludeMyCar
        })
    }
    handleCreate() {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                if (!this.state.name || !this.state.code) {
                    Toast.show({
                        text: AppLocales.t("TOAST_NEED_FILL_ENOUGH"),
                        //buttonText: "Okay",
                        position: "top",
                        type: "danger"
                    })
                } else {
                    if (this.props.navigation.state.params.isEdit) {
                        // Edit TEam NAme
                        Backend.createTeam({
                            id: this.state.id,
                            name: this.state.name,
                            code: this.state.code,
                            canMemberViewReport: this.state.canMemberViewReport,
                            excludeMyCar: this.state.excludeMyCar
                            }, this.props.userData.token, 
                            response => {
                                apputils.CONSOLE_LOG("Edit Team OK")
                                apputils.CONSOLE_LOG(response.data)
                                this.props.actUserCreateTeamOK(response.data)
                                this.props.navigation.navigate("Settings")
                            },
                            error => {
                                apputils.CONSOLE_LOG("Edit Team ERROR")
                                apputils.CONSOLE_LOG((error))
                                // TODO: Toast
                                
                            }
                        );
                    } else {
                        // Create new Team
                        Backend.createTeam({
                            name: this.state.name,
                            code: this.state.code,
                            canMemberViewReport: this.state.canMemberViewReport,
                            excludeMyCar: this.state.excludeMyCar
                            }, this.props.userData.token, 
                            response => {
                                apputils.CONSOLE_LOG("REgister Team OK")
                                apputils.CONSOLE_LOG(response.data)
                                this.props.actUserCreateTeamOK(response.data)
                                //this.props.navigation.navigate("Settings")
                                this.props.navigation.goBack()
                            },
                            error => {
                                apputils.CONSOLE_LOG("Register Team ERROR")
                                apputils.CONSOLE_LOG((error.response.data))
                                // TODO: Toast
                                Toast.show({
                                    text: error.response.data.msg,
                                    position: "top",
                                    //buttonText: "Okay",
                                    type: "danger"
                                })
                                this.props.navigation.goBack()
                            }
                        );
                    }
                }
            } else {
              Toast.show({
                text: AppLocales.t("TOAST_NEED_INTERNET_CON"),
                //buttonText: "Okay",
                position: "top",
                type: "danger"
              })
            }
        });
        
       
    }
    render() {
        apputils.CONSOLE_LOG("******TEam info")
        apputils.CONSOLE_LOG(this.state)
        let logoFromFile = require('../../assets/images/icon.png');
        return (
            <Container>
            <KeyboardAvoidingView style={{flex: 1, justifyContent: 'center'}} keyboardVerticalOffset={100} 
                behavior={Platform.OS === "ios" ? 'padding' : 'height'}>
            <Content>
                <View style={styles.formContainer}>
                    <View style={styles.rowContainer}>
                        <Item stackedLabel>
                        <Label>{AppLocales.t("GENERAL_NAME")+" "+AppLocales.t("GENERAL_TEAM")}
                        </Label>
                        <Input
                            style={styles.rowForm}
                            onChangeText={(name) => this.setState({name})}
                            value={this.state.name}
                        />
                        </Item>
                    </View>

                    <View style={{...styles.rowContainer, flexDirection:"column", alignItems:"flex-start"}}>
                        <Label style={{color: AppConstants.COLOR_TEXT_DARKDER_INFO, fontSize: 15}}>{AppLocales.t("GENERAL_TEAM_CODE_SHORT")+" ("+
                            AppLocales.t("GENERAL_RANDOM")+")"}
                        </Label>
                        <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                            <Input
                                disabled
                                style={{...styles.rowForm, backgroundColor: AppConstants.COLOR_GREY_LIGHT_BG}}
                                value={this.state.code}
                            />
                            <TouchableOpacity 
                                onPress={() => {
                                    Toast.show({
                                    text: AppLocales.t("TOAST_SUCCESS_COPIED"),
                                    //buttonText: "Okay",
                                    position: "top",
                                    type: "success"
                                    })
                                    Clipboard.setString(this.state.code)
                                }}>
                                <Icon type="FontAwesome5" name="copy" 
                                style={{fontSize: 28, color: "grey", alignSelf:"center", marginLeft: 5}}/>
                            </TouchableOpacity>
                        </View>
                    </View>

                    
                    <View style={{flexDirection: "row", justifyContent:"flex-start",
                        marginLeft: -10, marginTop: 15, marginBottom: 10}}>
                        <CheckBox checked={this.state.canMemberViewReport}
                            onPress={() => this.toogleMemberCanViewReport()}/>
                        <TouchableOpacity onPress={() => this.toogleMemberCanViewReport()}>
                        <Text style={{marginLeft: 12, fontSize: 13}}>
                            {AppLocales.t("SETTING_LBL_CREATE_TEAM_MEM_CANVIEWREPORT")}
                        </Text>
                        </TouchableOpacity>
                    </View>


                    
                    <View style={{flexDirection: "row", justifyContent:"flex-start",
                        marginLeft: -10, marginTop: 15, marginBottom: 10}}>
                        <CheckBox checked={this.state.excludeMyCar}
                            onPress={() => this.toggleExcludeMyCar()}/>
                        <TouchableOpacity onPress={() => this.toggleExcludeMyCar()}>
                        <Text style={{marginLeft: 12, fontSize: 13}}>
                            {AppLocales.t("SETTING_LBL_CREATE_TEAM_EXCLUDE_MYCAR")}
                        </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{alignItems:"center", marginTop: 10}}>
                        <QRCode
                            value={this.state.code}
                            logo={logoFromFile}
                            logoSize={25}
                            size={250}
                        />
                        <Text style={{alignSelf:"center", color: AppConstants.COLOR_TEXT_LIGHT_INFO,
                            fontSize: 14,marginTop: 5, fontStyle:"italic"}}>
                                Hãy quét QR trên để lấy Mã Nhóm khi muốn Gia Nhập
                        </Text>
                    </View>

                    <View style={styles.rowButton}>
                    <Button
                        rounded style={{backgroundColor: AppConstants.COLOR_HEADER_BG}}
                        onPress={() => this.handleCreate()}
                    >
                        <Text>
                        {this.props.navigation.state.params.isEdit ? (
                            AppLocales.t("GENERAL_EDITDATA")
                        ): (
                            AppLocales.t("SETTING_LBL_CREATE_TEAM")
                        )}
                        </Text></Button>
                    </View>

                </View>
            </Content>
            </KeyboardAvoidingView>
            </Container>
        );
    }
}

CreateTeamScreen.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={{backgroundColor: AppConstants.COLOR_HEADER_BG, marginTop:-AppConstants.DEFAULT_IOS_STATUSBAR_HEIGHT}}>
          <Left>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" style={{color:"white"}}/>
            </Button>
          </Left>
          <Body>
            <Title><HeaderText>
                {navigation.state.params.isEdit ? (
                    AppLocales.t("SETTING_LBL_EDIT_TEAM")
                ): (
                    AppLocales.t("SETTING_LBL_CREATE_TEAM")
                )}
            </HeaderText></Title>
          </Body>
          <Right />
        </Header>
    )
});

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    paddingTop: 5,
    paddingBottom: 40,
    paddingHorizontal: AppConstants.DEFAULT_FORM_PADDING_HORIZON,
    backgroundColor: '#fff',
    flexDirection: "column"
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center", // vertial align
    width: AppConstants.DEFAULT_FORM_WIDTH,
    marginTop: 12,
  },
  rowContainerDisable: {
    marginTop: 7,
    paddingTop: 12,
    flexDirection: "row",
    alignItems: "center", // vertial align
    backgroundColor: AppConstants.COLOR_GREY_LIGHT_BG,
    marginTop: 12,
  },
  rowLabel: {
    flex: 1,
    textAlign: "right",
    paddingRight: 5
  },
  rowForm: {
    flex: 2
  },
  rowButton: {
    marginTop: 20,
    alignSelf: "center",
  },
  btnSubmit: {

  }
});

const mapStateToProps = (state) => ({
    userData: state.userData
});
const mapActionsToProps = {
    actUserCreateTeamOK
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(CreateTeamScreen);
