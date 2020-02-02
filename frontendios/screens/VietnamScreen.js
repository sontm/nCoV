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
import HomeTotalCasesByTime from '../components/HomeTotalCasesByTime'

class VietnamScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };

  }
  
  onClickSource() {
    Linking.canOpenURL("https://suckhoedoisong.vn/Virus-nCoV-cap-nhat-moi-nhat-lien-tuc-n168210.html").then(supported => {
      if (supported) {
        Linking.openURL("https://suckhoedoisong.vn/Virus-nCoV-cap-nhat-moi-nhat-lien-tuc-n168210.html");
      }
    });
  }

  render() {
    return (
      <Container>
        <Content>
          
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}>

            <CountryCaseDeathBar showVietnamProvince={true}/>

            <HomeTotalCasesByTime showSpecific={AppLocales.t("NHOME_GENERAL_VIETNAM")} showVNLang={true}/>

            <View style={{alignSelf: "flex-start", flexDirection:"row",marginBottom: 5, marginTop: 10, justifyContent:"flex-end"}}>
              <Text style={{fontSize: 22}}>
                {AppLocales.t("NHOME_HEADER_VIETNAM_INFO_HEALTH")}
              </Text>

              <TouchableOpacity onPress={() => this.onClickSource()}>
              <Text style={{fontSize: 15, color: AppConstants.COLOR_FACEBOOK, fontStyle:"italic", marginLeft: 7, marginTop: 5}}>
                (nguồn Bộ Y Tế)
              </Text>
              </TouchableOpacity>

            </View>

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

            <Image
                source={require('../assets/images/vn/hospital.jpg')}
                style={{width: '100%',height: undefined, aspectRatio: 1063 / 1208}}
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
        <Left style={{flex:1}}>
          <Button transparent onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" style={{color:"white"}}/>
          </Button>
        </Left>
        <Body style={{flex:5}}>
          <Title><HeaderText>{AppLocales.t("NHOME_HEADER_VIETNAM_CASES")}</HeaderText></Title>
        </Body>
        <Right  style={{flex:1}}/>
      </Header>
  )
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppConstants.COLOR_GREY_LIGHT_BG,
    minHeight: Layout.window.height - 50,
    paddingTop: 10,
    paddingBottom: 30
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

