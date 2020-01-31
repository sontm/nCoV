import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Content, Form, Icon, Item, Picker, 
    Button, Text, Input, Label, Card, CardItem, Alert, Toast } from 'native-base';

import AppConstants from '../../constants/AppConstants'
import { HeaderText } from '../../components/StyledText';
import { connect } from 'react-redux';
import CheckMyJoinRequest from  '../../components/CheckMyJoinRequest'
import Backend from '../../constants/Backend'
import apputils from '../../constants/AppUtils';
import AppLocales from '../../constants/i18n';
import NetInfo from "@react-native-community/netinfo";

class CheckJoinTeamScreen extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Container>
            <Content>
                <CheckMyJoinRequest key={"inSetting"} navigation={this.props.navigation}/>
            </Content>
            </Container>
        );
    }
}

CheckJoinTeamScreen.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={{backgroundColor: AppConstants.COLOR_HEADER_BG, marginTop:-AppConstants.DEFAULT_IOS_STATUSBAR_HEIGHT}}>
          <Left style={{flex: 1}}>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" style={{color:"white"}}/>
            </Button>
          </Left>
          <Body  style={{flex: 5}}>
            <Title><HeaderText>{AppLocales.t("SETTING_LBL_CHECK_TEAM_JOINREQUEST")}</HeaderText></Title>
          </Body>
          <Right style={{flex: 1}}/>
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
  
});

  
export default (CheckJoinTeamScreen);
