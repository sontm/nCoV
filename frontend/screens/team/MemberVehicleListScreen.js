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
  AsyncStorage
} from 'react-native';
import {HeaderText} from '../../components/StyledText'
import {Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text, Card, CardItem, Picker, Subtitle} from 'native-base';

import VehicleBasicReport from '../../components/VehicleBasicReport'
import AppLocales from '../../constants/i18n'
import AppConstants from '../../constants/AppConstants'

class MemberVehicleListScreen extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
          <View style={styles.container}>
            <ScrollView
              contentContainerStyle={styles.contentContainer}>
              {this.props.navigation.state.params && this.props.navigation.state.params.member &&
                this.props.navigation.state.params.member.vehicleList.map(item => (
                <VehicleBasicReport vehicle={item} key={item.id} handleDeleteVehicle={() => {}}
                  navigation={this.props.navigation} requestDisplay={"all"} isTeamDisplay={false}
                />
              ))}

            </ScrollView>
          </View>
    );
  }
}

MemberVehicleListScreen.navigationOptions = ({navigation}) => ({
  header: (
    <Header style={{backgroundColor: AppConstants.COLOR_HEADER_BG, marginTop:-AppConstants.DEFAULT_IOS_STATUSBAR_HEIGHT}}>
      <Left style={{flex: 1}}>
        <Button transparent onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" style={{color:"white"}}/>
        </Button>
      </Left>
      <Body  style={{flex: 4}}>
        <Title><HeaderText>{navigation.state.params.member.fullName}</HeaderText></Title>
        <Subtitle><HeaderText style={{fontSize: 13}}>
          {navigation.state.params.member.email ? navigation.state.params.member.email : null}</HeaderText></Subtitle>
      </Body>
      <Right  style={{flex: 1}}/>
    </Header>
  )
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {

  },
  sortContainer: {
    marginLeft: 10,
    marginRight: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
  },
});

const mapStateToProps = (state) => ({
});
const mapActionsToProps = {
};

export default connect(
  mapStateToProps,mapActionsToProps
)(MemberVehicleListScreen);

