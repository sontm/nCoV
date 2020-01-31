import I18n from "i18n-js";
//import * as RNLocalize from "react-native-localize";

import vn from "./locales/vn";

//const locales = RNLocalize.getLocales();

// if (Array.isArray(locales)) {
//   //I18n.locale = locales[0].languageTag;
// }

I18n.locale = "vn";

I18n.fallbacks = true;
I18n.translations = {
  vn,
  //en
};

export default I18n;
