import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { connect } from 'react-redux';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Linking
} from 'react-native';

import {Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text, Card, CardItem, ListItem, H2, H3, H1 } from 'native-base';

import AppConstants from '../constants/AppConstants'
import Backend from '../constants/Backend'
import AppLocales from '../constants/i18n'

import {actUserSawAllNotifications} from '../redux/UserReducer'
import { NoDataText, HeaderText } from '../components/StyledText';
import apputils from '../constants/AppUtils';

// navigation is passed from Parent
class NotificationScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    // Will Detect NotSeen message
    let notSeenIds = [];
    if (this.props.userData.notifications) {
      this.props.userData.notifications.forEach(item => {
        if (item.notSeen) {
          notSeenIds.push(item.id)
        }
      })
    }
    if (notSeenIds.length > 0) {
      this.notSeenIds = notSeenIds;
    }
  }
  componentDidMount() {
    apputils.CONSOLE_LOG("NotificationScreen componentDidMountttttttttttttttttt")
    // Will Reset all notSeen Notification
    this.props.actUserSawAllNotifications();
  }
  handleClick (item){
    if (item && item.url) {
      Linking.canOpenURL(item.url).then(supported => {
        if (supported) {
          Linking.openURL(item.url);
        } else {
          apputils.CONSOLE_LOG("Don't know how to open URI: " + item.url);
        }
      });
    }
  };

  // Data is Array of
//      "email": "tester1",
//     "fullName": "I M Tester1",
//     "id": "5db05ebad1b21048ee333fd1",
//     "phone": "",
//     "status": "requested",
//     "teamCode": "W4QKeBSl",
//     "userId": "5daf30722a799e12423b976a",
  render() {
    apputils.CONSOLE_LOG("NotificationScreen Render:")
    apputils.CONSOLE_LOG(this.notSeenIds)
    return (
      <Content>
        <View style={styles.container}>
          {(this.props.userData.notifications && this.props.userData.notifications.length > 0) ? this.props.userData.notifications.map(item => {
            let titleStyle = styles.notiTitle;
            let contentStyle = styles.notiContent;
            if (this.notSeenIds && this.notSeenIds.indexOf(item.id) >= 0) {
              titleStyle = styles.notiTitleNotSeen;
              contentStyle = styles.notiContentNotSeen;
            }
            return (
              <Card key={item.id} transparent>
                <CardItem style={styles.bottomBorder}>
                  <TouchableOpacity onPress={() => this.handleClick(item)} key={item.id+item.title}> 
                  <Body>
                    <Text style={titleStyle}>
                      {item.title}
                    </Text>
                    <Text style={contentStyle}>
                      {item.content}
                    </Text>
                    {item.url ?
                    <Text style={styles.notiUrl}>
                      {item.url}
                    </Text> : null}
                    <Text style={styles.notiDate}>
                      {apputils.formatDateMonthDayYearVN(item.issueDate)}
                    </Text>
                  </Body>
                  </TouchableOpacity>
                </CardItem>
            </Card>)
          }): (
            <NoDataText />
          )}
        </View>
      </Content>
    );
  }
}

NotificationScreen.navigationOptions = ({navigation}) => ({
  header: (
      <Header style={{backgroundColor: AppConstants.COLOR_HEADER_BG, marginTop:-AppConstants.DEFAULT_IOS_STATUSBAR_HEIGHT}}>
        <Left>
          <Button transparent onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" style={{color:"white"}}/>
          </Button>
        </Left>
        <Body>
          <Title><HeaderText>{AppLocales.t("GENERAL_NOTIFICATION")}</HeaderText></Title>
        </Body>
        <Right />
      </Header>
  )
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingBottom: 150
  },
  contentContainer: {

  },

  bottomBorder: {
    borderBottomColor: "rgb(220, 220, 220)",
    borderBottomWidth: 0.5,
  },
  listItemRow: {
    marginLeft: 7,
    marginRight: 7,
    marginTop: 5,
    backgroundColor:"white",
    //borderColor: "rgb(220, 220, 220)",
    borderBottomColor: "rgb(220, 220, 220)",
    borderBottomWidth: 0.5,
  },
  notiTitle: {
    fontSize: 15, marginTop: 1,flexWrap: "wrap",
    color: AppConstants.COLOR_PICKER_TEXT,
  },
  notiTitleNotSeen: {
    fontSize: 17, fontWeight: "bold", marginTop: 1,flexWrap: "wrap",
    color: AppConstants.COLOR_PICKER_TEXT,
  },
  notiUrl: {
    fontSize: 13, flexWrap: "wrap",
    color: AppConstants.COLOR_FACEBOOK,
    fontStyle: "italic"
  },

  notiContentNotSeen:  {
    fontSize: 15,
    marginTop: 3,
    flexWrap: "wrap",
    marginBottom: 5
  },
  notiContent:  {
    fontSize: 14,
    marginTop: 3,
    flexWrap: "wrap",
    marginBottom: 5,
    color: AppConstants.COLOR_TEXT_DARKEST_INFO
  },
  notiDate: {
    fontSize: 12,
    color: AppConstants.COLOR_TEXT_LIGHT_INFO,
    fontStyle: "italic"
  },
});

const mapStateToProps = (state) => ({
  userData: state.userData,
  teamData: state.teamData,
});
const mapActionsToProps = {
  actUserSawAllNotifications
};

export default connect(
  mapStateToProps,mapActionsToProps
)(NotificationScreen);
