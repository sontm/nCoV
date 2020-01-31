import { StatusBar } from 'react-native';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState } from 'react';
import { Platform, StyleSheet, View, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Root } from "native-base";

import AppNavigator from './navigation/AppNavigator';
import { store, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';

import axios from 'axios';
import axiosDefaults from 'axios/lib/defaults';
import AppConstants from './constants/AppConstants';
import AdsManager from './components/AdsManager';
import NotificationManager from './components/NotificationManager';
import CheckLatestAppDataManager from './components/CheckLatestAppDataManager';
import apputils from './constants/AppUtils';

axios.defaults.baseURL = AppConstants.SERVER_API;

// import {pushNotification} from './components/pushNotification'

// pushNotification.configure();

const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <StatusBar translucent backgroundColor={backgroundColor} {...props} />
  </View>
);

//If you are using react, wrap your root component with PersistGate. 
//This delays the rendering of your app's UI until your persisted state has been retrieved and saved to redux
class App extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        isLoadingComplete: false
      }
      this.setLoadingComplete = this.setLoadingComplete.bind(this);
  }
  setLoadingComplete(param) {
    this.setState({
      isLoadingComplete: param
    })
  }
  
  // These will be called Apter Redux-Load, so can connect to Server
  // componentWillMount() {
  //   apputils.CONSOLE_LOG("App componentWillMount*********************")
  // }
  // componentDidMount() {
  //   apputils.CONSOLE_LOG("App componentDidMount*********************")
  // }
  // async componentWillMount() {
  //   apputils.CONSOLE_LOG("App componentWillMount*********************")
    // await Font.loadAsync({
    //   Roboto: require("native-base/Fonts/Roboto.ttf"),
    //   Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    // });
    // this.setState({ loading: false });
  // }

  render() {
    //StatusBar.setBarStyle('light-content', true);
    //const [isLoadingComplete, setLoadingComplete] = useState(false);
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={loadResourcesAsync}
          onError={handleLoadingError}
          onFinish={() => handleFinishLoading(this.setLoadingComplete)}
        />
      );
    } else {
      //https://stackoverflow.com/questions/45044941/react-native-expo-stacknavigator-overlaps-notification-bar
      // Add a view to take the space of Statusbar

      // BUT To Keyboard Not HIDE the Text box, we need to set a StatusBar in app.json. Color has no meaning
      return (
        <View style={styles.container}>
          {Platform.OS == "ios" ? 
            <MyStatusBar backgroundColor={AppConstants.COLOR_HEADER_BG} barStyle="light-content" /> : 
            <StatusBar barStyle="light-content"/>}
          <View style={{ backgroundColor: AppConstants.COLOR_HEADER_BG , height: StatusBar.currentHeight }} />
          <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Root>
            <AppNavigator/>
            </Root>
            {/* <View style={{position: "absolute", bottom: AppConstants.DEFAULT_BOTTOM_NAV_HEIGHT, left: 0, right: 0}}> */}
              {/* <AdsManager /> */}
            {/* </View> */}
            {/* <NotificationManager /> */}
            <CheckLatestAppDataManager />
          </PersistGate>
          </Provider>
        </View>
      );
    }
  }
}

async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([
      require('./assets/images/logo/chevrolet.png'),
      require('./assets/images/logo/daihatsu.png'),
      require('./assets/images/logo/ford.png'),
      require('./assets/images/logo/honda.png'),
      require('./assets/images/logo/hyundai.png'),
      require('./assets/images/logo/isuzu.png'),
      require('./assets/images/logo/kia.png'),
      require('./assets/images/logo/mazda.png'),
      require('./assets/images/logo/mercedes.png'),
      require('./assets/images/logo/mitsubishi.png'),
      require('./assets/images/logo/nissan.png'),
      require('./assets/images/logo/subaru.png'),
      require('./assets/images/logo/suzuki.png'),
      require('./assets/images/logo/toyota.png'),
      require('./assets/images/logo/vinfast.png'),
      require('./assets/images/logo/defaultcar.png'),

      require('./assets/images/logo/defaultbike.png'),
      require('./assets/images/logo/honda-bike.png'),
      require('./assets/images/logo/piaggio-bike.png'),
      require('./assets/images/logo/suzuki-bike.png'),
      require('./assets/images/logo/sym-bike.png'),
      require('./assets/images/logo/yamaha-bike.png'),
      

      //require('./assets/images/toyota.png')
    ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free to
      // remove this if you are not using it in your app
      'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    }),
  ]);
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

const STATUSBAR_HEIGHT = Platform.OS == 'ios' ? AppConstants.DEFAULT_IOS_STATUSBAR_HEIGHT : 0;
//const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppConstants.COLOR_GREY_LIGHT_BG,
    //marginTop: StatusBar.currentHeight,
    marginTop: STATUSBAR_HEIGHT, // in ios, need to margin -20 screen 
  },
  // statusBar: {
  //   height: STATUSBAR_HEIGHT,
  // },
  bottomBanner: {
    //position: "absolute",
    bottom: 0
  },
});

export default App;
