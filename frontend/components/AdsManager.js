import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { View, StyleSheet, Image, TextInput, AsyncStorage, TouchableOpacity, ScrollView } from 'react-native';
import { Toast } from 'native-base';
import { connect } from 'react-redux';
import {actAppIncreaseOpenCount} from '../redux/AppDataReducer'


import {
    AdMobBanner,
    AdMobInterstitial,
} from 'expo-ads-admob';
import AppConstants from '../constants/AppConstants';
import apputils from '../constants/AppUtils';

var canShowInterestial = true;
export async function checkAndShowInterestial() {
    if (canShowInterestial) {
        AppConstants.ADS_COUNT_CLICK_INTERACTIVE++;
        apputils.CONSOLE_LOG("||AdsManager||: CountInteractive:" + AppConstants.ADS_COUNT_CLICK_INTERACTIVE)
        if (AppConstants.ADS_COUNT_CLICK_INTERACTIVE < AppConstants.ADS_COUNT_CLICK_SHOW_INTERESTIAL) {
            return;
        }
        AppConstants.ADS_COUNT_CLICK_INTERACTIVE = 0;
        try {
            AdMobInterstitial.setAdUnitID(AppConstants.ADS_INTERESTIALID); // Test ID, Replace with your-admob-unit-id
            //AdMobInterstitial.setTestDeviceID('EMULATOR');
            AdMobInterstitial.addEventListener("interstitialDidLoad", () =>
            apputils.CONSOLE_LOG("interstitialDidLoad")
            );
            AdMobInterstitial.addEventListener("interstitialDidFailToLoad", () =>
            apputils.CONSOLE_LOG("interstitialDidFailToLoad")
            );
            AdMobInterstitial.addEventListener("interstitialDidOpen", () =>
            apputils.CONSOLE_LOG("interstitialDidOpen")
            );
            AdMobInterstitial.addEventListener("interstitialDidClose", () =>
            apputils.CONSOLE_LOG("interstitialDidClose")
            );
            AdMobInterstitial.addEventListener("interstitialWillLeaveApplication", () =>
            apputils.CONSOLE_LOG("interstitialWillLeaveApplication")
            );
            await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true});
            await AdMobInterstitial.showAdAsync();
        } catch (error) {
            apputils.CONSOLE_LOG("Interestial Error*");
            apputils.CONSOLE_LOG(error)
        }
    }
}

class AdsManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        didReceiveAd:false,
        bannerError: false
    }
    this.bannerError = this.bannerError.bind(this)
    this.didReceiveAd = this.didReceiveAd.bind(this)
    
  }
  componentWillUnmount() {
    AdMobInterstitial.removeAllListeners();
  }
  componentDidMount() {
    apputils.CONSOLE_LOG("||||Ads Manager|||| DidMount, count:" + this.props.appData.countOpen)
    this.props.actAppIncreaseOpenCount()
    if (this.props.appData.countOpen < 10 || this.props.userData.isNoAds) {
        canShowInterestial = false;
    } else {
        //canShowInterestial = !this.props.appData.isNoAds;
        canShowInterestial = true;
    }
  }
  bannerError(err) {
    apputils.CONSOLE_LOG("-------------Banner Error--------------")
    apputils.CONSOLE_LOG(err)
    // Toast.show({
    //     text: "Ads:"+err,
    //     //buttonText: "Okay",
    //     position: "top",
    //     type: "danger",
    //     duration: 4000
    //   })
    this.setState({bannerError: true})
  }

  didReceiveAd() {
    this.setState({didReceiveAd: true})
  }
  
  render() {
    apputils.CONSOLE_LOG("||||Ads Manager|||| Render, count:" + this.props.appData.countOpen)
    apputils.CONSOLE_LOG(this.props.userData.isNoAds)
    //this.props.appData.isNoAds
    if (this.props.appData.countOpen < 10 || this.props.userData.isNoAds) {
        return null
    } else {
        if (this.state.bannerError)
        {
            return null;
        } else if (this.state.didReceiveAd)
        {
            return (
                <AdMobBanner
                    style={styles.bottomBanner}
                    bannerSize="banner"
                    adUnitID={AppConstants.ADS_BANNERID}
                    //testDeviceID="EMULATOR"
                    onDidFailToReceiveAdWithError={this.bannerError}
                    onAdViewDidReceiveAd = {this.didReceiveAd}
                />
            )
        } else {
            return (
                <View style={{position: "absolute", bottom: AppConstants.DEFAULT_BOTTOM_NAV_HEIGHT, left: 0, right: 0}}>
                    <AdMobBanner
                        style={styles.bottomBanner}
                        bannerSize="banner"
                        adUnitID={AppConstants.ADS_BANNERID}
                        //testDeviceID="EMULATOR"
                        onDidFailToReceiveAdWithError={this.bannerError}
                        onAdViewDidReceiveAd = {this.didReceiveAd}
                    />
                </View>
            )
        }
    }
  }
}

const styles = StyleSheet.create({
    container: {
    },

})


const mapStateToProps = (state) => ({
    appData: state.appData,
    userData: state.userData
});
const mapActionsToProps = {
    actAppIncreaseOpenCount
};
  
export default connect(
    mapStateToProps,mapActionsToProps
)(AdsManager);
