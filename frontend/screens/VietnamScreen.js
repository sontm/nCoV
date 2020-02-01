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

class VietnamScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };

  }
  

  render() {
    AppUtils.CONSOLE_LOG("VietnamScreen Render")

    return (
      <Container>
        <Content>
          
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}>

            <CountryCaseDeathBar showVietnamProvince={true}/>

            <Text style={{alignSelf: "flex-start", fontSize: 24, marginBottom: 5, marginTop: 10}}>
              {AppLocales.t("NHOME_HEADER_VIETNAM_INFO_HEALTH")}
            </Text>

            <Image
                source={require('../assets/images/vn/danh_sach_bv.jpg')}
                style={{width: '100%',height: undefined, aspectRatio: 2481 / 3508}}
            />

            <Image
                source={require('../assets/images/vn/trieuchung.jpg')}
                style={{width: '100%',height: undefined, aspectRatio: 1063 / 2477}}
            />

            <Image
                source={require('../assets/images/vn/khautrang.jpg')}
                style={{width: '100%',height: undefined, aspectRatio: 1063 / 3064}}
            />

          </ScrollView>
        </Content>

      </Container>
    );
  }
}

VietnamScreen.navigationOptions = ({navigation}) => ({
  header: (
      <Header style={{backgroundColor: AppConstants.COLOR_HEADER_BG, marginTop:-AppConstants.DEFAULT_IOS_STATUSBAR_HEIGHT}}>
        <Left>
          <Button transparent onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" style={{color:"white"}}/>
          </Button>
        </Left>
        <Body>
          <Title><HeaderText>{AppLocales.t("NHOME_GENERAL_VIETNAM")}</HeaderText></Title>
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
)(VietnamScreen);

