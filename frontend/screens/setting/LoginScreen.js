import React from 'react';
import { View, StyleSheet, TextInput, AsyncStorage } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Content, Form, Icon, Item, Picker, Button, Text, Input } from 'native-base';

import { HeaderText } from '../../components/StyledText';
import AppConstants from '../../constants/AppConstants'

import { connect } from 'react-redux';
import {actUserLoginOK} from '../../redux/UserReducer';

import Backend from '../../constants/Backend'
import apputils from '../../constants/AppUtils';

class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            message: ""
        };

        this.handleLogin = this.handleLogin.bind(this)
    }
    handleLogin() {
        Backend.login({email: this.state.email, password: this.state.password}, 
            response => {
                apputils.CONSOLE_LOG("Login OK")
                apputils.CONSOLE_LOG(response.data)
                this.props.actUserLoginOK(response.data)
                this.props.navigation.navigate("Settings")
            },
            error => {
                apputils.CONSOLE_LOG("Login ERROR")
                apputils.CONSOLE_LOG(error)
                this.setState({
                    message: "Login Error!"
                })
            }
        );
    }

    render() {
        return (
            <Container>
            <Content>
                <View style={styles.formContainer}>
                    <View style={styles.rowContainer}>
                        <Text style={styles.rowLabel}>
                            Email:
                        </Text>
                        <Item regular style={styles.rowForm}>
                        <Input
                            placeholder="Email"
                            onChangeText={(email) => this.setState({email})}
                            value={this.state.email}
                        />
                        </Item>
                    </View>
                    
                    <View style={styles.rowContainer}>
                        <Text style={styles.rowLabel}>
                            Password:
                        </Text>
                        <Item regular style={styles.rowForm}>
                        <Input
                            placeholder="Password"
                            onChangeText={(password) => this.setState({password})}
                            value={this.state.password}
                        />
                        </Item>
                    </View>
                    
                    <View style={styles.rowButton}>
                    <Button
                        rounded style={{backgroundColor: AppConstants.COLOR_HEADER_BG}}
                        onPress={() => this.handleLogin()}
                    ><Text>OK</Text></Button>
                    </View>

                </View>
            </Content>
            </Container>
        );
    }
}

LoginScreen.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={{backgroundColor: AppConstants.COLOR_HEADER_BG, marginTop:-AppConstants.DEFAULT_IOS_STATUSBAR_HEIGHT}}>
          <Left>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" style={{color:"white"}}/>
            </Button>
          </Left>
          <Body>
            <Title><HeaderText>Login</HeaderText></Title>
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
    height: 50,
    borderWidth: 1,
    borderColor:"grey"
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
    marginTop: 20,
    alignSelf: "center",
  },
  btnSubmit: {

  }
});

const mapStateToProps = (state) => ({

});
const mapActionsToProps = {
    actUserLoginOK
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(LoginScreen);
