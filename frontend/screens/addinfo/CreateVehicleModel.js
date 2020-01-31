import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Content, Form, Icon, Item, Picker, 
    Button, Text, Input, Label, CheckBox, Toast } from 'native-base';

import AppConstants from '../../constants/AppConstants'
import { HeaderText } from '../../components/StyledText';
import { connect } from 'react-redux';
import {actUserCreateNewVehicleModel} from '../../redux/UserReducer'
import Backend from '../../constants/Backend'
import apputils from '../../constants/AppUtils';
import AppLocales from '../../constants/i18n';
import NetInfo from "@react-native-community/netinfo";

class CreateVehicleModel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            brand: '',
            model: '',
            type: 'car', // car or bike
        };

        this.handleSubmit = this.handleSubmit.bind(this)
    }
    handleSubmit() {
        if (!this.state.brand || !this.state.model || !this.state.type) {
            Toast.show({
                text: AppLocales.t("TOAST_NEED_FILL_ENOUGH"),
                //buttonText: "Okay",
                position: "top",
                type: "danger"
            })
        } else {
            // Check if the New Name Exist
            let isExist = false;
            this.props.appData.carModels.forEach (item => {
                if (this.state.type == item.type && this.state.brand == item.name) {
                    // check if Exist in models
                    if (item.models) {
                        item.models.forEach( m => {
                            if (m.name.trim().toLowerCase() == this.state.model.trim().toLowerCase()) {
                                isExist = true;
                            }
                        })
                    }
                }
            })
            // Check in Custom name also
            if (!isExist && this.props.userData.customVehicleModel&& this.props.userData.customVehicleModel.length>0) {
                this.props.userData.customVehicleModel.forEach (item => {
                    if (this.state.type == item.type && this.state.brand == item.name) {
                        // check if Exist in models
                        if (item.models) {
                            item.models.forEach( m => {
                                if (m.name.trim().toLowerCase() == this.state.model.trim().toLowerCase()) {
                                    isExist = true;
                                }
                            })
                        }
                    }
                })
            }
            if (isExist) {
                Toast.show({
                    text: AppLocales.t("TOAST_NEWVEHICLEMODULE_EXIST"),
                    //buttonText: "Okay",
                    position: "top",
                    type: "danger"
                })
                
            } else {
                //{type, brand, model}
                this.props.actUserCreateNewVehicleModel({
                    type: this.state.type,
                    brand: this.state.brand,
                    model: this.state.model
                });
                this.props.navigation.goBack();
            }
        }
    }
    getBrandsList(data) {
        //let result = [{ id: 0,name: "-"+AppLocales.t("NEW_CAR_BRAND")+"-"}];
        let result = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i].type==this.state.type) {
                result.push({id: data[i].id, name: data[i].name})
            }
        }
        return result;
    }
    componentWillMount() {
        // Set to the First Car in List
        if (this.props.appData.carModels && this.props.appData.carModels.length > 0) {
            this.setState({
                brand: this.props.appData.carModels[0].name
            })
        }
    }
    render() {
        return (
            <Container>
            <KeyboardAvoidingView style={{flex: 1, justifyContent: 'center'}} keyboardVerticalOffset={100} 
                behavior={Platform.OS === "ios" ? 'padding' : 'height'}>
            <Content>
                <View style={styles.formContainer}>
                    <View style={styles.rowContainer}>
                        <Item stackedLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                            <View style={{flexDirection:"row", alignSelf:"flex-start"}}>
                                <Label>{AppLocales.t("NEW_CAR_TYPE")}</Label>
                            </View>
                            <View style={{...styles.rowFormNoBorder, marginTop: 10}}>
                                <CheckBox checked={this.state.type == "car"} 
                                    onPress={() =>this.setState({type: "car"})}/>
                                <TouchableOpacity onPress={() =>this.setState({type: "car"})} style={{flexDirection: "row"}}>
                                <Text>{"    " + AppLocales.t("GENERAL_CAR")+""}</Text>
                                </TouchableOpacity>

                            
                                <CheckBox style={{marginLeft: 30}} checked={this.state.type == "bike"} 
                                    onPress={() =>this.setState({type: "bike"})}/>
                                <TouchableOpacity onPress={() =>this.setState({type: "bike"})}  style={{flexDirection: "row"}}>
                                    <Text>{"    " + AppLocales.t("GENERAL_BIKE")+""}</Text>
                                </TouchableOpacity>
                            </View>
                        </Item>
                    </View>


                    <View style={styles.rowContainer}>
                        {/* <Item regular> */}
                        <Item stackedLabel style={{borderWidth: 0, borderColor: "rgba(0,0,0,0)"}}>
                            <Label>{AppLocales.t("NEW_CAR_BRAND")}</Label>
                            <View style={styles.rowForm}>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down" />}
                                style={{width: AppConstants.DEFAULT_FORM_WIDTH}}
                                placeholder={"--"+AppLocales.t("NEW_CAR_BRAND")+"--"}
                                placeholderStyle={{ color: "#bfc6ea" }}
                                placeholderIconColor="#007aff"
                                selectedValue={this.state.brand}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState({brand: itemValue})
                                }
                            >
                                {this.getBrandsList(this.props.appData.carModels).map(item => (
                                    <Picker.Item label={item.name} value={item.name} key={item.id}/>
                                ))}
                            </Picker>
                            </View>
                        </Item>
                    </View>

                    <View style={styles.rowContainer}>
                        <Item stackedLabel>
                        <Label>
                            {AppLocales.t("ADD_MODEL_LABEL")}
                        </Label>
                        <Input
                            onChangeText={(model) => this.setState({model})}
                            value={this.state.model}
                        />
                        </Item>
                    </View>

                    <View style={styles.rowButton}>
                    <Button
                        rounded style={styles.btnSubmit}
                        onPress={() => this.handleSubmit()}
                        ><Text>{AppLocales.t("ADD_MODEL_TITLE")}</Text></Button>
                    </View>

                </View>
            </Content>
            </KeyboardAvoidingView>
            </Container>
        );
    }
}

CreateVehicleModel.navigationOptions = ({navigation}) => ({
    header: (
        <Header style={{backgroundColor: AppConstants.COLOR_HEADER_BG, marginTop:-AppConstants.DEFAULT_IOS_STATUSBAR_HEIGHT}}>
          <Left>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" style={{color:"white"}}/>
            </Button>
          </Left>
          <Body>
            <Title><HeaderText>{AppLocales.t("ADD_MODEL_TITLE")}</HeaderText></Title>
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
  rowFormNoBorder: {
    flexDirection: "row",
    width: AppConstants.DEFAULT_FORM_WIDTH,
  },
  rowForm: {
    flex: 2
  },
  rowButton: {
    marginTop: 10,
    alignSelf: "center",
  },
  btnSubmit: {
    width: AppConstants.DEFAULT_FORM_BUTTON_WIDTH + 30,
    backgroundColor: AppConstants.COLOR_BUTTON_BG,
    justifyContent: "center",
  }
});

const mapStateToProps = (state) => ({
    userData: state.userData,
    appData: state.appData
});
const mapActionsToProps = {
    actUserCreateNewVehicleModel
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(CreateVehicleModel);
