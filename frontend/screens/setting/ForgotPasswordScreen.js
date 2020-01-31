import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Content, Form, Icon, Item, Picker, 
    Button, Text, Input, Label, Card, CardItem, Toast } from 'native-base';

import AppConstants from '../../constants/AppConstants'
import { HeaderText } from '../../components/StyledText';
import { connect } from 'react-redux';

import Backend from '../../constants/Backend'
import apputils from '../../constants/AppUtils';
import AppLocales from '../../constants/i18n';
import NetInfo from "@react-native-community/netinfo";

class ForgotPasswordScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email:""
        };

        this.handleSubmit = this.handleSubmit.bind(this)
    }
    handleSubmit() {
        if (this.state.email.length> 0 && this.state.email.indexOf("@") > 0) {
            NetInfo.fetch().then(state => {
                if (state.isConnected) {
                    Backend.requestResetPwd({
                        email: this.state.email
                        }, 
                        response => {
                            apputils.CONSOLE_LOG("requestResetPwd")
                            apputils.CONSOLE_LOG(response.data)
                            Alert.alert(
                                AppLocales.t("GENERAL_NOTIFICATION"),
                                "1 email đã được gửi đến hòm thư " + this.state.email+ ", xin hãy làm theo hướng dẫn. " +
                                "(Đừng quên kiểm tra luôn cả thư mục Spam nữa nhé).",
                                [
                                    {
                                      text: 'OK',
                                      onPress: () => this.props.navigation.goBack(),
                                      style: 'cancel',
                                    },
                                ],
                                {cancelable: true}
                            )
                        },
                        error => {
                            apputils.CONSOLE_LOG("request Reset ERROR")
                            apputils.CONSOLE_LOG((error))
                            if (error.response.data.msg) {
                            Alert.alert(
                                "Lỗi",
                                error.response.data.msg,
                                [
                                    {
                                      text: 'OK',
                                      onPress: () => this.props.navigation.goBack(),
                                      style: 'cancel',
                                    },
                                ],
                                {cancelable: true}
                            )
                            } else {
                                Alert.alert(
                                    "Lỗi",
                                    "Có lỗi xảy ra trong quá trình truyền. Hãy thử lại lần sau.",
                                    [
                                        {
                                          text: 'OK',
                                          onPress: () => this.props.navigation.goBack(),
                                          style: 'cancel',
                                        },
                                    ],
                                    {cancelable: true}
                                )
                            }
                        }
                    );
                } else {
                    Toast.show({
                        text: AppLocales.t("TOAST_NEED_INTERNET_CON"),
                        //buttonText: "Okay",
                        position: "top",
                        type: "danger"
                    })
                }
            });
        } else {
            Toast.show({
                text: "Email không đúng",
                //buttonText: "Okay",
                position: "top",
                type: "danger"
            })
        }
    }
    
    render() {
        return (
            <Container>
            <Content>
                <View style={styles.formContainer}>
                    <View style={styles.rowContainer}>
                        <Item floatingLabel>
                        <Label>
                            Email
                        </Label>
                        <Input
                            onChangeText={(email) => this.setState({email})}
                            value={this.state.email}
                            keyboardType="email-address"
                        />
                        </Item>
                    </View>

                    <View style={styles.rowButton}>
                    <Button
                        rounded style={{backgroundColor:AppConstants.COLOR_HEADER_BG}}
                        onPress={() => this.handleSubmit()}
                        ><Text>{AppLocales.t("GENERAL_CONFIRM")}</Text></Button>
                    </View>

                    <Text style={{marginTop: 10, marginBottom: 7, fontSize: 15, color:AppConstants.COLOR_TEXT_LIGHT_INFO}}>
                        {AppLocales.t("SETTING_LBL_PWD_FORGOT_DESC")}
                    </Text>
                    
                </View>
            </Content>
            </Container>
        );
    }
}

ForgotPasswordScreen.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={{backgroundColor: AppConstants.COLOR_HEADER_BG, marginTop:-AppConstants.DEFAULT_IOS_STATUSBAR_HEIGHT}}>
          <Left>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" style={{color:"white"}}/>
            </Button>
          </Left>
          <Body>
            <Title><HeaderText>{AppLocales.t("SETTING_LBL_PWD_FORGOT")}</HeaderText></Title>
          </Body>
          <Right />
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
    textAlign: "right",
    paddingRight: 5
  },
  rowForm: {
    flex: 2
  },
  rowButton: {
    marginTop: 10,
    alignSelf: "center",
  },
  btnSubmit: {

  }
});

const mapStateToProps = (state) => ({
});
const mapActionsToProps = {

};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(ForgotPasswordScreen);
