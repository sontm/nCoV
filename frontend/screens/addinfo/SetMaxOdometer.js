import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Content, Form, Icon, Item, Picker, 
    Button, Text, Input, Label, Card, CardItem } from 'native-base';

import AppConstants from '../../constants/AppConstants'
import { HeaderText } from '../../components/StyledText';
import { connect } from 'react-redux';
import {actUserSetMaxOdometer} from '../../redux/UserReducer'
import Backend from '../../constants/Backend'
import apputils from '../../constants/AppUtils';
import AppLocales from '../../constants/i18n';
import NetInfo from "@react-native-community/netinfo";

class SetMaxOdometer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            maxMeter: 99999,
            vehicleId: 0
        };

        this.handleSubmit = this.handleSubmit.bind(this)
    }
    handleSubmit() {
        if (!isNaN(Number(this.state.maxMeter))) {
            this.props.actUserSetMaxOdometer({
                vehicleId: this.state.vehicleId,
                maxMeter: Number(this.state.maxMeter)
            });
            this.props.navigation.goBack();
        }
    }
    componentWillMount() {
        if (this.props.navigation.state.params.vehicleId) {
            this.setState({
                vehicleId: this.props.navigation.state.params.vehicleId
            })
        }
    }
    render() {
        return (
            <Container>
            <Content>
                <View style={styles.formContainer}>
                    <View style={styles.rowContainer}>
                        <Item stackedLabel>
                        <Label>
                            {AppLocales.t("ADD_MAX_METER_LBL")}
                        </Label>
                        <Input
                            onChangeText={(maxMeter) => this.setState({maxMeter})}
                            value={""+this.state.maxMeter}
                            keyboardType="numeric"
                        />
                        </Item>
                    </View>

                    <View style={styles.rowButton}>
                    <Button
                        rounded style={styles.btnSubmit}
                        onPress={() => this.handleSubmit()}
                        ><Text>{AppLocales.t("GENERAL_CONFIRM")}</Text></Button>
                    </View>

                </View>
            </Content>
            </Container>
        );
    }
}

SetMaxOdometer.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={{backgroundColor: AppConstants.COLOR_HEADER_BG, marginTop:-AppConstants.DEFAULT_IOS_STATUSBAR_HEIGHT}}>
          <Left>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" style={{color:"white"}}/>
            </Button>
          </Left>
          <Body>
            <Title><HeaderText>{AppLocales.t("ADD_MAX_METER_HEADER")}</HeaderText></Title>
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
    width: AppConstants.DEFAULT_FORM_BUTTON_WIDTH,
    backgroundColor: AppConstants.COLOR_BUTTON_BG,
    justifyContent: "center",
  }
});

const mapStateToProps = (state) => ({
    userData: state.userData
});
const mapActionsToProps = {
    actUserSetMaxOdometer
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(SetMaxOdometer);
