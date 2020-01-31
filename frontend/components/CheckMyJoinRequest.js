import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Modal, ActivityIndicator} from 'react-native';
import { Container, Header, Left, Body, Right, Title, Content, Form, Icon, Item, Picker, 
    Button, Text, Input, Label, Card, CardItem, Toast } from 'native-base';

import AppConstants from '../constants/AppConstants'
import { HeaderText } from '../components/StyledText';
import { connect } from 'react-redux';
import {actUserCreateTeamOK, actUserGotMyJoinRequest} from '../redux/UserReducer'
import {actTeamGetDataOK, actTeamGetJoinRequestOK} from '../redux/TeamReducer'
import {actUserStartSyncTeam,actUserStartSyncTeamDone, actUserForCloseModal} from '../redux/UserReducer'

import Layout from '../constants/Layout'

import Backend from '../constants/Backend'
import apputils from '../constants/AppUtils';
import AppLocales from '../constants/i18n';
import NetInfo from "@react-native-community/netinfo";

class CheckMyJoinRequest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            myLatestJoinRequest: [],
        };

        this.cancelMyJoinRequest = this.cancelMyJoinRequest.bind(this)
        this.checkMyJoinRequest = this.checkMyJoinRequest.bind(this)
        
        this.onForceCloseModalByPressBack = this.onForceCloseModalByPressBack.bind(this)
        this.onShowModalDialog = this.onShowModalDialog.bind(this)
    }
    onForceCloseModalByPressBack() {
        this.props.actUserForCloseModal()
    }
    onShowModalDialog() {
    setTimeout(() => {
        // Will try to close Dialog if Overtimeout 
        if (this.props.userData.modalState > 0) {
        this.props.actUserForCloseModal()
        }
    }, 20000);
    }
    cancelMyJoinRequest() {
        Alert.alert(
            AppLocales.t("GENERAL_CONFIRM"),
            AppLocales.t("MSG_REQUEST_CANCELING"),
            [
                {
                  text: AppLocales.t("GENERAL_NO"),
                  onPress: () => apputils.CONSOLE_LOG('Cancel Pressed'),
                  style: 'cancel',
                },
                {text: AppLocales.t("GENERAL_YES"), onPress: () => {
                    NetInfo.fetch().then(state => {
                        if (state.isConnected) {
                            Backend.cancelMyJoinRequest(this.props.userData.token,
                                response => {
                                    apputils.CONSOLE_LOG(response.data)
                                    this.props.actUserGotMyJoinRequest(response.data)

                                    this.props.navigation.goBack()
                                }, error => {
                                    apputils.CONSOLE_LOG("cancelMyJoinRequest ERROR")
                                    apputils.CONSOLE_LOG(error.response)
                                })
                        } else {
                            Toast.show({
                                text: AppLocales.t("TOAST_NEED_INTERNET_CON"),
                                //buttonText: "Okay",
                                position: "top",
                                type: "danger"
                              })
                        }
                    })
                }},
            ],
            {cancelable: true}
        )
        
    }
    checkMyJoinRequest() {
        // get the status of a Join Request id
        apputils.CONSOLE_LOG("this.props.userData.myJoinRequest.id")
        apputils.CONSOLE_LOG(this.props.userData.myJoinRequest.id)
        if (this.props.userData.myJoinRequest && this.props.userData.myJoinRequest.id) {
            NetInfo.fetch().then(state => {
            if (state.isConnected) {
                Backend.getMyJoinRequest(this.props.userData.token, this.props.userData.myJoinRequest.id,
                response => {
                    apputils.CONSOLE_LOG("   Latest Join Request Dataaaaaaa")
                    apputils.CONSOLE_LOG(response.data)
                    let updatedInfo = response.data;
                    
                    if (updatedInfo) {
                        let msg = null;
                        let needDownloadTeamData = false;
                        let needReloadMyJoinRequest = false;
                        let prevRequest = this.props.userData.myJoinRequest;
                        if (updatedInfo.id == prevRequest.id) {
                            if (updatedInfo.status == "requested") {
                                // still Requested
                                Toast.show({
                                    text: AppLocales.t("TOAST_NO_NEW_INFO"),
                                    position: "top",
                                    //buttonText: "Okay",
                                    //type: "danger"
                                })
                            } else if (updatedInfo.status == "approved") {
                                // still Requested
                                needDownloadTeamData = true;
                                msg = AppLocales.t("MSG_REQUEST_APPROVED")
                            } else if (updatedInfo.status == "rejected") {
                                // Rejected, just display message
                                needReloadMyJoinRequest = true;
                                msg = AppLocales.t("MSG_REQUEST_REJECTED")
                            } else if (updatedInfo.status == "blocked") {
                                // Rejected, just display message
                                needReloadMyJoinRequest = true;
                                msg = AppLocales.t("MSG_REQUEST_BLOCKED")
                            }
                        }
    
                        if (msg) {
                            Alert.alert(
                                AppLocales.t("GENERAL_NOTIFICATION"),
                                msg,
                                [
                                    {
                                      text: 'OK',
                                      onPress: () => {
                                          if (needReloadMyJoinRequest) {
                                            this.props.actUserGotMyJoinRequest([])
                                            this.props.navigation.goBack()
                                          }
                                          if (needDownloadTeamData) {
                                            // Download Team Here
                                            apputils.CONSOLE_LOG(" Will Download Team Here")
                                            this.props.actUserStartSyncTeam();
                                            Backend.getLatestTeamInfoOfMe(this.props.userData.token,
                                                response => {
                                                    apputils.CONSOLE_LOG("===============getLatestTeamInfoOfMe Data")
                                                    apputils.CONSOLE_LOG(response.data)
                                                    // Rejoin team can ReUse Create Team
                                                    this.props.actUserCreateTeamOK(response.data, true)

                                                    if (response.data.canMemberViewReport) {
                                                        // Sync Team Data heare also
                                                        // TODO Message of Syncing here
                                                        Backend.getAllUserOfTeam({teamId: this.props.userData.userProfile.teamId}, 
                                                            this.props.userData.token, 
                                                        response2 => {
                                                            apputils.CONSOLE_LOG("GEt all Member in Team OK")
                                
                                                            this.props.actTeamGetDataOK(response2.data, this.props.userData, this.props.teamData, this.props)
                                                        },
                                                        error => {
                                                            this.props.actUserStartSyncTeamDone();
                                                            apputils.CONSOLE_LOG("GEt all Member in Team ERROR")
                                                            apputils.CONSOLE_LOG(JSON.stringify(error))
                                                        }
                                                        );
                                                    } else {
                                                        this.props.actUserStartSyncTeamDone();
                                                        this.props.actTeamGetDataOK([], this.props.userData, this.props.teamData, this.props)
                                                    }
                                            
                        
                                                    this.props.navigation.goBack()
                                                }, err => {
                                                    this.props.actUserStartSyncTeamDone();
                                                    apputils.CONSOLE_LOG("get LatestTeamInfo ERROR")
                                                    apputils.CONSOLE_LOG(err)
                                            })
                                          }
                                      },
                                      style: 'cancel',
                                    },
                                ],
                                {cancelable: true}
                            )
                        }
                    }
                }, error => {
                    apputils.CONSOLE_LOG("getMyJoinRequest ERROR")
                    apputils.CONSOLE_LOG(error)
                    this.props.actUserForCloseModal();
                })
            } else {
                Toast.show({
                    text: AppLocales.t("TOAST_NEED_INTERNET_CON"),
                    //buttonText: "Okay",
                    position: "top",
                    type: "danger"
                  })
            }
            })
        }
        
    }
    render() {
        apputils.CONSOLE_LOG("===============this.props.userData.myJoinRequest")
        apputils.CONSOLE_LOG(this.props.userData.myJoinRequest)
        return (
            <Container>
                <View style={styles.formContainer}>
                    {this.props.userData.myJoinRequest&&this.props.userData.myJoinRequest.teamCode ? (
                    <View>
                    <Text style={{marginTop: 7, marginBottom: 7, fontSize: 18}}>
                        {AppLocales.t("SETTING_LBL_MY_JOINREQUEST")}
                    </Text>

                    <Card>
                        <CardItem>
                        <Body>
                            <Text style={{fontSize: 17}}>
                            {this.props.userData.myJoinRequest.teamName}
                            </Text>
                            <Text style={{fontSize: 14, fontStyle:"italic", color: AppConstants.COLOR_TEXT_LIGHT_INFO}}>
                            {this.props.userData.myJoinRequest.teamCode}
                            </Text>
                        </Body>
                        
                        <Right style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)", alignItems: "flex-end"}}>
                            <TouchableOpacity 
                                onPress={() => this.cancelMyJoinRequest()}>
                            <Icon type="MaterialIcons" name="delete" style={{color: AppConstants.COLOR_GOOGLE,fontSize: 18}}/>
                            <Text style={{fontSize: 12}}>{AppLocales.t("GENERAL_CANCEL_SHORT")}</Text>
                            </TouchableOpacity>
                        </Right>
                        
                        </CardItem>
                    </Card>

                    <View style={styles.rowButton}>
                    <Button
                        rounded style={{backgroundColor: AppConstants.COLOR_HEADER_BG}}
                        onPress={() => this.checkMyJoinRequest()}
                        ><Text>{AppLocales.t("SETTING_LBL_CHECK_JOIN_STATUS")}</Text></Button>
                    </View>
                    </View>
                    ) : null}

                </View>
            </Container>
        );
    }
}

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
)(CheckMyJoinRequest);
