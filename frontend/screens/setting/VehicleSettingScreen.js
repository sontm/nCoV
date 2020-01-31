import React from 'react';
import { View, StyleSheet, TextInput, AsyncStorage } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Content, Form, Icon, Item, Picker, Button, Text, Input, Label} from 'native-base';
import {HeaderText} from '../../components/StyledText'
import AppConstants from '../../constants/AppConstants'
import AppLocales from '../../constants/i18n';
import { connect } from 'react-redux';
import {actSettingSetRemind} from '../../redux/UserReducer'
import apputils from '../../constants/AppUtils';

class VehicleSettingScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            kmForOilRemind: 50,
            dayForAuthRemind: 15,
            dayForInsuranceRemind: 15,
            dayForRoadFeeRemind: 15,
        };

        this.save = this.save.bind(this)
    }

    save = async (newVehicle) => {
        try {
            apputils.CONSOLE_LOG("WIll Save Vehicle SEtting Default:")
            let newData = {
                kmForOilRemind: Number(this.state.kmForOilRemind),
                dayForAuthRemind: Number(this.state.dayForAuthRemind),
                dayForInsuranceRemind: Number(this.state.dayForInsuranceRemind),
                dayForRoadFeeRemind: Number(this.state.dayForRoadFeeRemind),
            }
            apputils.CONSOLE_LOG(newData)
            this.props.actSettingSetRemind(newData)

            this.props.navigation.navigate('Settings')
        } catch (e) {
            console.error('Failed to save Vehicle SEtting.')
            apputils.CONSOLE_LOG(e)
        }
    }
    componentWillMount() {
        apputils.CONSOLE_LOG("VehicleSEttingScreen WillMount:" + JSON.stringify(this.props.settingData))
        if (this.props.userData.settings && this.props.userData.settings.kmForOilRemind) {
            // aready set
            this.setState({
                ...this.props.userData.settings
            })
        }
    }
    render() {
        return (
            <Container>
            <Content>
                <View style={styles.formContainer}>
                    <View style={styles.rowContainer}>
                        <Item stackedLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                            <Label style={styles.rowLabel}>
                                {AppLocales.t("SETTING_REMIND_OIL_CAR")}{" (" + AppLocales.t("GENERAL_KM")+")"}</Label>
                            <Input
                                style={styles.rowForm}
                                keyboardType="numeric"
                                onChangeText={(kmForOilRemind) => this.setState({kmForOilRemind})}
                                value={""+this.state.kmForOilRemind}
                            />
                        </Item>
                    </View>

                    <View style={styles.rowContainer}>
                        <Item stackedLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                            <Label style={styles.rowLabel}>
                                {AppLocales.t("SETTING_REMIND_AUTH")}{" (" + AppLocales.t("GENERAL_DAY")+")"}</Label>
                            <Input
                                style={styles.rowForm}
                                keyboardType="numeric"
                                onChangeText={(dayForAuthRemind) => this.setState({dayForAuthRemind})}
                                value={""+this.state.dayForAuthRemind}
                            />
                        </Item>
                    </View>

                    <View style={styles.rowContainer}>
                        <Item stackedLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                            <Label style={styles.rowLabel}>
                                {AppLocales.t("SETTING_REMIND_INSURANCE")}{" (" + AppLocales.t("GENERAL_DAY")+")"}</Label>
                            <Input
                                style={styles.rowForm}
                                keyboardType="numeric"
                                onChangeText={(dayForInsuranceRemind) => this.setState({dayForInsuranceRemind})}
                                value={""+this.state.dayForInsuranceRemind}
                            />
                        </Item>
                    </View>

                    <View style={styles.rowContainer}>
                        <Item stackedLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                            <Label style={styles.rowLabel}>
                                {AppLocales.t("SETTING_REMIND_ROAD_FEE")}{" (" + AppLocales.t("GENERAL_DAY")+")"}</Label>
                            <Input
                                style={styles.rowForm}
                                keyboardType="numeric"
                                onChangeText={(dayForRoadFeeRemind) => this.setState({dayForRoadFeeRemind})}
                                value={""+this.state.dayForRoadFeeRemind}
                            />
                        </Item>
                    </View>
                    
                    <View style={styles.rowButton}>
                    <Button
                        rounded primary
                        onPress={() => this.save(this.state)}
                    ><Text>{AppLocales.t("SETTING_REMIND_BTN_SAVE")}</Text></Button>
                    </View>

                </View>
            </Content>
            </Container>
        );
    }
}

VehicleSettingScreen.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={{backgroundColor: AppConstants.COLOR_HEADER_BG, marginTop:-AppConstants.DEFAULT_IOS_STATUSBAR_HEIGHT}}>
          <Left style={{flex: 1}}>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" style={{color:"white"}}/>
            </Button>
          </Left>
          <Body style={{flex: 4}}>
            <Title><HeaderText>{AppLocales.t("SETTING_REMIND_HEADER")}</HeaderText></Title>
          </Body>
          <Right style={{flex: 1}}/>
        </Header>
    )
});

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    paddingTop: 5,
    paddingHorizontal: AppConstants.DEFAULT_FORM_PADDING_HORIZON,
    backgroundColor: '#fff',
    flexDirection: "column"
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "flex-end", // vertial align
    justifyContent: "center",
    //height: 50,
    width: AppConstants.DEFAULT_FORM_WIDTH,
    alignSelf:"center",
    marginTop: 12
  },
  rowLabel: {
    flex: 5,
    textAlign: "left",
    paddingRight: 5,
    fontSize: 14
  },
  rowForm: {
    flex: 2,
    borderBottomColor: "rgb(230, 230, 230)",
    borderBottomWidth: 0.5
  },
  rowButton: {
    marginTop: 20,
    alignSelf: "center",
  },
  btnSubmit: {

  }
});

const mapStateToProps = (state) => ({
    userData: state.userData
});
const mapActionsToProps = {
    actSettingSetRemind
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(VehicleSettingScreen);

