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
import Layout from '../constants/Layout'
import AppUtils from '../constants/AppUtils'
import AppConstants from '../constants/AppConstants';
import AppLocales from '../constants/i18n';

import {Container, Header, Title, Subtitle, Left, Icon, Right, Button, Body, Content,Text, Card, CardItem, Thumbnail , Toast} from 'native-base';
import {VictoryLabel, VictoryPie, VictoryBar, VictoryContainer, VictoryLegend, VictoryArea, VictoryLine, VictoryAxis} from 'victory-native';
import { HeaderText, WhiteText } from '../components/StyledText';

import {actAppSyncLatestDataIfNeeded} from '../redux/AppDataReducer'

import HomeTotalCasesByTime from '../components/HomeTotalCasesByTime'
import NCoVNSarsCoV from '../components/NCoVNSarsCoV'

import {checkAndShowInterestial} from '../components/AdsManager'

// vehicleList: {brand: "Kia", model: "Cerato", licensePlate: "18M1-78903", checkedDate: "01/14/2019", id: 3}
// fillGasList: {vehicleId: 2, fillDate: "10/14/2019, 11:30:14 PM", amount: 2, price: 100000, currentKm: 123344, id: 1}
// fillOilList: {vehicleId: 1, fillDate: "10/14/2019, 11:56:44 PM", price: 500000, currentKm: 3000, id: 1}
class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notSeenNotiCount: 0,
      showPRModal: false,
      imgUrl:"",
      linkUrl:"",
    };

  }

  onClickSourceWHO() {
    Linking.canOpenURL("https://www.who.int/emergencies/diseases/novel-coronavirus-2019").then(supported => {
      if (supported) {
        Linking.openURL("https://www.who.int/emergencies/diseases/novel-coronavirus-2019");
      }
    });
  }

  onClickRate() {
    Toast.show({
      text: "Please Review/Rate app for us, Thank youu!",
      //buttonText: "Okay",
      position: "top",
      type: "success",
    })
    setTimeout(function(){
      Linking.canOpenURL("https://itunes.apple.com/app/id1497453946").then(supported => {
        if (supported) {
          Linking.openURL("https://itunes.apple.com/app/id1497453946");
        }
      });
    }, 2000);
    
  }

  render() {
    let theData = this.props.appData.ncov;

    let totalCaseWorld = theData.data[0].world.case;
    let totalCaseChina = theData.data[0].countries[0].case;

    let vietnamData = null;
    let vietnamDataPre = null;
    let foundLatestVN = false;
    let isFinish = false;
    if (theData.data && theData.data.length > 0 && theData.data[0].countries) {
      var latestDate = new Date(theData.data[0].date);
      for (let c = 0; c < theData.data.length; c++) {

        for (let i = 0; i < theData.data[c].countries.length; i++) {
          let theCountry = theData.data[c].countries[i];
          if (theCountry.name.toLowerCase() == "vietnam" || theCountry.name.toLowerCase() == "viet nam") {
            if (!foundLatestVN) {
              vietnamData = theCountry;
              vietnamDataPre = theCountry;
              foundLatestVN = true;
            } else {
              vietnamDataPre = theCountry;
              isFinish = true;
              break;
            }
          }
        }
        if (isFinish) {
          break;
        }
      }
    }
    
    return (
      <Container>
        <Header style={{backgroundColor: AppConstants.COLOR_HEADER_BG, marginTop:-AppConstants.DEFAULT_IOS_STATUSBAR_HEIGHT/2, paddingBottom: 10}}>
          <Left style={{flex:1}}>
            <Button badge transparent onPress={() => this.onClickRate()}>
              <Icon name="star" style={{color: "yellow", fontSize: 28}} />
            </Button>
            
          </Left>
          <Body style={{flex: 5, alignItems: "center"}}>
            <View style={{flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
            <Icon type="FontAwesome" name="circle" style={{color: AppConstants.COLOR_LIGHT_RED, fontSize: 20, width: 20, alignSelf:"center", 
              marginTop: 5, marginRight: 3}} />
            <Title><HeaderText style={{fontSize: 29}}>{AppLocales.t("NHOME_HEADER")}</HeaderText></Title></View>
            {latestDate ? 
            <Subtitle><HeaderText>{latestDate.toGMTString()}</HeaderText></Subtitle> : null}
          </Body>
          <Right  style={{flex:1}}>
            <Button badge transparent onPress={() => this.props.actAppSyncLatestDataIfNeeded(this.props.appData, true)}>
              <Icon type="Foundation" name="refresh" style={{color: "white", fontSize: 24}} />
            </Button>
          </Right>
        </Header>
       
        <Content>
          
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}>
            
            <View style={styles.gapRow}>
            </View>

            <View style={styles.statRow}>
              <View style={styles.equalStartRowSingle}>
                <View style={{flexDirection:"row", justifyContent:"center",alignItems: "center"}}>
                  <Text style={{alignSelf: "center", fontSize: 12, marginRight: 2, marginBottom: 3, color:AppUtils.getColorForRisk(theData.data[0].world.risk)}}>
                    {theData.data[0].world.risk ? theData.data[0].world.risk +" Risk" : ""}
                  </Text>
                  <Text style={{alignSelf: "center", fontSize: 28, marginBottom: 5}}>
                    {AppLocales.t("NHOME_GENERAL_WORLD")}
                  </Text>
                  <Image
                    source={require('../assets/images/flag/world.png')}
                    style={{width: 22,height: 22, alignSelf:"flex-start", marginLeft: 5, marginTop: 3}}
                  />
                  
                </View>
                
                
                <View style={{flexDirection:"row",justifyContent: "space-evenly",alignItems: "center"}}>
                <View style={{alignItems: "center"}}>
                  <Text style={{alignSelf: "center", fontSize: 15, 
                    color: AppConstants.COLOR_TEXT_DARKEST_INFO}}>
                  {AppLocales.t("NHOME_CASE_CONFIRMED")}
                  </Text>
                  <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Text style={{color: AppConstants.COLOR_HEADER_BG, fontSize: 40}}>
                      {(theData.data[0].world.case)}</Text>
  
                  </View>
                  <Text style={{marginTop: 2, fontSize: 20, color: AppConstants.COLOR_TEXT_DARKEST_INFO}}>
                      {AppUtils.formatValueWithSign(theData.data[0].world.case - theData.data[1].world.case)}</Text>
                  <Text style={{alignSelf: "center", fontSize: 12,color: AppConstants.COLOR_TEXT_LIGHT_INFO}}>
                    {AppLocales.t("NHOME_GENERAL_PREV_DAY")}
                  </Text>
                </View>

                <View style={{alignItems: "center"}}>
                  <Text style={{alignSelf: "center", fontSize: 15, 
                    color: AppConstants.COLOR_TEXT_DARKEST_INFO}}>
                  {AppLocales.t("NHOME_CASE_DEATH")}
                  </Text>
                  <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Text style={{color: AppConstants.COLOR_GOOGLE, fontSize: 38}}>
                      {(theData.data[0].world.death)}</Text>
                  </View>
                  <Text style={{marginTop: 2, fontSize: 20, color: AppConstants.COLOR_TEXT_DARKEST_INFO}}>
                      {AppUtils.formatValueWithSign(theData.data[0].world.death - theData.data[1].world.death)}</Text>
                  <Text style={{alignSelf: "center", fontSize: 12,color: AppConstants.COLOR_TEXT_LIGHT_INFO}}>
                    {AppLocales.t("NHOME_GENERAL_PREV_DAY")}
                  </Text>
                </View>
                </View>
              </View>
            </View>



            <View style={styles.statRow}>
              <View style={styles.equalStartRowNormal}>
                <View style={{flexDirection:"row", justifyContent:"center",alignItems: "center"}}>
                  <Text style={{alignSelf: "center", fontSize: 12, marginRight: 2, marginBottom: 3, color:AppUtils.getColorForRisk(theData.data[0].countries[0].risk)}}>
                    {theData.data[0].countries[0].risk ? theData.data[0].countries[0].risk +" Risk" : ""}
                  </Text>
                  <Text style={{alignSelf: "center", fontSize: 22, marginBottom: 5}}>
                    {AppLocales.t("NHOME_GENERAL_CHINA")}
                  </Text>
                  <Image
                    source={require('../assets/images/flag/china.png')}
                    style={{width: 20,height: 20, alignSelf:"flex-start", marginLeft: 5, marginTop: 0}}
                  />
                </View>
                
                <View style={{flexDirection:"row",justifyContent: "space-evenly",alignItems: "center"}}>
                <View style={{alignItems: "center"}}>
                  <Text style={{alignSelf: "center", fontSize: 15, 
                    color: AppConstants.COLOR_TEXT_DARKEST_INFO}}>
                  {AppLocales.t("NHOME_CASE_CONFIRMED")}
                  </Text>
                  <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Text style={{color: AppConstants.COLOR_HEADER_BG, fontSize: 36}}>
                      {(theData.data[0].countries[0].case)}</Text>
                  </View>
                  <Text style={{marginTop: 2, fontSize: 20, color: AppConstants.COLOR_TEXT_DARKEST_INFO}}>
                      {"+ " + (theData.data[0].countries[0].case - theData.data[1].countries[0].case)}</Text>
                  <Text style={{alignSelf: "center", fontSize: 12,color: AppConstants.COLOR_TEXT_LIGHT_INFO}}>
                    {AppLocales.t("NHOME_GENERAL_PREV_DAY")}
                  </Text>
                </View>

                <View style={{alignItems: "center"}}>
                  <Text style={{alignSelf: "center", fontSize: 15, 
                    color: AppConstants.COLOR_TEXT_DARKEST_INFO}}>
                  {AppLocales.t("NHOME_CASE_DEATH")}
                  </Text>
                  <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Text style={{color: AppConstants.COLOR_GOOGLE, fontSize: 36}}>
                      {(theData.data[0].countries[0].death)}</Text>
                  </View>
                  <Text style={{marginTop: 2, fontSize: 20, color: AppConstants.COLOR_TEXT_DARKEST_INFO}}>
                      {"+ " + (theData.data[0].countries[0].death - theData.data[1].countries[0].death)}</Text>
                  <Text style={{alignSelf: "center", fontSize: 12,color: AppConstants.COLOR_TEXT_LIGHT_INFO}}>
                    {AppLocales.t("NHOME_GENERAL_PREV_DAY")}
                  </Text>
                </View>
                </View>

                <Button
                      rounded small style={{flexDirection:"row", backgroundColor: AppConstants.COLOR_HEADER_BG,
                        width:100, justifyContent:"center", alignSelf:"center", alignItems:"center", marginTop: 10}}
                        onPress={() => {checkAndShowInterestial();this.props.navigation.navigate("ChinaScreen")}}>
                    <Text style={{fontSize:15, alignSelf:"center"}}>{AppLocales.t("NHOME_GENERAL_MORE")}</Text>
                    <Icon name="arrow-forward" style={{width: 16,fontSize: 16, color: "rgb(240,240,240)", marginLeft: -10}}/>
                  </Button>
              </View>
            </View>



            <View style={styles.statRow}>
              <View style={styles.equalStartRowNormal}>
                <Text style={{alignSelf: "center", fontSize: 22, marginBottom: 5}}>
                  {AppLocales.t("NHOME_GENERAL_OTHER_COUNTRY")}
                </Text>
                
                <View style={{flexDirection:"row",justifyContent: "space-evenly",alignItems: "center"}}>
                <View style={{alignItems: "center"}}>
                  <Text style={{alignSelf: "center", fontSize: 15, 
                    color: AppConstants.COLOR_TEXT_DARKEST_INFO}}>
                  {AppLocales.t("NHOME_CASE_CONFIRMED")}
                  </Text>
                  <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Text style={{color: AppConstants.COLOR_HEADER_BG, fontSize: 36}}>
                      {(theData.data[0].world.case - 
                        theData.data[0].countries[0].case)}</Text>
                  </View>
                  <Text style={{marginTop: 2, fontSize: 20, color: AppConstants.COLOR_TEXT_DARKEST_INFO}}>
                      {"+ " + ((theData.data[0].world.case - 
                        theData.data[0].countries[0].case) - 
                        (theData.data[1].world.case - 
                          theData.data[1].countries[0].case))}</Text>
                  <Text style={{alignSelf: "center", fontSize: 12,color: AppConstants.COLOR_TEXT_LIGHT_INFO}}>
                    {AppLocales.t("NHOME_GENERAL_PREV_DAY")}
                  </Text>
                </View>

                <View style={{alignItems: "center"}}>
                  <Text style={{alignSelf: "center", fontSize: 15, 
                    color: AppConstants.COLOR_TEXT_DARKEST_INFO}}>
                  {AppLocales.t("NHOME_CASE_DEATH")}
                  </Text>
                  <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Text style={{color: AppConstants.COLOR_GOOGLE, fontSize: 36}}>
                      {(theData.data[0].world.death - 
                        theData.data[0].countries[0].death)}</Text>
                  </View>
                  <Text style={{marginTop: 2, fontSize: 20, color: AppConstants.COLOR_TEXT_DARKEST_INFO}}>
                      {"+ " + ((theData.data[0].world.death - 
                        theData.data[0].countries[0].death) - 
                        (theData.data[1].world.death - 
                          theData.data[1].countries[0].death))}</Text>
                  <Text style={{alignSelf: "center", fontSize: 12,color: AppConstants.COLOR_TEXT_LIGHT_INFO}}>
                    {AppLocales.t("NHOME_GENERAL_PREV_DAY")}
                  </Text>
                </View>
                </View>

                <Button
                      rounded small style={{flexDirection:"row", backgroundColor: AppConstants.COLOR_HEADER_BG,
                        width:100, justifyContent:"center", alignSelf:"center", alignItems:"center", marginTop: 10}}
                      onPress={() => {checkAndShowInterestial();this.props.navigation.navigate("OutsideChinaScreen")}}>
                    <Text style={{fontSize:15, alignSelf:"center"}}>{AppLocales.t("NHOME_GENERAL_MORE")}</Text>
                    <Icon name="arrow-forward" style={{width: 16,fontSize: 16, color: "rgb(240,240,240)", marginLeft: -10}}/>
                  </Button>
              </View>
            </View>


            {vietnamData? 
            <View style={styles.statRow}>
              <View style={styles.equalStartRowNormal}>
                <View style={{flexDirection:"row", justifyContent:"center",alignItems: "center"}}>
                  <Text style={{alignSelf: "center", fontSize: 22, marginBottom: 5}}>
                    {AppLocales.t("NHOME_GENERAL_VIETNAM")}
                  </Text>
                  <Image
                    source={require('../assets/images/flag/vietnam.png')}
                    style={{width: 20,height: 20, alignSelf:"flex-start", marginLeft: 5, marginTop: 0}}
                  />
                </View>


                <View style={{flexDirection:"row",justifyContent: "space-evenly",alignItems: "center", marginTop: 3}}>

                <View style={{alignItems: "center"}}>
                  <Text style={{alignSelf: "center", fontSize: 15, 
                    color: AppConstants.COLOR_TEXT_DARKEST_INFO}}>
                  {AppLocales.t("NHOME_CASE_CONFIRMED_VN")}
                  </Text>
                  <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Text style={{color: AppConstants.COLOR_HEADER_BG, fontSize: 36}}>
                      {vietnamData.case}</Text>
                  </View>

                  <Text style={{marginTop: 2, fontSize: 20, color: AppConstants.COLOR_TEXT_DARKEST_INFO}}>
                      {AppUtils.formatValueWithSign((vietnamData.case - vietnamDataPre.case))}</Text>
                  <Text style={{alignSelf: "center", fontSize: 12,color: AppConstants.COLOR_TEXT_LIGHT_INFO}}>
                    {AppLocales.t("NHOME_GENERAL_PREV_DAY")}
                  </Text>
                 
                </View>

                <View style={{alignItems: "center"}}>
                  <Text style={{alignSelf: "center", fontSize: 15, 
                    color: AppConstants.COLOR_TEXT_DARKEST_INFO}}>
                  {AppLocales.t("NHOME_CASE_DEATH_VN")}
                  </Text>
                  <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Text style={{color: AppConstants.COLOR_GOOGLE, fontSize: 36}}>
                      {(vietnamData.death)}</Text>
                  </View>
                  <Text style={{marginTop: 2, fontSize: 20, color: AppConstants.COLOR_TEXT_DARKEST_INFO}}>
                      {AppUtils.formatValueWithSign(vietnamData.death - vietnamDataPre.death)}</Text>
                  <Text style={{alignSelf: "center", fontSize: 12,color: AppConstants.COLOR_TEXT_LIGHT_INFO}}>
                    {AppLocales.t("NHOME_GENERAL_PREV_DAY")}
                  </Text>
                </View>

                </View>


                <View style={{flexDirection:"row",justifyContent: "space-evenly",alignItems: "center", marginTop: 13}}>

                <View style={{alignItems: "center"}}>
                  <Text style={{alignSelf: "center", fontSize: 15, 
                    color: AppConstants.COLOR_TEXT_DARKEST_INFO}}>
                  {AppLocales.t("NHOME_CASE_SUSPECT_VN")}
                  </Text>
                  <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Text style={{color: AppConstants.COLOR_HEADER_BG, fontSize: 36}}>
                      {vietnamData.suspect}</Text>
                  </View>
                </View>

                <View style={{alignItems: "center"}}>
                  <Text style={{alignSelf: "center", fontSize: 15, 
                    color: AppConstants.COLOR_TEXT_DARKEST_INFO}}>
                  {AppLocales.t("NHOME_CASE_ISOLATE_VN")}
                  </Text>
                  <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Text style={{color: AppConstants.COLOR_HEADER_BG, fontSize: 36}}>
                      {(vietnamData.isolate)}</Text>
                  </View>
                </View>

                </View>

                <Button
                      rounded small style={{flexDirection:"row", backgroundColor: AppConstants.COLOR_HEADER_BG,
                        width:100, justifyContent:"center", alignSelf:"center", alignItems:"center", marginTop: 10}}
                      onPress={() => {checkAndShowInterestial();this.props.navigation.navigate("VietnamScreen")}}>
                    <Text style={{fontSize:15, alignSelf:"center"}}>{AppLocales.t("NHOME_GENERAL_MORE")}</Text>
                    <Icon name="arrow-forward" style={{width: 16,fontSize: 16, color: "rgb(240,240,240)", marginLeft: -10}}/>
                  </Button>

              </View>
            </View> : null}



            <View style={styles.statRow}>
              <View style={styles.equalStartRowNormal}>
                <View style={{flexDirection:"row",justifyContent: "space-evenly",alignItems: "center", marginTop: 3}}>

                <View style={{alignItems: "center"}}>
                  <Text style={{alignSelf: "center", fontSize: 15, 
                    color: AppConstants.COLOR_TEXT_DARKEST_INFO}}>
                  {AppLocales.t("NHOME_TRANS_RATE")}
                  </Text>
                  <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Text style={{color: AppConstants.COLOR_HEADER_BG, fontSize: 36}}>
                      {(theData.data[0].tranmission_rate_min)+" - " + 
                      theData.data[0].tranmission_rate_max}</Text>
                  </View>
                  <Text style={{alignSelf: "center", fontSize: 12,color: AppConstants.COLOR_TEXT_LIGHT_INFO, fontStyle:"italic"}}>
                    {AppLocales.t("NHOME_TRANS_RATE_NOTE")}
                  </Text>
                </View>

                <View style={{alignItems: "center"}}>
                  <Text style={{alignSelf: "center", fontSize: 15, 
                    color: AppConstants.COLOR_TEXT_DARKEST_INFO}}>
                  {AppLocales.t("NHOME_FATAL_RATE")}
                  </Text>
                  <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Text style={{color: AppConstants.COLOR_GOOGLE, fontSize: 36}}>
                      {AppUtils.formatToPercent(theData.data[0].world.death, theData.data[0].world.death+theData.data[0].world.case)}</Text>
                  </View>
                  
                  <Text style={{alignSelf: "center", fontSize: 12,color: AppConstants.COLOR_TEXT_LIGHT_INFO, fontStyle:"italic"}}>
                    {AppLocales.t("NHOME_FATAL_RATE_NOTE")}
                  </Text>
                </View>

                </View>


                <View style={{flexDirection:"row",justifyContent: "space-evenly",alignItems: "center", marginTop: 13}}>

                <View style={{alignItems: "center"}}>
                  <Text style={{alignSelf: "center", fontSize: 15, 
                    color: AppConstants.COLOR_TEXT_DARKEST_INFO}}>
                  {AppLocales.t("NHOME_INCU_PERIOD")}
                  </Text>
                  <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Text style={{color: AppConstants.COLOR_HEADER_BG, fontSize: 36}}>
                      {(theData.data[0].incubation_period_min)+" - " + 
                      theData.data[0].incubation_period_max}</Text>
                  </View>
                  <Text style={{alignSelf: "center", fontSize: 12,color: AppConstants.COLOR_TEXT_LIGHT_INFO, fontStyle:"italic"}}>
                    {AppLocales.t("NHOME_INCU_PERIOD_NOTE")}
                  </Text>
                </View>

                <View style={{alignItems: "center"}}>
                  <Text style={{alignSelf: "center", fontSize: 15, 
                    color: AppConstants.COLOR_TEXT_DARKEST_INFO}}>
                  {AppLocales.t("NHOME_COUNTRIES")}
                  </Text>
                  <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Text style={{color: AppConstants.COLOR_HEADER_BG, fontSize: 36}}>
                      {(theData.data[0].countries.length)}</Text>
                  </View>

                  <Text style={{alignSelf: "center", fontSize: 13,color: AppConstants.COLOR_TEXT_DARKDER_INFO}}>
                    {AppUtils.formatValueWithSign((theData.data[0].countries.length - theData.data[1].countries.length)) + 
                    " "+AppLocales.t("NHOME_GENERAL_PREV_DAY")}
                  </Text>
                </View>

                </View>

              </View>
            </View>


            <View style={styles.moneyUsagePieContainer}>
                <Text style={{alignSelf: "center", fontSize: 20, marginBottom: 10}}>
                  {AppLocales.t("NHOME_HEADER_CASE_PIE")}
                </Text>

                <View style={{justifyContent: "center",alignItems: "center",alignSelf: "center", height: 250}}>
                <VictoryPie
                    colorScale={AppConstants.COLOR_SCALE_10}
                    data={[{x:AppLocales.t("NHOME_GENERAL_CHINA"), y: totalCaseChina},
                      {x:AppLocales.t("NHOME_GENERAL_OTHER_COUNTRY"), y: totalCaseWorld-totalCaseChina}]}
                    //innerRadius={80}
                    radius={90}
                    labels={({ datum }) => (datum&&datum.y > 0) ? (
                        (datum.y) + "\n"
                        +"("+AppUtils.formatToPercent(datum.y, totalCaseWorld)+")") : ""}
                    labelRadius={({ radius }) => radius + 10 }
                    labelComponent={<VictoryLabel style={{fontSize: 12}}/>}
                    />
                </View>

                <View style={{marginTop: 5, marginLeft: 10}}>
                    <VictoryContainer
                        width={Layout.window.width}
                        height={20}
                    >
                    <VictoryLegend standalone={false}
                        x={15} y={5}
                        itemsPerRow={4}
                        colorScale={AppConstants.COLOR_SCALE_10}
                        orientation="horizontal"
                        gutter={5}
                        symbolSpacer={5}
                        labelComponent={<VictoryLabel style={{fontSize: 12}}/>}
                        data={[{name:AppLocales.t("NHOME_GENERAL_CHINA")},{name:AppLocales.t("NHOME_GENERAL_OTHER_COUNTRY")}]}
                    />
                    </VictoryContainer>
                </View>
            </View>
          
          
          <NCoVNSarsCoV />
          
          <HomeTotalCasesByTime />

          {/* <View style={{flexDirection:"row", alignSelf: "flex-start", marginBottom: 5, marginLeft: 6}}>
            <Text style={{fontSize: 20, }}>
              {AppLocales.t("NHOME_HEADER_LATEST_MAP")}
            </Text>
          </View>
          <Image
            source={require('../assets/images/who_map.png')}
            style={{width: '100%',height: undefined, aspectRatio: 1220 / 830}}
          />

          <View style={{flexDirection:"row", alignSelf: "flex-end", marginTop: 10,marginRight: 5}}>
            <Text style={{fontSize: 14, fontStyle:"italic",color:AppConstants.COLOR_TEXT_LIGHT_INFO}}>
              {"Data Source is from  "}
            </Text>
            <TouchableOpacity onPress={() => this.onClickSourceWHO()}>
            <Text style={{fontSize: 14, color:AppConstants.COLOR_FACEBOOK, fontStyle:"italic"}}>
              WHO
            </Text>
            </TouchableOpacity>
          </View> */}
                      
          <Text style={{alignSelf: "flex-end", fontSize: 14, marginRight: 5, fontStyle:"italic", color:AppConstants.COLOR_TEXT_LIGHT_INFO, marginTop: 3}}>
            {"Version: " + AppConstants.DEFAULT_VERSION}
          </Text>
          </ScrollView>
        </Content>

      </Container>
    );
  }
}

HomeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppConstants.COLOR_GREY_LIGHT_BG,
    minHeight: Layout.window.height - 50,
    paddingBottom: 40
  },
  contentContainer: {
    backgroundColor: AppConstants.COLOR_GREY_LIGHT_BG,
  },
  gapRow: {
    backgroundColor: AppConstants.COLOR_HEADER_BG,
    height: 70
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    flexGrow: 100,
    paddingTop: 10,
    backgroundColor: AppConstants.COLOR_GREY_LIGHT_BG,
  },
  statRowEnd: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    flexGrow: 100,
    paddingBottom: 5,
    backgroundColor: AppConstants.COLOR_HEADER_BG
  },
  

  equalStartRowSingle: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    marginTop: -70,
    paddingBottom: 10,
    paddingTop: 5,
    // borderWidth: 0.5,
    // borderRadius: 0,
    // flexDirection: "column",
    // justifyContent: "space-evenly",
    // alignItems: "center",

    borderRadius: 14,
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


  equalStartRowNormal: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,

    paddingBottom: 10,
    paddingTop: 5,
    // borderWidth: 0.5,
    // borderRadius: 0,
    // flexDirection: "column",
    // justifyContent: "space-evenly",
    // alignItems: "center",

    borderRadius: 14,
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



  textRow: {
    flexDirection: "row",
    paddingTop: 10,
    paddingLeft: 5,
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    flexGrow: 100
  },
  moneySpendContainer: {
    backgroundColor: "white",
    flexDirection: "column",
    borderWidth: 0.5,
    borderColor: "grey",
    justifyContent: "space-between",
    marginBottom: 20,
    borderRadius: 7,
  },
  barChartStackContainer: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  moneyUsagePieContainer: {
    width: Layout.window.width-20,
    marginLeft: 10,
    marginRight: 10,
    //height: 250,

    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 10,

    paddingBottom: 10,
    paddingTop: 10,

    borderRadius: 10,
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

  gasUsageContainer: {
    width: "96%",
    height: 350,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },

  notifyBadge: {
    position:"relative",
    padding: 0,
    left: -10,
    top: 0,
    // width: 20,
    //width: 20,
    height: 17,
    flexDirection:"column",
    justifyContent: "center"
  },
  notifyBadgeText: {
    position:"relative",
    top: -3,
    fontSize: 11,
  },

  blurViewTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(80, 80, 80, 0.6)",
    height: Layout.window.height - 40
  },

  guideViewAddNewCar: {
    alignItems: "center",
    alignSelf: "center",
    position: 'absolute',
    justifyContent: "center",
    bottom: 20,
    left: 0,
    right: 0,
    backgroundColor: "white",
    paddingTop: 10,
    paddingBottom: 10
  },
});

const mapStateToProps = (state) => ({
  appData: state.appData
});
const mapActionsToProps = {
  actAppSyncLatestDataIfNeeded
};

export default connect(
  mapStateToProps,mapActionsToProps
)(HomeScreen);

