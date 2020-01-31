import React from 'react';
import { View, StyleSheet, TextInput, AsyncStorage } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Content, Form, Icon, Item, Picker, Button, Text, Input, ListItem } from 'native-base';

import AppConstants from '../../constants/AppConstants'
import { HeaderText } from '../../components/StyledText';
import { connect } from 'react-redux';
import {actUserCreateTeamOK} from '../../redux/UserReducer'
import Backend from '../../constants/Backend'
import apputils from '../../constants/AppUtils';

class DebugScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let notifyArr = [];
        this.props.userData.vehicleList.forEach(vehicle => {
            if (this.props.userData.carReports[vehicle.id]) {
                let report = this.props.userData.carReports[vehicle.id];
                // if (report.scheduledNotification) {
                //     if (report.scheduledNotification.authNotify) {
                //         let notObj = report.scheduledNotification.authNotify;
                //         notifyArr.push({
                //             vehiclePlate: notObj.vehiclePlate,
                //             remindDate: notObj.remindDate,
                //             onDate: notObj.onDate,
                //             type: notObj.type,
                //             notificationId: notObj.notificationId
                //         })
                //     }
                //     if (report.scheduledNotification.insuranceNotify) {
                //         let notObj = report.scheduledNotification.insuranceNotify;
                //         notifyArr.push({
                //             vehiclePlate: notObj.vehiclePlate,
                //             remindDate: notObj.remindDate,
                //             onDate: notObj.onDate,
                //             type: notObj.type,
                //             notificationId: notObj.notificationId
                //         })
                //     }
                //     if (report.scheduledNotification.roadFeeNotify) {
                //         let notObj = report.scheduledNotification.roadFeeNotify;
                //         notifyArr.push({
                //             vehiclePlate: notObj.vehiclePlate,
                //             remindDate: notObj.remindDate,
                //             onDate: notObj.onDate,
                //             type: notObj.type,
                //             notificationId: notObj.notificationId
                //         })
                //     }
                // }
            }
        })

        return (
            <Container>
            <Content>
            <View style={styles.formContainer}>
                <View style={styles.textRow}><Text>
                  Count Open:{this.props.appData.countOpen}
                </Text></View>

                <View style={styles.textRow}><Text>
                  App Latest On:{this.props.appData.appDataLatestOn}
                </Text></View>

                <View style={styles.textRow}><Text>
                  User Profile:{JSON.stringify(this.props.userData.userProfile)}
                </Text></View>

                <View style={styles.textRow}><Text>
                  Token:{(this.props.userData.token)}
                </Text></View>

                <View style={styles.textRow}><Text>
                  Team Info:{JSON.stringify(this.props.userData.teamInfo)}
                </Text></View>

                <View style={styles.textRow}><Text>
                  User IsNoAds:{(this.props.userData.isNoAds)}
                </Text></View>
                <View style={styles.textRow}><Text>
                  User ModifiedInfo:{JSON.stringify(this.props.userData.modifiedInfo)}
                </Text></View>

            </View>
            </Content>
            </Container>
        );
    }
}

DebugScreen.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={{backgroundColor: AppConstants.COLOR_HEADER_BG, marginTop:-AppConstants.DEFAULT_IOS_STATUSBAR_HEIGHT}}>
          <Left>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" style={{color:"white"}}/>
            </Button>
          </Left>
          <Body>
            <Title><HeaderText>Debug Screen</HeaderText></Title>
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
  textRow: {
    flexDirection: "row",
    paddingTop: 10,
    paddingBottom: 5,
    justifyContent: "space-between",
    flexWrap: "wrap",
    flexGrow: 100,
    marginTop: 5,
    marginLeft: -5,
    marginRight: -5,
    paddingLeft: 5,
    paddingRight: 5,
    // backgroundColor: AppConstants.COLOR_GREY_LIGHT_BG
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center", // vertial align
    height: 50,
    borderWidth: 1,
    borderColor:"grey"
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
  listItemRow: {

  },
  btnSubmit: {

  }
});

const mapStateToProps = (state) => ({
    userData: state.userData,
    teamData: state.teamData,
    appData: state.appData
});
const mapActionsToProps = {
    actUserCreateTeamOK
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(DebugScreen);
