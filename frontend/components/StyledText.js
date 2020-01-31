import React from 'react';
import { Text, View, StyleSheet} from 'react-native';
import AppLocales from '../constants/i18n'
import AppConstants from '../constants/AppConstants';

export function MonoText(props) {
  return (
    <Text {...props} style={[props.style, { fontFamily: 'space-mono' }]} />
  );
}

export function HeaderText(props) {
  return (
    <Text {...props} style={[props.style, { color: 'white', fontWeight:"normal" }]} />
  );
}

export function WhiteText(props) {
  return (
    <Text {...props} style={[props.style, { color: 'white' }]} />
  );
}

export function TypoH4(props) {
  return (
    <Text {...props} style={[props.style, { fontSize: 20 }]} />
  );
}
export function TypoH5(props) {
  return (
    <Text {...props} style={[props.style, { fontSize: 18 }]} />
  );
}
export function TypoH6(props) {
  return (
    <Text {...props} style={[props.style, { fontSize: 16 }]} />
  );
}

export function NoDataText(props) {
  return (
    <View style={props.noBg ? styles.containerNoDataNoBg : styles.containerNoData}>
      <Text style={{fontSize: 18, color: AppConstants.COLOR_TEXT_LIGHT_INFO}}>
        {props.content ? props.content : AppLocales.t("GENERAL_NODATA")}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  containerNoData: {
    backgroundColor: "white",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0,
    marginBottom: 20,
    minHeight: 100,
    flexWrap:"wrap",
    marginLeft: 5,
    marginRight: 5
  },
  containerNoDataNoBg: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0,
    marginBottom: 20,
    minHeight: 100,
    flexWrap:"wrap",
    marginLeft: 5,
    marginRight: 5
  }
})