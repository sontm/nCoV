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
import Layout from '../constants/Layout'
import AppUtils from '../constants/AppUtils'
import AppConstants from '../constants/AppConstants';
import AppLocales from '../constants/i18n';

import {Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text, Card, CardItem, Thumbnail , Badge} from 'native-base';
import {VictoryLabel, VictoryPie, VictoryBar, VictoryContainer, VictoryLegend, VictoryArea, VictoryLine, VictoryAxis} from 'victory-native';
import { HeaderText, WhiteText } from '../components/StyledText';

import CountryCaseDeathBar from '../components/CountryCaseDeathBar'

class OutsideChinaScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };

  }
  

  render() {
    AppUtils.CONSOLE_LOG("OutsideChinaScreen Render")
    
    return (
      <Container>
        <Content>
          
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}>

            <CountryCaseDeathBar />

          </ScrollView>
        </Content>

      </Container>
    );
  }
}

OutsideChinaScreen.navigationOptions = ({navigation}) => ({
  header: (
      <Header style={{backgroundColor: AppConstants.COLOR_HEADER_BG, marginTop:-AppConstants.DEFAULT_IOS_STATUSBAR_HEIGHT}}>
        <Left>
          <Button transparent onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" style={{color:"white"}}/>
          </Button>
        </Left>
        <Body>
          <Title><HeaderText>{AppLocales.t("NHOME_GENERAL_OTHER_COUNTRY")}</HeaderText></Title>
        </Body>
        <Right />
      </Header>
  )
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppConstants.COLOR_GREY_LIGHT_BG,
    minHeight: Layout.window.height - 50,
    paddingTop: 10
  },
  contentContainer: {
    backgroundColor: AppConstants.COLOR_GREY_LIGHT_BG,
  }

});

const mapStateToProps = (state) => ({
  appData: state.appData
});
const mapActionsToProps = {
};

export default connect(
  mapStateToProps,mapActionsToProps
)(OutsideChinaScreen);

