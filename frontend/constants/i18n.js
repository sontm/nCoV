import I18n from "i18n-js";
// import * as RNLocalize from "react-native-localize";

// console.log(RNLocalize.getLocales());

import vn from "./locales/vn";
import en from "./locales/en";

//const locales = RNLocalize.getLocales();
//console.log("+++++++++++++ locales")
//console.log(locales)
// if (Array.isArray(locales)) {
//   //I18n.locale = locales[0].languageTag;
// }

I18n.locale = "en";

I18n.fallbacks = true;
I18n.translations = {
  vn,
  en
};

export default I18n;
