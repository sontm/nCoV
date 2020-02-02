import { Platform } from 'react-native';
import AppConstants from './AppConstants'
import Backend from '../constants/Backend';
import AppLocales from '../constants/i18n'
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import NetInfo from "@react-native-community/netinfo";
import {Toast} from 'native-base';

const DEFAULT_SETTING_SERVICE = {
    Km: [5000, 10000, 20000, 40000, 80000],
    Month: [6, 12, 24, 48, 96]
}
const dateFormat = require('dateformat');
// dateFormat.i18n = {
//     dayNames: [
//         'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
//         'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
//     ],
//     monthNames: [
//         'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
//         'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
//     ],
//     timeNames: [
//         'a', 'p', 'am', 'pm', 'A', 'P', 'AM', 'PM'
//     ]
// };
dateFormat.i18n = {
    dayNames: [
        'CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7',
        'CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7',
    ],
    monthNames: [
        '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11','12',
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11','Tháng 12',
    ],
    timeNames: [
        'S', 'C', 'S', 'C', 'S', 'C', 'S', 'C'
    ]
};


function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}



class AppUtils {
    CONSOLE_LOG(text) {
        if (AppConstants.IS_DEBUG_MODE) {
            console.log(text)
        }
    }
    
    uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    getColorForIndex(idx) {
        let valueOffset = idx % 10;
        return AppConstants.COLOR_SCALE_10[valueOffset];

    }
    // High, Very High, Medium, Low
    getColorForRisk(risk) {
        if (risk == "Very High") {
            return "red";
        } else if (risk == "High") {
            return AppConstants.COLOR_HIGH_RISK;
        } else if (risk == "Medium") {
            return AppConstants.COLOR_MEDIUM_RISK;
        } else if (risk == "Low") {
            return AppConstants.COLOR_LOW_RISK;
        } else {
            return AppConstants.COLOR_TEXT_DARKDER_INFO;
        }

    }

    // example, Le Van Nam; return LVN
    getFirstCharacterInname(name) {
        // Remove Redundatn Spaces
        let newName = name.replace(/\s+/g, ' ');
        let nameArr = newName.split(" ");
        let result= "";
        nameArr.forEach(item => {
            result += item[0].toUpperCase();
        })
        return result;
    }
    // Co Dau thanh Khong Dau
    changeVietnameseToNonSymbol(alias) {
        var str = alias;
        str = str.toLowerCase();
        // ES2015/ES6 String.Prototype.Normalize()
        str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
        str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
        str = str.replace(/đ/g,"d");
        str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
        str = str.replace(/ + /g," ");
        str = str.trim(); 
        return str;
    }

    // if more than 100 character, + ...
    objNameToStringSequence(arr) {
        if (arr) {
            let result = "";
            let idx = 0;
            for (let prop in arr) {
                // Because these two Obj share same prop, so set in 1 for loop
                if (Object.prototype.hasOwnProperty.call(arr, prop) && 
                        Object.prototype.hasOwnProperty.call(arr, prop)) {

                    if (idx == 0) {
                        result += prop;
                    } else {
                        result += ", " + prop;
                    }
                    if (result.length > 25) {
                        result += "...";
                        return result;
                    }
                    idx++;
                }
            }
            return result;
        }
        return "";
    }
    formatDateMonthDayVN(t) {
        if (t)
        return dateFormat(new Date(t), "d/mmm");
    }
    formatDateMonthYearVN(t,idx, ts) {
        if (t)
        return dateFormat(new Date(t), "yyyy/mm");
    }
    formatDateMonthDayYearVN(t) {
        if (t)
        return dateFormat(new Date(t), "d-mmmm-yyyy");
    }
    formatDateMonthDayYearVNShort(t) {
        if (t) {
            return dateFormat(new Date(t), "d/mm/yyyy");
        }
    }
    formatDateMonthDayYearVNShortShort(t) {
        if (t) {
            return dateFormat(new Date(t), "d/mm/yy");
        }
    }
    formatDateTimeFullVN(t) {
        if (t)
        return dateFormat(new Date(t), "d/mm/yyyy H:MM:ss");
    }

    // format to K or Million
    formatMoneyToK(v) {
        if (v < 1000) {
            return (v/1000).toFixed(0) + "đ";
        } else if (v < 1000000) {
            return (v/1000).toFixed(0) + "N";
        } else {
            return (v/1000000).toFixed(2) + "Tr";
        }
    }
    formatDistanceToKm(v) {
        if (v < 1000) {
            return (v).toFixed(0);
        } else {
            return (v/1000).toFixed(0) + "N";
        }
    }
    formatValueWithSign(val) {
        if (val >= 0) {
            return "+"+val;
        } else {
            return ""+val;
        }
    }
    formatToPercent(v, total) {
        return (v*100/total).toFixed(1) + "%";
    }

    getNameOfFillItemType(type, isContantFix, item) {
        this.CONSOLE_LOG(item)
        if (type == AppConstants.FILL_ITEM_GAS) {
            return AppLocales.t("GENERAL_GAS");
        } else if (type == AppConstants.FILL_ITEM_OIL) {
            return AppLocales.t("GENERAL_OIL");
        } else if (type == AppConstants.FILL_ITEM_AUTH) {
            return AppLocales.t("GENERAL_AUTHROIZE");
        } else if (type == AppConstants.FILL_ITEM_EXPENSE) {
            return AppLocales.t("GENERAL_EXPENSE");
        } else if (type == AppConstants.FILL_ITEM_SERVICE) {
            if ( isContantFix ) {
                return AppLocales.t("GENERAL_SERVICE_INSTANTFIX");
            } else {
                return AppLocales.t("GENERAL_SERVICE");
            }
        }
    }

    makeRandomAlphaNumeric(length) {
      var result           = '';
      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
         result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    }
    makeRandomNumeric(length) {
        var result           = '';
        var characters       = '0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
      }
    pushInDateLabelsIfNotExist(arr, val, forcePush = false) {
        let isExist = false;
        for (let i = 0; i < arr.length; i++) {
            let cur = arr[i];
            if (cur.getFullYear() == val.getFullYear() && cur.getMonth() == val.getMonth() && cur.getDate() == val.getDate()) {
                // Different, not exist
                isExist = true;
                break;
            }
        }
        if (!isExist)
            arr.push(val)
    }
    getColorForProgress(valueDiff, unit) {
        // When Double of AppConstant Threashold, will simple Red
        let threshold = AppConstants.SETTING_KM_SHOWWARN;
        if (unit != "Km") {
            threshold = AppConstants.SETTING_DAY_SHOW_WARN;
        }

        if (isNaN(valueDiff)) {
            return AppConstants.COLOR_D3_MIDDLE_GREEN;
        } else 
        if (valueDiff <= threshold) {
            // Normal
            return "tomato";
        } else {
            return AppConstants.COLOR_D3_MIDDLE_GREEN;
        }
    }
    reviseTickLabelsToCount(allLabels, expectedCount) {
        // SOrt first
        allLabels.sort((a, b) => a.getTime() - b.getTime());
        let DESIRE_TICK_COUNT = expectedCount; // First and End always included in Labels
        let gapOfPoint = Math.ceil((allLabels.length)/DESIRE_TICK_COUNT);
        let localCounter = 0;
        let labels = [];
        
        
        allLabels.forEach((item, idx) => {
            // Add first point
            if (idx == 0) {
                labels.push(item)
            } 
            // else if (idx == allLabels.length - 1) {
            //     labels.push(item)
            // } 
            else {
                localCounter++;
                if (localCounter >= gapOfPoint) {
                    labels.push(item)
                    localCounter = 0;
                }
            }
        })
        return labels;
    }
    

    // Set the Time to End of that day
    normalizeFillDate(input) {
        return new Date(input.getFullYear()
            ,input.getMonth()
            ,input.getDate()
            ,23,59,59); //23:59:59
    }
    // Set the Time to Begin of that day
    normalizeDateBegin(input) {
        return new Date(input.getFullYear()
            ,input.getMonth()
            ,input.getDate()
            ,0,0,1); //23:59:59
    }
    normalizeDateMiddleOfMonth(input) {
        return new Date(input.getFullYear()
            ,input.getMonth()
            ,15
            ,0,0,1); //23:59:59
    }

    // arr can be 1D or 2D
    calculateAverageOfArray(arr, dimension = 1) {
        if (dimension == 1) {
            var sum = 0, avg = 0, count=0;
            // dividing by 0 will return Infinity
            // arr must contain at least 1 element to use reduce
            if (arr.length)
            {
                arr.forEach(item => {
                    sum+= item.y;
                    count++;
                })
                avg = sum / count;
            }
        } else if (dimension == 2) {
            var sum = 0, avg = 0, count = 0;
            // dividing by 0 will return Infinity
            // arr must contain at least 1 element to use reduce
            if (arr.length)
            {
                arr.forEach(subArr => {
                    if (subArr && subArr.length) {
                        subArr.forEach(obj => {
                            if (obj.y > 0) {
                                sum += obj.y;
                            }
                            count++;
                        })
                    }
                })
                avg = sum / count;
            }
        }
        return {sum, avg};
    }

    calculateTotalYFromArr(arr) {
        let total = 0;
        if (arr && arr.length > 0) {
            arr.forEach(item => {
                if (item && item.y) {
                    total += y;
                }
            })
        }
        return total;
    }

    calculateDiffDayOf2Date(pre, after) {
        let preDate = this.normalizeFillDate(new Date(pre))
        let afterDate = this.normalizeFillDate(new Date(after))
        const diffTime = Math.abs(afterDate - preDate); // in ms
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    }


}

const apputils = new AppUtils();

export default apputils;