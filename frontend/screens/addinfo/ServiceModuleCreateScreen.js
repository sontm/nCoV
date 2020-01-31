import React from 'react';
import { View, StyleSheet, TextInput, AsyncStorage } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Content, Form, Icon, 
    Item, Picker, Button, Text, Input, Label, Toast} from 'native-base';

import AppConstants from '../../constants/AppConstants'
import { HeaderText } from '../../components/StyledText';
import { connect } from 'react-redux';
import {actCustomAddServiceModule, actCustomAddServiceModuleBike} from '../../redux/UserReducer'
import Backend from '../../constants/Backend'
import apputils from '../../constants/AppUtils';
import AppLocales from '../../constants/i18n';

class ServiceModuleCreateScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            id: 100,
        };

        this.handleCreate = this.handleCreate.bind(this)
    }

    componentWillMount() {
        let countId = this.props.userData.customServiceModules ? 
            this.props.userData.customServiceModules.length + 1 : 0;
        if (AppConstants.TEMPDATA_CREATESERVICEMODULE_ISBIKE) {
            countId = this.props.userData.customServiceModulesBike ? 
                this.props.userData.customServiceModulesBike.length + 1 : 0;
        }
        this.setState({
            id: countId
        })
    }
    handleCreate() {
        // TODO, check Existed
        
        if (AppConstants.TEMPDATA_CREATESERVICEMODULE_ISBIKE) {
            var arrToCheck = [...this.props.userData.customServiceModulesBike, 
                ...this.props.appData.typeServiceBike];
        } else {
            var arrToCheck = [...this.props.userData.customServiceModules, 
                ...this.props.appData.typeService];
        }
        let isDuplicated = false;
        let newName = apputils.changeVietnameseToNonSymbol(this.state.name.trim().toLowerCase());
        for (let i = 0; i < arrToCheck.length; i++) {
            let theName = apputils.changeVietnameseToNonSymbol(arrToCheck[i].name.trim().toLowerCase());
            if (theName == newName) {
                // Duplicated
                isDuplicated = true;
                break;
            }
        }
        if (isDuplicated) {
            Toast.show({
                text: AppLocales.t("TOAST_NEWSERVICEMODULE_EXIST"),
                //buttonText: "Okay",
                position: "top",
                type: "danger"
            })
        } else {
            if (AppConstants.TEMPDATA_CREATESERVICEMODULE_ISBIKE) {
                this.props.actCustomAddServiceModuleBike(this.state)
            } else {
                this.props.actCustomAddServiceModule(this.state)
            }
            AppConstants.TEMPDATA_CREATESERVICEMODULE_ISBIKE = false;
            this.props.navigation.goBack();
        }
    }
    render() {
        return (
            <Container>
            <Content>
                <View style={styles.formContainer}>
                    <View style={styles.rowContainer}>
                        <Item floatingLabel>
                        <Label>{AppLocales.t("SETTING_CREATE_SERVICEMODULE")}</Label>
                        <Input
                            style={styles.rowForm}
                            onChangeText={(name) => this.setState({name})}
                            value={this.state.name}
                        />
                        </Item>
                    </View>

                    <View style={styles.rowButton}>
                    <Button
                        rounded style={{backgroundColor: AppConstants.COLOR_HEADER_BG}}
                        onPress={() => this.handleCreate()}
                            ><Text>{AppLocales.t("MAINTAIN_CREATE_MODULE")}</Text></Button>
                    </View>

                </View>
            </Content>
            </Container>
        );
    }
}

ServiceModuleCreateScreen.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={{backgroundColor: AppConstants.COLOR_HEADER_BG, marginTop:-AppConstants.DEFAULT_IOS_STATUSBAR_HEIGHT}}>
          <Left style={{flex: 1}}>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" style={{color:"white"}}/>
            </Button>
          </Left>
          <Body style={{flex: 5}}>
            <Title><HeaderText>
                {AppConstants.TEMPDATA_CREATESERVICEMODULE_ISBIKE ? (
                    AppLocales.t("MAINTAIN_CREATE_MODULE") + " " + AppLocales.t("GENERAL_BIKE")
                ): (
                    AppLocales.t("MAINTAIN_CREATE_MODULE") + " " + AppLocales.t("GENERAL_CAR")
                )}
            </HeaderText></Title>
          </Body>
          <Right style={{flex: 0}}/>
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
  rowContainer: {
    flexDirection: "row",
    alignItems: "center", // vertial align
    //height: 50,
    //borderWidth: 1,
    //borderColor:"grey"
  },
  rowLabel: {
    flex: 1,
    textAlign: "left",
    paddingRight: 5
  },
  rowForm: {
    flex: 2
  },
  rowButton: {
    marginTop: 20,
    alignSelf: "center",
  },
  btnSubmit: {

  }
});

const mapStateToProps = (state) => ({
    userData: state.userData,
    appData: state.appData
});
const mapActionsToProps = {
    actCustomAddServiceModule,
    actCustomAddServiceModuleBike
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(ServiceModuleCreateScreen);
