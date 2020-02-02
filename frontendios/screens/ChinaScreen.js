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

class ChinaScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };

  }
  

  parseLatestHubei(inputData) {
    if (inputData && inputData.china_province && inputData.china_province.length > 0 && inputData.china_province[0].provinces && 
      inputData.china_province[0].provinces[0].name == "Hubei") {
      return {case: inputData.china_province[0].provinces[0].case, death: inputData.china_province[0].provinces[0].death}
    }
  }

  render() {
    let hubeiData = this.parseLatestHubei(this.props.appData.ncov)

    return (
      <Container>
        <Content>
          
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}>

          {(hubeiData && hubeiData.case) ?
            <View style={styles.statRow}>
              <View style={styles.equalStartRowNormal}>
                <Text style={{alignSelf: "center", fontSize: 22, marginBottom: 5}}>
                  {AppLocales.t("NHOME_GENERAL_HUBEI")}
                </Text>
                
                <View style={{flexDirection:"row",justifyContent: "space-evenly",alignItems: "center"}}>
                <View style={{alignItems: "center"}}>
                  <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Text style={{color: AppConstants.COLOR_HEADER_BG, fontSize: 30}}>
                      {(hubeiData.case)}</Text>
                  </View>
                  <Text style={{alignSelf: "center", fontSize: 13, 
                    color: AppConstants.COLOR_TEXT_DARKEST_INFO}}>
                  {AppLocales.t("NHOME_CASE_CONFIRMED")}
                  </Text>
                </View>

                {hubeiData.death ?
                <View style={{alignItems: "center"}}>
                  <Text style={{alignSelf: "center", fontSize: 15, 
                    color: AppConstants.COLOR_TEXT_DARKEST_INFO}}>
                  {AppLocales.t("NHOME_CASE_DEATH")}
                  </Text>
                  <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Text style={{color: AppConstants.COLOR_HEADER_BG, fontSize: 36}}>
                      {(hubeiData.death)}</Text>
                  </View>
                </View>  : null}
                </View>
              </View>
            </View> : null}

            <CountryCaseDeathBar showChinaProvince={true} noLegend={true}/>

            <HomeTotalCasesByTime showSpecific={AppLocales.t("NHOME_GENERAL_CHINA")}/>

            <Text style={{alignSelf: "center", fontSize: 13, fontStyle:"italic", marginBottom: 10,
                color:AppConstants.COLOR_TEXT_DARKDER_INFO}}>
              {(this.props.appData.ncov.china_province[0].date && new Date(this.props.appData.ncov.china_province[0].date)) ? 
                "Data at: "+new Date(this.props.appData.ncov.china_province[0].date).toGMTString()
              : ""}
            </Text>

          </ScrollView>
        </Content>

      </Container>
    );
  }
}

ChinaScreen.navigationOptions = ({navigation}) => ({
  header: (
      <Header style={{backgroundColor: AppConstants.COLOR_HEADER_BG, marginTop:-AppConstants.DEFAULT_IOS_STATUSBAR_HEIGHT}}>
        <Left style={{flex:1}}>
          <Button transparent onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" style={{color:"white"}}/>
          </Button>
        </Left>
        <Body  style={{flex:5}}>
          <Title><HeaderText>{AppLocales.t("NHOME_GENERAL_CHINA")}</HeaderText></Title>
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
    paddingBottom: 30
  },
  contentContainer: {
    backgroundColor: AppConstants.COLOR_GREY_LIGHT_BG,
  },

  statRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    flexGrow: 100,
    //paddingTop: 10,
    backgroundColor: AppConstants.COLOR_GREY_LIGHT_BG,
  },

  equalStartRowNormal: {
    flex: 1,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 10, 

    paddingBottom: 10,
    paddingTop: 5,
    // borderWidth: 0.5,
    // borderRadius: 0,
    // flexDirection: "column",
    // justifyContent: "space-evenly",
    // alignItems: "center",

    borderRadius: 0,
    borderColor: "rgb(220, 220, 220)",
    borderWidth: 1,

    backgroundColor:"white",

    shadowColor: "#777777",
    shadowOpacity: 0.4,
    shadowRadius: 3,
    shadowOffset: {
        height: 3,
        width: 1
    },
  },

});

const mapStateToProps = (state) => ({
  appData: state.appData
});
const mapActionsToProps = {
};

export default connect(
  mapStateToProps,mapActionsToProps
)(ChinaScreen);

