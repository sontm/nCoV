import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { connect } from 'react-redux';
import {
  Image,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import {Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text, Card, Thumbnail, ListItem, H2, H3, H1 } from 'native-base';

import AppConstants from '../../constants/AppConstants'
import Backend from '../../constants/Backend'
import AppLocales from '../../constants/i18n'

import {actTeamGetJoinRequestOK} from '../../redux/TeamReducer'
import { NoDataText, TypoH4 } from '../../components/StyledText';
import apputils from '../../constants/AppUtils';

// navigation is passed from Parent
class JoinRequestScreen extends React.Component {
  constructor(props) {
    super(props);

    this.handleJoin = this.handleJoin.bind(this)
    this.handleDeleteMember = this.handleDeleteMember.bind(this)
    
  }

  handleJoin(item, type) {
      //req.body: teamId, teamCode, requestUserId, id (join id), action (approved or rejected)
    Backend.approveOrRejectJoinRequest(
        {
            teamId: this.props.userData.teamInfo.id,
            teamCode: item.teamCode, 
            requestUserId: item.userId,
            id: item.id,
            action: type,
        },
        this.props.userData.token, 
        response => {
            apputils.CONSOLE_LOG("Approve or Reject OK:" + type)
            apputils.CONSOLE_LOG(response.data)
            //this.props.actUserLoginOK(response.data)
            //this.props.navigation.navigate("Settings")
            // this.setState({
            //     joins: response.data
            // })
            if (type == "approved") {
              this.props.fetchTeamData();
            } else {
              this.props.actTeamGetJoinRequestOK(response.data)
            }
            
        },
        error => {
            apputils.CONSOLE_LOG("Approve or Reject ERROR:" + type)
            apputils.CONSOLE_LOG(JSON.stringify(error))
        }
    );
  }
  handleDeleteMember(item) {
    Alert.alert(
      AppLocales.t("GENERAL_CONFIRM"),
      AppLocales.t("MSG_REMOVE_MEMBER"),
      [
          {
            text: AppLocales.t("GENERAL_NO"),
            onPress: () => apputils.CONSOLE_LOG('Cancel Pressed'),
            style: 'cancel',
          },
          {text: AppLocales.t("GENERAL_YES"), style: 'destructive' , onPress: () => {
              apputils.CONSOLE_LOG('Delete Pressed')
              Backend.removeMemFromTeam(
                {
                    teamId: item.teamId,
                    userId: item.id
                },
                this.props.userData.token, 
                response => {
                    apputils.CONSOLE_LOG("removeMemFromTeam OK:")
                    apputils.CONSOLE_LOG(response.data)
                    
                  this.props.fetchTeamData();
                },
                error => {
                    apputils.CONSOLE_LOG("removeMemFromTeam ERROR:")
                    apputils.CONSOLE_LOG(JSON.stringify(error))
                }
              )
          }},
      ],
      {cancelable: true}
    )
  }
  componentDidMount() {
    apputils.CONSOLE_LOG("JoinRequestScreen componentDidMount:")

  }

  // Data is Array of
//      "email": "tester1",
//     "fullName": "I M Tester1",
//     "id": "5db05ebad1b21048ee333fd1",
//     "phone": "",
//     "status": "requested",
//     "teamCode": "W4QKeBSl",
//     "userId": "5daf30722a799e12423b976a",
  render() {
    apputils.CONSOLE_LOG("JoinRequestScreen Render:")
    return (
        <View style={styles.container}>

          {this.props.teamData.joinRequests.length > 0 ?
          <View style={styles.textRow}>
            <TypoH4 style={{color: AppConstants.COLOR_TEXT_DARKEST_INFO}}>{AppLocales.t("TEAM_MEM_JOIN_REQUEST")}</TypoH4>
          </View> : null }

          {this.props.teamData.joinRequests.length > 0 ? this.props.teamData.joinRequests.map(item => (
              <ListItem icon key={item.id} style={styles.listItemRow} key={item.type+"-"+item.id}>
                  <Left style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                  </Left>
                  <Body style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)", flex: 3, marginLeft: -5}}>
                    <Text style={{fontSize: 16, marginTop: 2}}>{item.fullName}</Text>
                    <Text style={{fontSize: 13, color: AppConstants.COLOR_PICKER_TEXT, marginTop: 5}}>{item.email}</Text>
                  </Body>
                  <Right style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)", alignSelf: "center", flex: 2}}>
                      <TouchableOpacity 
                            onPress={() => this.handleJoin(item, "approved")}>
                          <View style={{alignItems: "center"}}>
                            <Icon type="AntDesign" name="checkcircle" style={styles.listItemEditIcon}/>
                            <Text style={{fontSize: 12, alignSelf:"center"}}>{AppLocales.t("TEAM_MEM_REQUEST_OK")}</Text>
                          </View>
                      </TouchableOpacity>

                      <TouchableOpacity 
                            onPress={() => this.handleJoin(item, "rejected")}>
                          <View style={{alignItems: "center", marginLeft: 10}}>
                            <Icon type="AntDesign" name="closecircle" style={styles.listItemDeleteIcon}/>
                            <Text style={{fontSize: 12, alignSelf:"center"}}>{AppLocales.t("TEAM_MEM_REQUEST_REJECT")}</Text>
                          </View>
                        </TouchableOpacity>
                      <TouchableOpacity 
                            onPress={() => this.handleJoin(item, "blocked")}>
                        <View style={{alignItems: "center", marginLeft: 10}}>
                          <Icon type="MaterialIcons" name="block" style={styles.listItemBlockIcon}/>
                          <Text style={{fontSize: 12, alignSelf:"center"}}>{AppLocales.t("TEAM_MEM_REQUEST_BLOCK")}</Text>
                        </View>
                      </TouchableOpacity>
                  </Right>
              </ListItem>
          )) : (
            null
          )}

          <View style={styles.textRow}>
            <TypoH4 style={{color: AppConstants.COLOR_TEXT_DARKEST_INFO}}>{AppLocales.t("TEAM_MEM_LIST")}</TypoH4>
          </View>
          {this.props.teamData.members.length > 0 ? this.props.teamData.members.map((item, idx) => (
            <ListItem icon key={item.id} style={styles.listItemRow} key={item.type+"-"+item.id}>
                <Left style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)", width: 54, marginLeft: 13}}>
                  {item.pictureUrl ?
                  <Thumbnail source={{uri: item.pictureUrl }} style={{...styles.avatarView, marginLeft: 0}}/>
                  :
                  <View style={{...styles.avatarView, marginLeft: 0, backgroundColor: apputils.getColorForIndex(idx)}}>
                    <Text style={{color: "white"}}>{apputils.getFirstCharacterInname(item.fullName)}</Text>
                  </View>}
                </Left>
                <Body style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)", marginLeft: 0}}>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate("MemberVehicles", {member: item})} key={item.id}>
                    <Text style={{fontSize: 16, marginTop: 5}}>{item.fullName}</Text>
                    <Text style={{fontSize: 13, color: AppConstants.COLOR_PICKER_TEXT, marginTop: 3}}>{item.email}</Text>
                    <Text style={{fontSize: 13, fontStyle: "italic", marginTop: 3, marginBottom: 5, color: AppConstants.COLOR_TEXT_LIGHT_INFO}}>
                      {AppLocales.t("TEAM_MEM_TOTALCAR") + ": " + item.vehicleList.length}
                    </Text>
                    </TouchableOpacity>
                </Body>
                {this.props.userData.userProfile.roleInTeam == "manager" ?
                <Right style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)", alignSelf: "center"}}>
                  <TouchableOpacity 
                        onPress={() => this.handleDeleteMember(item)}>
                    <View style={{alignItems: "center", marginLeft: 10}}>
                      <Icon type="MaterialIcons" name="delete" style={styles.listItemBlockIcon2}/>
                      <Text style={{fontSize: 12, alignSelf:"center"}}>{AppLocales.t("GENERAL_DELETE_SHORT")}</Text>
                    </View>
                  </TouchableOpacity>
                  <Icon name="arrow-forward" style={{alignSelf: "center"}}/>
                </Right> : null}
            </ListItem>
          )): (
            <NoDataText noBg={true}/>
          )}
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppConstants.COLOR_GREY_LIGHT_BG,
    paddingBottom: 150
  },
  contentContainer: {

  },

  textRow: {
    flexDirection: "row",
    paddingTop: 13,
    paddingLeft: 7,
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    flexGrow: 100
  },

  listItemRow: {
    height: 70,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 7,
    backgroundColor:"white",
    borderRadius: 0,
    //borderColor: "rgb(220, 220, 220)",
    borderColor: "rgba(0,0,0,0)",
    borderWidth: 0.3,
    shadowColor: "#777777",
    shadowOpacity: 0.4,
    shadowRadius: 2,
    shadowOffset: {
        height: 2,
        width: 1
    }
  },
  listItemDeleteIcon: {
    color: AppConstants.COLOR_GOOGLE,
    fontSize: 28
  },
  listItemEditIcon: {
    color: "green",
    fontSize: 28
  },
  listItemBlockIcon: {
    color: AppConstants.COLOR_GOOGLE,
    fontSize: 30
  },
  listItemBlockIcon2: {
    color: AppConstants.COLOR_GOOGLE,
    fontSize: 24
  },

  avatarView: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center"
  }
});

const mapStateToProps = (state) => ({
  userData: state.userData,
  teamData: state.teamData,
});
const mapActionsToProps = {
  actTeamGetJoinRequestOK
};

export default connect(
  mapStateToProps,mapActionsToProps
)(JoinRequestScreen);
