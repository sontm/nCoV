import React from 'react';

import { View, StyleSheet, Platform, Switch, KeyboardAvoidingView } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Content, Form, Icon, 
    Item, Picker, Button, Text, Input, Label, H3, Tabs, Tab, TabHeading} from 'native-base';
import {HeaderText, TypoH4} from '../../components/StyledText'
import AppConstants from '../../constants/AppConstants'
import AppLocales from '../../constants/i18n';
import { connect } from 'react-redux';
import {actSettingSetMaintainType} from '../../redux/UserReducer'
import apputils from '../../constants/AppUtils';

class ServiceMaintainSettingScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Km: [5000, 10000, 20000, 40000, 80000],
            Month: [6, 12, 24, 48, 96],
            KmBike: [4000, 8000, 12000, 16000, 20000],
            MonthBike: [4, 8, 12, 18, 24],

            LevelEnable: [true, true, true, false, false],
            LevelBikeEnable: [true, true, false, false, false],
        };
        this.save = this.save.bind(this)
        this.onSetValue = this.onSetValue.bind(this)
        this.onToggleEnable = this.onToggleEnable.bind(this)
        
    }

    save = async (newVehicle) => {
        try {
            apputils.CONSOLE_LOG("WIll Save Maintain Type setting:")
            apputils.CONSOLE_LOG(this.state)
            this.props.actSettingSetMaintainType(this.state)

            this.props.navigation.goBack()
        } catch (e) {
            console.error('Failed to save Vehicle SEtting.')
            apputils.CONSOLE_LOG(e)
        }
    }
    onSetValue(value, level, isMonth, isBike) {
        if (isBike) {
            if (!isMonth) {
                let prevState = this.state;
                prevState.KmBike[level-1] = Number(value);

                this.setState(prevState)
            } else {
                let prevState = this.state;
                prevState.MonthBike[level-1] = Number(value);

                this.setState(prevState)
            }
        } else {
            if (!isMonth) {
                let prevState = this.state;
                prevState.Km[level-1] = Number(value);

                this.setState(prevState)
            } else {
                let prevState = this.state;
                prevState.Month[level-1] = Number(value);

                this.setState(prevState)
            }
        }
    }

    onToggleEnable(level, isBike) {
        if (isBike) {
            let prevState = this.state;
            prevState.LevelBikeEnable[level-1] = !prevState.LevelBikeEnable[level-1]
            this.setState(prevState)
        } else {
            let prevState = this.state;
            prevState.LevelEnable[level-1] = !prevState.LevelEnable[level-1]
            this.setState(prevState)
        }
    }

    componentWillMount() {
        apputils.CONSOLE_LOG("MainainServiceSetting WillMount:")
        if (this.props.userData.settingService) {
            // aready set
            this.setState({
                ...this.props.userData.settingService
            })
        }
    }
    render() {
        return (
            <Container>
            <Tabs style={{flex: 1}}>
            <Tab heading={AppLocales.t("GENERAL_CAR")}
                    tabStyle={{backgroundColor: AppConstants.COLOR_HEADER_BG}}
                    activeTabStyle={{backgroundColor: AppConstants.COLOR_HEADER_BG}}>
                <KeyboardAvoidingView style={{flex: 1, justifyContent: 'center'}} keyboardVerticalOffset={140} 
                behavior={Platform.OS === "ios" ? 'padding' : 'height'}>
                <Content>
                <View style={styles.formContainer}>
                    <Text style={styles.noteRow}>
                        {AppLocales.t("SETTING_MAINTAIN_NOTE")}
                    </Text>

                    <View style={styles.rowContainer}>
                        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                            <Label style={styles.rowLabel}>
                                <TypoH4>{AppLocales.t("SETTING_MAINTAIN_L1")}</TypoH4></Label>
                        </View>

                        <Item stackedLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                            <Label style={styles.rowLabel}>{AppLocales.t("SETTING_MAINTAIN_L1_KM")}</Label>
                            <Input
                                style={styles.rowForm}
                                keyboardType="numeric"
                                onChangeText={(val) => this.onSetValue(val, 1, false)}
                                value={""+this.state.Km[0]}
                            />
                            <Label style={styles.rowLabel}>{AppLocales.t("SETTING_MAINTAIN_L1_TIME")}</Label>
                                <Input
                                style={styles.rowForm}
                                keyboardType="numeric"
                                onChangeText={(val) => this.onSetValue(val, 1, true)}
                                value={""+this.state.Month[0]}
                            />
                        </Item>
                    </View>

                    <View style={styles.rowContainer}>
                        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                            <Label style={styles.rowLabel}>
                                <TypoH4 style={this.state.LevelEnable[1] ? null : styles.levelDisable}>{AppLocales.t("SETTING_MAINTAIN_L2")}</TypoH4></Label>
                            <Switch value={this.state.LevelEnable[1]} onChange={() => this.onToggleEnable(2, false)} 
                                thumbColor={this.state.LevelEnable[1]?AppConstants.COLOR_HEADER_BG_LIGHT:AppConstants.COLOR_GREY_BG} 
                                trackColor={{true: AppConstants.COLOR_HEADER_BG_LIGHT_SUPER, false: AppConstants.COLOR_GREY_MIDDLE_LIGHT_BG}}/>
                        </View>

                        {this.state.LevelEnable[1] ? 
                        <Item stackedLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                            <Label style={styles.rowLabel}>{AppLocales.t("SETTING_MAINTAIN_L1_KM")}</Label>
                            <Input
                                style={styles.rowForm}
                                keyboardType="numeric"
                                onChangeText={(val) => this.onSetValue(val, 2, false)}
                                value={""+this.state.Km[1]}
                            />
                            <Label style={styles.rowLabel}>{AppLocales.t("SETTING_MAINTAIN_L1_TIME")}</Label>
                                <Input
                                style={styles.rowForm}
                                keyboardType="numeric"
                                onChangeText={(val) => this.onSetValue(val, 2, true)}
                                value={""+this.state.Month[1]}
                            />
                        </Item> : null}
                    </View>

                    <View style={styles.rowContainer}>
                        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                            <Label style={styles.rowLabel}>
                                <TypoH4 style={this.state.LevelEnable[2] ? null : styles.levelDisable}>{AppLocales.t("SETTING_MAINTAIN_L3")}</TypoH4></Label>
                            <Switch value={this.state.LevelEnable[2]} onChange={() => this.onToggleEnable(3, false)} 
                                thumbColor={this.state.LevelEnable[2]?AppConstants.COLOR_HEADER_BG_LIGHT:AppConstants.COLOR_GREY_BG} 
                                trackColor={{true: AppConstants.COLOR_HEADER_BG_LIGHT_SUPER, false: AppConstants.COLOR_GREY_MIDDLE_LIGHT_BG}}/>
                        </View>

                        {this.state.LevelEnable[2] ? 
                        <Item stackedLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                            <Label style={styles.rowLabel}>{AppLocales.t("SETTING_MAINTAIN_L1_KM")}</Label>
                            <Input
                                style={styles.rowForm}
                                keyboardType="numeric"
                                onChangeText={(val) => this.onSetValue(val, 3, false)}
                                value={""+this.state.Km[2]}
                            />
                            <Label style={styles.rowLabel}>{AppLocales.t("SETTING_MAINTAIN_L1_TIME")}</Label>
                                <Input
                                style={styles.rowForm}
                                keyboardType="numeric"
                                onChangeText={(val) => this.onSetValue(val, 3, true)}
                                value={""+this.state.Month[2]}
                            />
                        </Item> : null}
                    </View>

                    <View style={styles.rowContainer}>
                        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                            <Label style={styles.rowLabel}>
                                <TypoH4 style={this.state.LevelEnable[3] ? null : styles.levelDisable}>{AppLocales.t("SETTING_MAINTAIN_L4")}</TypoH4></Label>
                            <Switch value={this.state.LevelEnable[3]} onChange={() => this.onToggleEnable(4, false)}
                                thumbColor={this.state.LevelEnable[3]?AppConstants.COLOR_HEADER_BG_LIGHT:AppConstants.COLOR_GREY_BG} 
                                trackColor={{true: AppConstants.COLOR_HEADER_BG_LIGHT_SUPER, false: AppConstants.COLOR_GREY_MIDDLE_LIGHT_BG}}/>
                        </View>

                        {this.state.LevelEnable[3] ? 
                        <Item stackedLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                            <Label style={styles.rowLabel}>{AppLocales.t("SETTING_MAINTAIN_L1_KM")}</Label>
                            <Input
                                style={styles.rowForm}
                                keyboardType="numeric"
                                onChangeText={(val) => this.onSetValue(val, 4, false)}
                                value={""+this.state.Km[3]}
                            />
                            <Label style={styles.rowLabel}>{AppLocales.t("SETTING_MAINTAIN_L1_TIME")}</Label>
                                <Input
                                style={styles.rowForm}
                                keyboardType="numeric"
                                onChangeText={(val) => this.onSetValue(val, 4, true)}
                                value={""+this.state.Month[3]}
                            />
                        </Item> : null}
                    </View>

                    <View style={styles.rowContainer}>
                        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                            <Label style={styles.rowLabel}>
                                <TypoH4 style={this.state.LevelEnable[4] ? null : styles.levelDisable}>{AppLocales.t("SETTING_MAINTAIN_L5")}</TypoH4></Label>
                            <Switch value={this.state.LevelEnable[4]} onChange={() => this.onToggleEnable(5, false)}
                                thumbColor={this.state.LevelEnable[4]?AppConstants.COLOR_HEADER_BG_LIGHT:AppConstants.COLOR_GREY_BG} 
                                trackColor={{true: AppConstants.COLOR_HEADER_BG_LIGHT_SUPER, false: AppConstants.COLOR_GREY_MIDDLE_LIGHT_BG}}/>
                        </View>

                        {this.state.LevelEnable[4] ? 
                        <Item stackedLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                            <Label style={styles.rowLabel}>{AppLocales.t("SETTING_MAINTAIN_L1_KM")}</Label>
                            <Input
                                style={styles.rowForm}
                                keyboardType="numeric"
                                onChangeText={(val) => this.onSetValue(val, 5, false)}
                                value={""+this.state.Km[4]}
                            />
                            <Label style={styles.rowLabel}>{AppLocales.t("SETTING_MAINTAIN_L1_TIME")}</Label>
                                <Input
                                style={styles.rowForm}
                                keyboardType="numeric"
                                onChangeText={(val) => this.onSetValue(val, 5, true)}
                                value={""+this.state.Month[4]}
                            />
                        </Item> : null}
                    </View>

                </View>
                </Content>
                </KeyboardAvoidingView>
                </Tab>








                <Tab heading={AppLocales.t("GENERAL_BIKE")}
                        tabStyle={{backgroundColor: AppConstants.COLOR_HEADER_BG}}
                        activeTabStyle={{backgroundColor: AppConstants.COLOR_HEADER_BG}}>
                <KeyboardAvoidingView style={{flex: 1, justifyContent: 'center'}} keyboardVerticalOffset={140} 
                    behavior={Platform.OS === "ios" ? 'padding' : 'height'}>
                <Content>
                <View style={styles.formContainer}>
                <Text style={styles.noteRow}>
                        {AppLocales.t("SETTING_MAINTAIN_NOTE")}
                    </Text>

                <View style={styles.rowContainer}>
                        <Item stackedLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                            <Label style={styles.rowLabel}>
                                <H3>{AppLocales.t("SETTING_MAINTAIN_L1_BIKE")}</H3></Label>
                            <Label style={styles.rowLabel}>{AppLocales.t("SETTING_MAINTAIN_L1_KM")}</Label>
                            <Input
                                style={styles.rowForm}
                                keyboardType="numeric"
                                onChangeText={(val) => this.onSetValue(val, 1, false, true)}
                                value={""+this.state.KmBike[0]}
                            />
                            <Label style={styles.rowLabel}>{AppLocales.t("SETTING_MAINTAIN_L1_TIME")}</Label>
                                <Input
                                style={styles.rowForm}
                                keyboardType="numeric"
                                onChangeText={(val) => this.onSetValue(val, 1, true, true)}
                                value={""+this.state.MonthBike[0]}
                            />
                        </Item>
                    </View>

                    <View style={styles.rowContainer}>
                        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                            <Label style={styles.rowLabel}>
                                <TypoH4 style={this.state.LevelBikeEnable[1] ? null : styles.levelDisable}>{AppLocales.t("SETTING_MAINTAIN_L2_BIKE")}</TypoH4></Label>
                            <Switch value={this.state.LevelBikeEnable[1]} onChange={() => this.onToggleEnable(2, true)} 
                                thumbColor={this.state.LevelBikeEnable[1]?AppConstants.COLOR_HEADER_BG_LIGHT:AppConstants.COLOR_GREY_BG} 
                                trackColor={{true: AppConstants.COLOR_HEADER_BG_LIGHT_SUPER, false: AppConstants.COLOR_GREY_MIDDLE_LIGHT_BG}}/>
                        </View>

                        {this.state.LevelBikeEnable[1] ? 
                        <Item stackedLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                            <Label style={styles.rowLabel}>{AppLocales.t("SETTING_MAINTAIN_L1_KM")}</Label>
                            <Input
                                style={styles.rowForm}
                                keyboardType="numeric"
                                onChangeText={(val) => this.onSetValue(val, 2, false, true)}
                                value={""+this.state.KmBike[1]}
                            />
                            <Label style={styles.rowLabel}>{AppLocales.t("SETTING_MAINTAIN_L1_TIME")}</Label>
                                <Input
                                style={styles.rowForm}
                                keyboardType="numeric"
                                onChangeText={(val) => this.onSetValue(val, 2, true, true)}
                                value={""+this.state.MonthBike[1]}
                            />
                        </Item> : null }
                    </View>

                    <View style={styles.rowContainer}>
                        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                            <Label style={styles.rowLabel}>
                                <TypoH4 style={this.state.LevelBikeEnable[2] ? null : styles.levelDisable}>{AppLocales.t("SETTING_MAINTAIN_L3_BIKE")}</TypoH4></Label>
                            <Switch value={this.state.LevelBikeEnable[2]} onChange={() => this.onToggleEnable(3, true)} 
                                thumbColor={this.state.LevelBikeEnable[2]?AppConstants.COLOR_HEADER_BG_LIGHT:AppConstants.COLOR_GREY_BG} 
                                trackColor={{true: AppConstants.COLOR_HEADER_BG_LIGHT_SUPER, false: AppConstants.COLOR_GREY_MIDDLE_LIGHT_BG}}/>
                        </View>

                        {this.state.LevelBikeEnable[2] ? 
                        <Item stackedLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                            <Label style={styles.rowLabel}>{AppLocales.t("SETTING_MAINTAIN_L1_KM")}</Label>
                            <Input
                                style={styles.rowForm}
                                keyboardType="numeric"
                                onChangeText={(val) => this.onSetValue(val, 3, false, true)}
                                value={""+this.state.KmBike[2]}
                            />
                            <Label style={styles.rowLabel}>{AppLocales.t("SETTING_MAINTAIN_L1_TIME")}</Label>
                                <Input
                                style={styles.rowForm}
                                keyboardType="numeric"
                                onChangeText={(val) => this.onSetValue(val, 3, true, true)}
                                value={""+this.state.MonthBike[2]}
                            />
                        </Item> : null }
                    </View>

                    <View style={styles.rowContainer}>
                        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                            <Label style={styles.rowLabel}>
                                <TypoH4 style={this.state.LevelBikeEnable[3] ? null : styles.levelDisable}>{AppLocales.t("SETTING_MAINTAIN_L4_BIKE")}</TypoH4></Label>
                            <Switch value={this.state.LevelBikeEnable[3]} onChange={() => this.onToggleEnable(4, true)} 
                                thumbColor={this.state.LevelBikeEnable[3]?AppConstants.COLOR_HEADER_BG_LIGHT:AppConstants.COLOR_GREY_BG} 
                                trackColor={{true: AppConstants.COLOR_HEADER_BG_LIGHT_SUPER, false: AppConstants.COLOR_GREY_MIDDLE_LIGHT_BG}}/>
                        </View>

                        {this.state.LevelBikeEnable[3] ? 
                        <Item stackedLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                            <Label style={styles.rowLabel}>{AppLocales.t("SETTING_MAINTAIN_L1_KM")}</Label>
                            <Input
                                style={styles.rowForm}
                                keyboardType="numeric"
                                onChangeText={(val) => this.onSetValue(val, 4, false, true)}
                                value={""+this.state.KmBike[3]}
                            />
                            <Label style={styles.rowLabel}>{AppLocales.t("SETTING_MAINTAIN_L1_TIME")}</Label>
                                <Input
                                style={styles.rowForm}
                                keyboardType="numeric"
                                onChangeText={(val) => this.onSetValue(val, 4, true, true)}
                                value={""+this.state.MonthBike[3]}
                            />
                        </Item> : null }
                    </View>

                    
                </View>
                </Content>
                </KeyboardAvoidingView>
                </Tab>
            </Tabs>
            <View style={styles.rowButton}>
                <Button
                    rounded style={{backgroundColor: AppConstants.COLOR_HEADER_BG, width: 150, justifyContent:"center"}}
                    onPress={() => this.save(this.state)}
                ><Text>{AppLocales.t("SETTING_REMIND_BTN_SAVE")}</Text></Button>
            </View>
        </Container>
        );
    }
}

ServiceMaintainSettingScreen.navigationOptions = ({navigation}) => ({
    header: (
        <Header hasTabs style={{backgroundColor: AppConstants.COLOR_HEADER_BG, marginTop:-AppConstants.DEFAULT_IOS_STATUSBAR_HEIGHT}}>
          <Left style={{flex: 1}}>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" style={{color:"white"}}/>
            </Button>
          </Left>
          <Body style={{flex: 4}}>
            <Title><HeaderText>{AppLocales.t("SETTING_LBL_MAINTAIN")}</HeaderText></Title>
          </Body>
          <Right style={{flex: 1}}/>
        </Header>
    )
});

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    paddingTop: 15,
    paddingHorizontal: AppConstants.DEFAULT_FORM_PADDING_HORIZON,
    backgroundColor: '#fff',
    flexDirection: "column",
    paddingBottom: 100
  },
  rowContainer: {
    //flexDirection: "row",
    //alignItems: "flex-end", // vertial align
    justifyContent: "center",
    //height: 50,
    width: AppConstants.DEFAULT_FORM_WIDTH,
    alignSelf:"center",
    marginTop: 7,
  },
  rowLabel: {
    flex: 5,
    textAlign: "left",
    paddingRight: 5,
    fontSize: 14
  },
  rowFormNoBorder: {
    flex: 2
  },
  rowForm: {
    flex: 2,
    borderBottomColor: "rgb(230, 230, 230)",
    borderBottomWidth: 0.5
  },
  rowButton: {
    alignItems: "center",
    alignSelf: "center",
    position: 'absolute',
    justifyContent: "center",
    bottom: 5,
    left: 0,
    right: 0,
  },
  btnSubmit: {

  },

  levelDisable: {
      fontStyle: "italic",
      color: AppConstants.COLOR_TEXT_LIGHT_INFO
  },
  noteRow: {
      fontSize: 14,
      fontStyle: "italic",
      color: AppConstants.COLOR_TEXT_LIGHT_INFO,
      marginBottom: 7
  }
});

const mapStateToProps = (state) => ({
    userData: state.userData,
    appData: state.appData
});
const mapActionsToProps = {
    actSettingSetMaintainType
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(ServiceMaintainSettingScreen);

