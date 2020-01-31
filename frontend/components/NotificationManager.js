// import * as WebBrowser from 'expo-web-browser';
// import React from 'react';
// import { Platform, View, StyleSheet, Image, TextInput, AsyncStorage, TouchableOpacity, ScrollView } from 'react-native';
// import { connect } from 'react-redux';
// import { Notifications } from 'expo';
// import * as Permissions from 'expo-permissions';
// import Constants from 'expo-constants';
// import AppConstants from '../constants/AppConstants';
// import apputils from '../constants/AppUtils';


// class NotificationManager extends React.Component {
//   constructor(props) {
//     super(props);

//   }
//   async registerForPushNotificationsAsync() {
//     if (Constants.isDevice) {
//       const { status: existingStatus } = await Permissions.getAsync(
//         Permissions.NOTIFICATIONS
//       );
//       let finalStatus = existingStatus;
//       console.log('  Origin Status of Notification:' + finalStatus);
//       if (existingStatus !== 'granted') {
//         if (this.props.appData.countOpen == 5) {
//             const { status } = await Permissions.askAsync(
//             Permissions.NOTIFICATIONS
//             );
//             finalStatus = status;
//         }
//       }
//       if (finalStatus !== 'granted') {
//         console.log('  Failed to get push token for push notification!');
//         return;
//       } else {
//         console.log('  Notification permissions granted.')
//       }
//       Notifications.addListener(this.handleNotification);
//     }
//   };

//   handleNotification() {
//     console.log('okkkkkkkk! got your notification');
//   }
//   componentWillUnmount() {
//   }
//   componentDidMount() {
//     console.log("||||Notificationmanager Manager|||| DidMount, count:" + this.props.appData.countOpen)
//     // The first Notification is when User Open app in 5th time
//     this.registerForPushNotificationsAsync();
//     //apputils.scheduleAppLocalNotification("Sap den Ngay Dang Kiem", "Toyota Camry 30L-1234")
//   }

//   render() {
//     return null;
//   }
// }

// const styles = StyleSheet.create({
//     container: {
//     },

// })


// const mapStateToProps = (state) => ({
//     appData: state.appData
// });
// const mapActionsToProps = {

// };
  
// export default connect(
//     mapStateToProps,mapActionsToProps
// )(NotificationManager);
