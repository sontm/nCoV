import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Content, Form, Icon, Item, Picker, 
    Button, Text, Input, Label, Card, CardItem, Alert, Toast } from 'native-base';

import AppConstants from '../../constants/AppConstants'
import { HeaderText } from '../../components/StyledText';
import { connect } from 'react-redux';
import {actUserCreateTeamOK, actUserGotMyJoinRequest} from '../../redux/UserReducer'
import {actUserStartSyncTeam,actUserStartSyncTeamDone, actUserForCloseModal} from '../../redux/UserReducer'

import {actTeamGetDataOK, actTeamGetJoinRequestOK} from '../../redux/TeamReducer'

import Backend from '../../constants/Backend'
import apputils from '../../constants/AppUtils';
import AppLocales from '../../constants/i18n';
import NetInfo from "@react-native-community/netinfo";
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Layout from '../../constants/Layout';

class JoinTeamScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            code: "",
            teamsByMe: [],
            cameraPermission: false,
            barCodeOpened: false,
            teamCodeScanned: false
        };

        this.handleSubmit = this.handleSubmit.bind(this)
    }
    async componentWillMount() {

        // Get all team created by this User
        // TODO, send teamCode here......
        Backend.getTeamsCreatedByMe(this.props.userData.token,
            response2 => {
                apputils.CONSOLE_LOG(response2.data)
                this.setState({
                    teamsByMe: response2.data
                })
            }, error => {
                apputils.CONSOLE_LOG("getTeamsCreatedByMe ERROR")
            })

            const { status: existingStatus } = await Permissions.getAsync(
                Permissions.CAMERA
            );
            apputils.CONSOLE_LOG("existingCameraStatus:" + existingStatus)
            if (existingStatus =="granted") {
                this.setState({
                    cameraPermission: true
                })
            }

        
    }
    onReJoinTeamOfMe(item) {
        if (item && item.code) {
            NetInfo.fetch().then(state => {
                if (state.isConnected) {
                    Backend.rejoinTeam({code: item.code}, this.props.userData.token,
                        response => {
                            apputils.CONSOLE_LOG("===============onReJoinTeamOfMe Data")
                            apputils.CONSOLE_LOG(response.data)
                            // Rejoin team can ReUse Create Team
                            this.props.actUserCreateTeamOK(response.data)
                            // Sync Team Data heare also
                            // TODO Message of Syncing here
                            Backend.getAllUserOfTeam({teamId: this.props.userData.userProfile.teamId}, this.props.userData.token,
                            response2 => {
                                apputils.CONSOLE_LOG("GEt all Member in Team OK")
    
                                this.props.actTeamGetDataOK(response2.data, this.props.userData, this.props.teamData, this.props)
                            },
                            error => {
                                apputils.CONSOLE_LOG("GEt all Member in Team ERROR")
                                apputils.CONSOLE_LOG(JSON.stringify(error))
                                this.setState({
                                    message: "Get Team Data Error!"
                                })
                            }
                            );
                    
                            Backend.getAllJoinTeamRequest(this.props.userData.token, 
                            response3 => {
                                apputils.CONSOLE_LOG("GEt all JoinRequest OK")
                                this.props.actTeamGetJoinRequestOK(response3.data)
                            },
                            error => {
                                apputils.CONSOLE_LOG("GEt all JoinRequest JoinTeam ERROR")
                                apputils.CONSOLE_LOG(JSON.stringify(error))
                                this.setState({
                                    message: "Login Error!"
                                })
                            })

                            this.props.navigation.goBack()
                        }, err => {
                            apputils.CONSOLE_LOG("rejoinTeam ERROR")
                    })
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
    }
    handleSubmit() {
        if (!this.state.code) {
            Toast.show({
                text: AppLocales.t("TOAST_NEED_FILL_ENOUGH"),
                //buttonText: "Okay",
                position: "top",
                type: "danger"
            })
        } else {
            NetInfo.fetch().then(state => {
                if (state.isConnected) {
                    Backend.joinTeam({
                        teamCode: this.state.code
                        }, this.props.userData.token, 
                        response => {
                            apputils.CONSOLE_LOG("Join Team OK")
                            apputils.CONSOLE_LOG(response.data)
                            //this.props.actUserCreateTeamOK(response.data)
                            //this.props.navigation.navigate("Settings")
                            this.props.actUserGotMyJoinRequest(response.data)
                            


                            this.props.navigation.goBack()
                            Toast.show({
                                text: "Yêu cầu gia nhập nhóm đã được gửi đi, xin hãy đợi Quản Lý của nhóm thông qua.",
                                //buttonText: "Okay",
                                position: "top",
                                type: "success",
                                duration: 3000
                            })
                        },
                        error => {
                            apputils.CONSOLE_LOG("Join Team ERROR")
                            apputils.CONSOLE_LOG((error.response.data))
                            Toast.show({
                                text: error.response.data.msg,
                                //buttonText: "Okay",
                                position: "top",
                                type: "danger"
                            })
                        }
                    );
                } else {
                    Toast.show({
                      text: AppLocales.t("TOAST_NEED_INTERNET_CON"),
                      //buttonText: "Okay",
                      position: "top",
                      type: "danger"
                    })
                }
            }) 
        };
    }

    async requestQRScanner() {
        if (!this.state.cameraPermission) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA);
            apputils.CONSOLE_LOG("status")
            if (status =="granted") {
                this.setState({
                    cameraPermission: true,
                    barCodeOpened: true,
                    teamCodeScanned: false
                })
            }
        } else {
            this.setState({
                barCodeOpened: !this.state.barCodeOpened,
                teamCodeScanned: false
            })
        }
    }
    handleBarcodeScanned = ( result ) => {
        apputils.CONSOLE_LOG(JSON.stringify(result)); // PRINTS UNDEFINED - passing in ({ type, data }) and trying to apputils.CONSOLE_LOG(data + type) throws: undefined is not an object (evaluating '_ref.type')
        if (result.data && result.data.length > 10) {
            this.setState({
                teamCodeScanned: true,
                code: result.data,
                barCodeOpened: false
            })
        }
    };
    
    render() {
        apputils.CONSOLE_LOG("---------------------this.props.userData.teamInfo")
        apputils.CONSOLE_LOG(this.props.userData.teamInfo)
        return (
            <Container>
            <Content>
                <View style={styles.formContainer}>
                    <View style={{alignSelf:"center", marginTop: 0}}>
                    <Button
                        full style={{backgroundColor: AppConstants.COLOR_HEADER_BG}}
                        onPress={() => this.requestQRScanner()}>
                            <Icon type="MaterialCommunityIcons" name="qrcode-scan" />
                            <Text>{this.state.barCodeOpened ?  AppLocales.t("SETTING_LBL_JOIN_TEAM_QRSCAN_OFF")
                             : AppLocales.t("SETTING_LBL_JOIN_TEAM_QRSCAN")}</Text>
                    </Button>
                    <Text style={{alignSelf:"center", color: AppConstants.COLOR_TEXT_LIGHT_INFO,
                        fontSize: 13,marginTop: 2, marginBottom: 5, fontStyle:"italic"}}>
                            Mã QR từ màn hình 'Thông Tin Nhóm'
                    </Text>
                    </View>
                    {(this.state.cameraPermission && this.state.barCodeOpened)? (
                        <View style={{alignItems:"center"}}>
                        <BarCodeScanner
                            onBarCodeScanned={ this.state.teamCodeScanned ? undefined : this.handleBarcodeScanned}
                            style={{
                                height: Layout.window.height-150,
                                width: Layout.window.width
                            }}
                        
                        /></View>
                    ) : null}

                    <Text style={{alignSelf:"center", color: AppConstants.COLOR_TEXT_LIGHT_INFO,
                        marginTop: 10, marginBottom: 10}}>Hoặc</Text>

                    <View style={styles.rowContainer}>
                        <Item stackedLabel>
                        <Label>
                            {AppLocales.t("SETTING_LBL_JOIN_TEAM_CODE")}
                        </Label>
                        <Input
                            onChangeText={(code) => this.setState({code})}
                            value={this.state.code}
                        />
                        </Item>
                    </View>

                    <View style={styles.rowButton}>
                    <Button
                        rounded style={{backgroundColor: AppConstants.COLOR_HEADER_BG}}
                        onPress={() => this.handleSubmit()}
                        ><Text>{AppLocales.t("SETTING_LBL_JOIN_TEAM")}</Text></Button>
                    </View>

                    {this.state.teamsByMe.length > 0 ? (
                    <Text style={{marginTop: 20, marginBottom: 7, fontSize: 18}}>
                        {AppLocales.t("SETTING_LBL_JOIN_CREATEDTEAM")+":"}
                    </Text>
                    ) : null}

                    {this.state.teamsByMe.map(item => (
                    <TouchableOpacity onPress={() => this.onReJoinTeamOfMe(item)} key={item.code}>
                    <Card key={"card"+item.code}>
                        <CardItem>
                        <Body>
                            <Text style={{fontWeight: "bold", fontSize: 16}}>
                            {item.name}
                            </Text>
                            <Text style={{fontStyle: "italic", fontSize: 13}}>
                            {item.code}
                            </Text>
                            <Text style={{fontSize: 13}}>
                            {item.canMemberViewReport ? 
                            (AppLocales.t("SETTING_LBL_MEM_CAN_VIEWREPORT")) :
                            (AppLocales.t("SETTING_LBL_MEM_CANNOT_VIEWREPORT"))}
                            </Text>
                        </Body>
                        </CardItem>
                    </Card>
                    </TouchableOpacity>
                    ))}
                </View>
            </Content>
            </Container>
        );
    }
}

JoinTeamScreen.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={{backgroundColor: AppConstants.COLOR_HEADER_BG, marginTop:-AppConstants.DEFAULT_IOS_STATUSBAR_HEIGHT}}>
          <Left>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" style={{color:"white"}}/>
            </Button>
          </Left>
          <Body>
            <Title><HeaderText>{AppLocales.t("SETTING_LBL_JOIN_TEAM")}</HeaderText></Title>
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
    alignItems: "center", // vertial align
    //height: 50,
    //borderWidth: 1,
    //borderColor:"grey"
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
    marginTop: 10,
    alignSelf: "center",
  },
  btnSubmit: {

  }
});

const mapStateToProps = (state) => ({
    userData: state.userData,
    teamData: state.teamData
});
const mapActionsToProps = {
    actUserCreateTeamOK, actTeamGetDataOK, actTeamGetJoinRequestOK,
    actUserGotMyJoinRequest,
    actUserStartSyncTeam,actUserStartSyncTeamDone, actUserForCloseModal
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(JoinTeamScreen);
