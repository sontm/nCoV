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
        'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11','T12',
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11','Tháng 12',
    ],
    timeNames: [
        'S', 'C', 'S', 'C', 'S', 'C', 'S', 'C'
    ]
};

const BRAND_IMAGES = {
    "chevrolet": require('../assets/images/logo/chevrolet.png'),
    "daihatsu": require('../assets/images/logo/daihatsu.png'),
    "ford": require('../assets/images/logo/ford.png'),
    "honda": require('../assets/images/logo/honda.png'),
    "hyundai": require('../assets/images/logo/hyundai.png'),
    "isuzu": require('../assets/images/logo/isuzu.png'),
    "kia": require('../assets/images/logo/kia.png'),
    "mazda": require('../assets/images/logo/mazda.png'),
    "mercedes": require('../assets/images/logo/mercedes.png'),
    "mitsubishi": require('../assets/images/logo/mitsubishi.png'),
    "nissan": require('../assets/images/logo/nissan.png'),
    "subaru": require('../assets/images/logo/subaru.png'),
    "suzuki": require('../assets/images/logo/suzuki.png'),
    "toyota": require('../assets/images/logo/toyota.png'),
    "vinfast": require('../assets/images/logo/vinfast.png'),
}
const BRAND_IMAGES_BIKE = {
    "honda": require('../assets/images/logo/honda-bike.png'),
    "piaggio": require('../assets/images/logo/piaggio-bike.png'),
    "suzuki": require('../assets/images/logo/suzuki-bike.png'),
    "sym": require('../assets/images/logo/sym-bike.png'),
    "yamaha": require('../assets/images/logo/yamaha-bike.png'),
}

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
    loadImageSourceOfBrand(brand, isMotorBike) {
        if (brand && brand.length > 0) {
            if (isMotorBike) {
                if (typeof(BRAND_IMAGES_BIKE[""+brand]) !== 'undefined') {
                    return BRAND_IMAGES_BIKE[""+brand]
                } else {
                    return require('../assets/images/logo/defaultbike.png')
                }
            } else {
                if (typeof(BRAND_IMAGES[""+brand]) !== 'undefined') {
                    return BRAND_IMAGES[""+brand]
                } else {
                    return require('../assets/images/logo/defaultcar.png')
                }
            }
        } else {
            if (isMotorBike) {
                return require('../assets/images/logo/defaultbike.png')
            } else {
                return require('../assets/images/logo/defaultcar.png')
            }
            
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
    formatToPercent(v, total) {
        return (v*100/total).toFixed(0) + "%";
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
            if (cur.getFullYear() == val.getFullYear() && cur.getMonth() == val.getMonth()) {
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


    // Input: [{x, y}, {x, y}]

    // Output
    //    {
    //     labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    //     datasets: [{
    //       data: [ 20, 45, 28, 80, 99, 43 ],
    //       color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
    //       strokeWidth: 2 // optional
    //     }]
    //   }
    convertVictoryDataToChartkitData(data, funcFormatX) {
        let newDataArr = [];
        let labels = [];

        if (data && data.length) {
            // Label should be not Over 5
            if (data && data.length > 5) {
                var labelCount = 5;
            } else {
                var labelCount = (data && data.length) ? data.length: 2;
            }

            var labelStep = Math.ceil(data.length/labelCount);
            let idxCount = 0;
            data.forEach((item, index) => {
                newDataArr.push(item.y.toFixed(0));
                if (index == 0 || index == (data.length-1)) {
                    labels.push(funcFormatX(item.x))
                    idxCount=0;
                }
                idxCount++;
                if (idxCount == labelStep) {
                    labels.push(funcFormatX(item.x))
                    idxCount=0;
                }
                //add Label for First, Last
            })
            return {
                labels: labels,
                datasets: [{
                    data: newDataArr,
                    //color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // optional
                    color: (opacity = 1) => `rgba(255, 255, 255, 0.75)`, // optional
                    strokeWidth: 1
                }]
            }
        } else {
            return {
                labels: labels,
                datasets: [{
                    data: newDataArr,
                    //color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // optional
                    color: (opacity = 1) => `rgba(255, 255, 255, 0.75)`, // optional
                    strokeWidth: 1
                }]
            }
        }
    }

    getLastDateAndKmFromGas(fillGasList) {
        if (!fillGasList) {
            return {};
        }
        if (fillGasList && fillGasList.length > 0) {
            var beginKm = fillGasList[0].currentKm;
            var beginDate = this.normalizeFillDate(new Date(fillGasList[0].fillDate))

            var lastKm = fillGasList[fillGasList.length -1].currentKm;
            var lastDate = this.normalizeFillDate(new Date(fillGasList[fillGasList.length -1].fillDate))

            const diffTime = Math.abs(lastDate - beginDate); // in ms
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

            // 4. Average of KM per Day
            var averageKmPerDay = (lastKm - beginKm)/ diffDays;
        }
        return {lastDate, lastKm, averageKmPerDay};
    }
    getQuarterNumberOfMonth(date) {//start from 1
        let theQuarter = Math.floor((date.getMonth() + 1) / 3); // May -> 1, June -> 2
        if ((date.getMonth() + 1) % 3 != 0) {
            theQuarter ++;
        }
        return theQuarter;
    }
    // input: [{vehicleId: 1, fillDate: "", amount: 5, price: 3423434, currentKm: 1123, id: 2}]
    // Output of Average KM Weekly/Monthly
    // [{x:dateFillGas, y:average}]
    getStatForGasUsage(fillGasList, duration=12, durationType="month", tillDate=new Date()) {
        if (!fillGasList || fillGasList.length < 1) {
            return {};
        }

        // End date is ENd of This Month
        let CALCULATE_END_DATE = this.normalizeFillDate(new Date(tillDate.getFullYear(),tillDate.getMonth()+1,0));

        if (duration > 200 || duration == AppLocales.t("GENERAL_ALL")) {
            // THis Mean All data
            var CALCULATE_START_DATE = this.normalizeFillDate(new Date(fillGasList[0].fillDate))
        } else {
            var CALCULATE_START_DATE = this.normalizeDateBegin(new Date(CALCULATE_END_DATE.getFullYear(), 
                CALCULATE_END_DATE.getMonth() - duration + 1, 1));
            // In case of quarter, need End Date of First Month in THis Quarter
            let baseEndDate = new Date(CALCULATE_END_DATE)
            if (durationType == "quarter") {
                let theQuarter = this.getQuarterNumberOfMonth(tillDate);

                //this.CONSOLE_LOG("theQuarter:" + theQuarter + ",BaseENdDate")
                baseEndDate = new Date( baseEndDate.setMonth((theQuarter-1) * 3))
                //this.CONSOLE_LOG(baseEndDate)
                CALCULATE_START_DATE = this.normalizeDateBegin(new Date(baseEndDate.getFullYear(), 
                    baseEndDate.getMonth() - duration*3 + 1 + 3, 1));
            } else
            // In case of year, just minus Full year
            if (durationType == "year") {
                CALCULATE_START_DATE = this.normalizeDateBegin(new Date(CALCULATE_END_DATE.getFullYear() - duration + 1, 
                    0, 1));
            }
        }
        this.CONSOLE_LOG("CALCULATE_START_DATE-CALCULATE_END_DATE")
        this.CONSOLE_LOG(CALCULATE_START_DATE)
        this.CONSOLE_LOG(CALCULATE_END_DATE)
        let lastKm = 0;
        let totalMoneyGas = 0;
        let totalKmGas = 0;

        let lastDate = 0;
        let todayLiter = 0;

        let beginKm = 0;
        let beginDate = 0;

        let arrMoneyPerWeek = [];
        let arrKmPerWeek = [];

        let arrTotalKmMonthly = []; // Key is Month: i.e 6/2019: value {x, y}
        let objTotalKmMonthly = {}; // Key is Month: i.e 6/2019: value

        let arrTotalMoneyMonthly = [];
        let objTotalMoneyMonthly = {}; // Key is Month: i.e 6/2019: value

        var avgKmMonthly = 0;
        var avgMoneyMonthly = 0;
        var avgMoneyPerKmMonthly = 0;

        let arrTotalMoneyPerKmMonthly = [];
        if (fillGasList && fillGasList.length > 0) {
            beginKm = fillGasList[0].currentKm;
            beginDate = this.normalizeFillDate(new Date(fillGasList[0].fillDate))

            lastKm = fillGasList[fillGasList.length -1].currentKm;
            lastDate = this.normalizeFillDate(new Date(fillGasList[fillGasList.length -1].fillDate))
            this.CONSOLE_LOG("lastKm-----------------")
            this.CONSOLE_LOG(lastKm)
            let START_IDX=0;
            let END_IDX=fillGasList.length-1;
            for (let l = 0; l < fillGasList.length; l++) {
                let currentDate = new Date(fillGasList[l].fillDate)
                // if date over START and small END, it is OK
                if (currentDate < CALCULATE_START_DATE) {
                    START_IDX = l;
                }
                if (currentDate > CALCULATE_END_DATE) {
                    END_IDX = l;
                    break;
                }
            }
            this.CONSOLE_LOG("START_IDX-END_IDX")
            this.CONSOLE_LOG(START_IDX)
            this.CONSOLE_LOG(END_IDX)
            // Calculate valid range (first - 1 and last + 1)
            fillGasList.forEach((item, index) => {
                //Skip Invalid Index

                // For money and Litre, not use the Last Fill date (because that fill is for next)
                if (index != fillGasList.length -1) {
                    totalMoneyGas += item.price;
                    todayLiter += item.amount;
                }
                if (index >= START_IDX && index <= END_IDX) {
                    // Calculate Average KM from Previous Fill Gas
                    if (index > 0) {
                        let currentDate = this.normalizeFillDate(new Date(fillGasList[index].fillDate));
                        let prevDate = this.normalizeFillDate(new Date(fillGasList[index-1].fillDate));
                        
                        let currentMonthKey = "" + currentDate.getFullYear() + "/" + (currentDate.getMonth() + 1) ;
                        let prevMonthKey = "" + prevDate.getFullYear() + "/" + (prevDate.getMonth() + 1);

                        const diffTime = Math.abs(currentDate - prevDate); // in ms
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

                        let averageKMPerDay = (item.currentKm - fillGasList[index-1].currentKm)/diffDays;
                        totalKmGas += (item.currentKm - fillGasList[index-1].currentKm);
                        // Money is from Previous Fill time
                        let averageMoneyPerDay = fillGasList[index-1].price/diffDays;

                        arrMoneyPerWeek.push({x: new Date(item.fillDate), y: averageMoneyPerDay*30})
                        arrKmPerWeek.push({x: new Date(item.fillDate), y: averageKMPerDay*30})

                        let firstDayOfCurrentMonth = this.normalizeFillDate(new Date(currentDate.getFullYear(),currentDate.getMonth(),1))
                        let lastDayOfPrevMonth = this.normalizeFillDate(new Date(prevDate.getFullYear(),prevDate.getMonth()+1,0))
                        const diffDayCurrentToFirst = Math.ceil(Math.abs(currentDate - firstDayOfCurrentMonth) / (1000 * 60 * 60 * 24)); 
                        const diffDayPrevToLast = Math.ceil(Math.abs(lastDayOfPrevMonth - prevDate) / (1000 * 60 * 60 * 24)); 
                        
                        
                        if (currentDate.getMonth() != prevDate.getMonth()) {
                            // two or three Diffirent Month

                            if (!objTotalKmMonthly[""+prevMonthKey]) {
                                // Not exist, create new
                                objTotalKmMonthly[""+prevMonthKey] = {
                                    y: averageKMPerDay * diffDayPrevToLast,
                                    x: this.normalizeDateMiddleOfMonth(prevDate)
                                }
                                objTotalMoneyMonthly[""+prevMonthKey] = {
                                    y: averageMoneyPerDay * diffDayPrevToLast,
                                    x: this.normalizeDateMiddleOfMonth(prevDate)
                                }
                            } else {
                                // Exist, increase
                                objTotalKmMonthly[""+prevMonthKey].y += averageKMPerDay * diffDayPrevToLast;
                                objTotalMoneyMonthly[""+prevMonthKey].y += averageMoneyPerDay * diffDayPrevToLast;
                            }
                            if (!objTotalKmMonthly[""+currentMonthKey]) {
                                // Not exist, create new
                                objTotalKmMonthly[""+currentMonthKey] = {
                                    y: averageKMPerDay * diffDayCurrentToFirst,
                                    x: this.normalizeDateMiddleOfMonth(currentDate)
                                }
                                objTotalMoneyMonthly[""+currentMonthKey] = {
                                    y: averageMoneyPerDay * diffDayCurrentToFirst,
                                    x: this.normalizeDateMiddleOfMonth(currentDate)
                                }
                            } else {
                                // Exist, increase
                                objTotalKmMonthly[""+currentMonthKey].y += averageKMPerDay * diffDayCurrentToFirst;
                                objTotalMoneyMonthly[""+currentMonthKey].y += averageMoneyPerDay * diffDayCurrentToFirst;
                            }

                            // Loop Every Month Between Two Fill Date time
                            let loopFirstDateOfMonth = new Date(
                                lastDayOfPrevMonth.setDate(lastDayOfPrevMonth.getDate() + 1)
                                );
                            
                            while (loopFirstDateOfMonth.getMonth() < firstDayOfCurrentMonth.getMonth() || 
                            loopFirstDateOfMonth.getFullYear() < firstDayOfCurrentMonth.getFullYear()) {
                                let loopLastdateOfMonth = new Date(loopFirstDateOfMonth.getFullYear(),loopFirstDateOfMonth.getMonth()+1,0);                            

                                let diffDayPrevLast2FirstCurrent = 
                                    Math.ceil(Math.abs(loopLastdateOfMonth - loopFirstDateOfMonth) / (1000 * 60 * 60 * 24))
                                    + 1; 
                                let loopMonthKey = "" + loopFirstDateOfMonth.getFullYear() + "/" + (loopFirstDateOfMonth.getMonth() + 1) ;
                                
                                if (!objTotalKmMonthly[""+loopMonthKey]) {
                                    // Not exist, create new
                                    objTotalKmMonthly[""+loopMonthKey] = {
                                        y:averageKMPerDay * diffDayPrevLast2FirstCurrent,
                                        x: this.normalizeDateMiddleOfMonth(loopFirstDateOfMonth)
                                    }
                                    objTotalMoneyMonthly[""+loopMonthKey] = {
                                        y:averageMoneyPerDay * diffDayPrevLast2FirstCurrent,
                                        x: this.normalizeDateMiddleOfMonth(loopFirstDateOfMonth)
                                    }
                                } else {
                                    // Exist, increase
                                    objTotalKmMonthly[""+loopMonthKey].y += averageKMPerDay * diffDayPrevLast2FirstCurrent;
                                    objTotalMoneyMonthly[""+loopMonthKey].y += averageMoneyPerDay * diffDayPrevLast2FirstCurrent;
                                }

                                loopFirstDateOfMonth = new Date(
                                    loopLastdateOfMonth.setDate(loopLastdateOfMonth.getDate() + 1)
                                    );
                            }
                        } else {

                            // Same Month
                            if (!objTotalKmMonthly[""+currentMonthKey]) {
                                // Not exist, create new
                                objTotalKmMonthly[""+currentMonthKey] = {
                                    y: averageKMPerDay * diffDays,
                                    x: this.normalizeDateMiddleOfMonth(currentDate)
                                }
                                objTotalMoneyMonthly[""+currentMonthKey] = {
                                    y: averageMoneyPerDay * diffDays,
                                    x: this.normalizeDateMiddleOfMonth(currentDate)
                                }
                            } else {
                                // Exist, increase
                                objTotalKmMonthly[""+currentMonthKey].y += averageKMPerDay * diffDays;
                                objTotalMoneyMonthly[""+currentMonthKey].y += averageMoneyPerDay * diffDays;
                            }

                        }
                    } 
                }
            })
            let objQuarter = {};
            let objYear = {};
            let objQuarterMoney = {};
            let objYearMoney = {};
            // convert to Array for Chart
            for (var prop in objTotalKmMonthly) {
                // Because these two Obj share same prop, so set in 1 for loop
                if (Object.prototype.hasOwnProperty.call(objTotalKmMonthly, prop) && 
                        Object.prototype.hasOwnProperty.call(objTotalMoneyMonthly, prop)) {
                    if (durationType == "quarter") {
                        // Grouping to Quarter
                        let quarterKey = "" + objTotalKmMonthly[""+prop].x.getFullYear() + "/Q" + 
                            this.getQuarterNumberOfMonth(objTotalKmMonthly[""+prop].x);
                        let baseDateOfQuarter = new Date(objTotalKmMonthly[""+prop].x.getFullYear(),
                            this.getQuarterNumberOfMonth(objTotalKmMonthly[""+prop].x) * 3 - 2,15)

                        if (objQuarter[""+quarterKey]) {
                            objQuarter[""+quarterKey].y += objTotalKmMonthly[""+prop].y

                            objQuarterMoney[""+quarterKey].y += objTotalMoneyMonthly[""+prop].y
                        } else {
                            objQuarter[""+quarterKey] = {
                                x: baseDateOfQuarter,
                                y: objTotalKmMonthly[""+prop].y
                            }
                            objQuarterMoney[""+quarterKey] = {
                                x: baseDateOfQuarter,
                                y: objTotalMoneyMonthly[""+prop].y
                            }
                        }
                    } else  if (durationType == "year") {
                        let yearKey = "" + objTotalKmMonthly[""+prop].x.getFullYear();
                        let baseDateOfYear = new Date(objTotalKmMonthly[""+prop].x.getFullYear(),
                            5,15)
                        if (objYear[""+yearKey]) {
                            objYear[""+yearKey].y += objTotalKmMonthly[""+prop].y
                            objYearMoney[""+yearKey].y += objTotalMoneyMonthly[""+prop].y
                        } else {
                            objYear[""+yearKey] = {
                                x: baseDateOfYear,
                                y: objTotalKmMonthly[""+prop].y
                            }
                            objYearMoney[""+yearKey] = {
                                x: baseDateOfYear,
                                y: objTotalMoneyMonthly[""+prop].y
                            }
                        }
                    } else {
                        if (objTotalKmMonthly[""+prop].x > CALCULATE_START_DATE && objTotalKmMonthly[""+prop].x < CALCULATE_END_DATE) {
                            // Here, Exclude Date Which is Smaller than Start date
                            arrTotalKmMonthly.push(objTotalKmMonthly[""+prop])
                            arrTotalMoneyMonthly.push(objTotalMoneyMonthly[""+prop])

                            // arrTotalMoneyPerKmMonthly.push({
                            //     x: objTotalMoneyMonthly[""+prop].x,
                            //     y: objTotalMoneyMonthly[""+prop].y/objTotalKmMonthly[""+prop].y
                            // })
                        }
                    }
                }
            }

            if (durationType == "quarter") {
                for (var prop in objQuarter) {
                    // Because these two Obj share same prop, so set in 1 for loop
                    if (Object.prototype.hasOwnProperty.call(objQuarter, prop) && 
                            Object.prototype.hasOwnProperty.call(objQuarterMoney, prop)) {
                        if (objQuarter[""+prop].x > CALCULATE_START_DATE && objQuarter[""+prop].x < CALCULATE_END_DATE) {
                            arrTotalKmMonthly.push({
                                ...objQuarter[""+prop],
                                //label: prop // TODO: Add this to Data automaticlly display in y axis
                            })
                            arrTotalMoneyMonthly.push(objQuarterMoney[""+prop])

                            // arrTotalMoneyPerKmMonthly.push({
                            //     x: objQuarterMoney[""+prop].x,
                            //     y: objQuarterMoney[""+prop].y/objQuarter[""+prop].y
                            // })
                        }
                    }
                }
            }
            if (durationType == "year") {
                for (var prop in objYear) {
                    // Because these two Obj share same prop, so set in 1 for loop
                    if (Object.prototype.hasOwnProperty.call(objYear, prop)) {
                        if (objYear[""+prop].x > CALCULATE_START_DATE && objYear[""+prop].x < CALCULATE_END_DATE) {
                            arrTotalKmMonthly.push({
                                ...objYear[""+prop],
                                //label: prop // TODO: Add this to Data automaticlly display in y axis
                            })
                            arrTotalMoneyMonthly.push(objYearMoney[""+prop])

                            // arrTotalMoneyPerKmMonthly.push({
                            //     x: objYearMoney[""+prop].x,
                            //     y: objYearMoney[""+prop].y/objYear[""+prop].y
                            // })
                        }
                    }
                }
            }

            arrTotalKmMonthly.sort(function (a, b) {
                return a.x.getTime() - b.x.getTime();
            })
            arrTotalMoneyMonthly.sort(function (a, b) {
                return a.x.getTime() - b.x.getTime();
            })
            // arrTotalMoneyPerKmMonthly.sort(function (a, b) {
            //     return a.x.getTime() - b.x.getTime();
            // })

            // Calcualte Average of current selected time
            let totalKmMonthly = 0;
            arrTotalKmMonthly.forEach((item, index) => {
                if (index < arrTotalKmMonthly.length -1) { // Not Take the Last month because current Inprogress
                    totalKmMonthly += item.y;
                }
            })
            let totalMonyMonthly = 0;
            arrTotalMoneyMonthly.forEach((item, index) => {
                if (index < arrTotalMoneyMonthly.length -1) { // Not Take the Last month because current Inprogress
                    totalMonyMonthly += item.y;
                }
            })
            let totalMoneyPerKmMonthly = 0;
            // arrTotalMoneyPerKmMonthly.forEach((item, index) => {
            //     if (index < arrTotalMoneyPerKmMonthly.length -1) { // Not Take the Last month because current Inprogress
            //         totalMoneyPerKmMonthly += item.y;
            //     }
            // })

            avgKmMonthly = totalKmMonthly/(arrTotalKmMonthly.length -1);
            avgMoneyMonthly = totalMonyMonthly/(arrTotalMoneyMonthly.length -1);
            //avgMoneyPerKmMonthly = totalMoneyPerKmMonthly/(arrTotalMoneyPerKmMonthly.length -1);
            avgMoneyPerKmMonthly = avgMoneyMonthly/avgKmMonthly;

            // // convert to Array for Chart
            // for (var prop in objTotalMoneyMonthly) {
            //     if (Object.prototype.hasOwnProperty.call(objTotalMoneyMonthly, prop)) {
            //         arrTotalMoneyMonthly.push(objTotalMoneyMonthly[""+prop])
            //     }
            // }
        }
        if (arrTotalKmMonthly && arrTotalKmMonthly.length > 0) {
            // Calculate Passed duration between begin and last date
            const diffTime = Math.abs(lastDate - beginDate); // in ms
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

            // 1.Average KM per Lit
            let averageKmPerLiter = (lastKm - beginKm) / todayLiter;
            // 2. Average Money per Lit
            let averageMoneyPerLiter = totalMoneyGas/ todayLiter;
            // 3. Average Money per Day
            let averageMoneyPerDay = totalMoneyGas/ diffDays;
            // 4. Average of KM per Day
            let averageKmPerDay = (lastKm - beginKm)/ diffDays;
            // 5. Money per KM
            let averageMoneyPerKmPerDay = averageMoneyPerDay/averageKmPerDay;
            // TODO

            return {averageKmPerLiter, averageMoneyPerLiter, averageMoneyPerDay, averageKmPerDay, averageMoneyPerKmPerDay, lastDate, lastKm,
                arrMoneyPerWeek, arrKmPerWeek, totalMoneyGas, arrTotalKmMonthly, arrTotalMoneyMonthly, arrTotalMoneyPerKmMonthly,
                avgKmMonthly, avgMoneyMonthly, avgMoneyPerKmMonthly, totalKmGas};
        } else {
            return {};
        }

    }

    // Deprecate. Now User in Maintain Reminds
    // input: [{vehicleId: 1, fillDate: "10/15/2018, 11:02:58 PM", price: 50000, currentKm: 90, id: 1}]
    getInfoForOilUsage(fillOilList, lastDate, lastKm, averageKmPerDay) {
        if (!fillOilList) {
            return {};
        }

        let lastKmOil = 0;
        let totalMoneyOil = 0;
        let lastDateOil = 0;
        let lastOilKmValidFor = 0;
        if (fillOilList && fillOilList.length > 0) {
            fillOilList.forEach((item, index) => {
                if (index == fillOilList.length -1) {
                    lastKmOil = item.currentKm;
                    lastDateOil = new Date(item.fillDate);
                    lastOilKmValidFor = item.validFor;
                }

                // For money and Litre, not use the Last Fill date (because that fill is for next)
                if (index != fillOilList.length -1) {
                    totalMoneyOil += item.price;
                }
            })
            if (!lastOilKmValidFor) {
                lastOilKmValidFor = AppConstants.SETTING_KM_NEXT_OILFILL;
            }

            // 1. Passed Km to Next Fill Oil
            let passedKmFromPreviousOil = lastKm - lastKmOil;
            // 2. Estimate date to Next Fill Oil
            let daysToNextOil = (lastOilKmValidFor -  passedKmFromPreviousOil) / averageKmPerDay;
            let nextEstimateDateForOil = new Date(lastDateOil)
            nextEstimateDateForOil = nextEstimateDateForOil.setDate(nextEstimateDateForOil.getDate() + daysToNextOil);
            
            if (nextEstimateDateForOil) {
                nextEstimateDateForOil = new Date(nextEstimateDateForOil)
            }

            return {lastKmOil, lastDateOil, totalMoneyOil, passedKmFromPreviousOil, nextEstimateDateForOil, lastOilKmValidFor};
        }
        return {};
    }
    // input: [{vehicleId: 1, fillDate: "10/15/2018, 11:02:58 PM", price: 50000, currentKm: 90, id: 1}]
    getRemindForMaintain(serviceList, settingService, lastKm) {
        
        if (!serviceList) {
            return {};
        }

        // TODO, will remove when finish Development
        if (!settingService || !settingService.Km) {
            settingService = DEFAULT_SETTING_SERVICE;
        }

        // Sort by Fill Date Descending
        serviceList.sort(function(a, b) { 
            return new Date(b.fillDate) - new Date(a.fillDate);
        })

        let lastKmMaintain = 0;
        let lastDateMaintain = 0;
        let lastMaintainKmValidFor = 0;

        let nextEstimatedKmForMaintain = 0;
        let nextEstimatedDateForMaintain = 0;
        let passedKmFromPreviousMaintain = 0;

        this.CONSOLE_LOG(")))))))))))))))))) getRemindForMaintain")
        if (serviceList && serviceList.length > 0) {
            for (let index = serviceList.length -1; index >= 0; index--) {
                let item = serviceList[index];
                this.CONSOLE_LOG("  )))))))))))))))))) item")
                this.CONSOLE_LOG(item)
                if (!item.isConstantFix) {
                    lastKmMaintain = item.currentKm;
                    lastDateMaintain = this.normalizeFillDate(new Date(item.fillDate));

                    nextEstimatedKmForMaintain = item.currentKm + item.validFor;
                    lastMaintainKmValidFor = + item.validFor;
                    
                    // Plus Month of Bao DUong Nho
                    nextEstimatedDateForMaintain = this.normalizeFillDate(
                        new Date(lastDateMaintain.getFullYear(),
                            lastDateMaintain.getMonth()+settingService.Month[item.validForIndex],
                            lastDateMaintain.getDate()))

                    passedKmFromPreviousMaintain = lastKm - lastKmMaintain;
                }
            }
            let totalNextDay = this.calculateDiffDayOf2Date(lastDateMaintain, nextEstimatedDateForMaintain);
            this.CONSOLE_LOG("))))))))) Result");
            this.CONSOLE_LOG({lastKmMaintain, lastDateMaintain, lastMaintainKmValidFor, nextEstimatedKmForMaintain,
                nextEstimatedDateForMaintain, passedKmFromPreviousMaintain, totalNextDay})

            return {lastKmMaintain, lastDateMaintain, lastMaintainKmValidFor, nextEstimatedKmForMaintain,
                nextEstimatedDateForMaintain, passedKmFromPreviousMaintain, totalNextDay}
        }
        return {}
    }

    getInfoCarAuthorizeDate(authorizeList) {
        if (!authorizeList) {
            return {};
        }

        let totalMoneyAuthorize = 0;
        let lastDate = null; // Dang Kiem
        let lastAuthDaysValidFor = 0;
        let maxAuthIdx = -1;

        let lastDateInsurance = null; // Bao Hiem Dan Su
        let lastAuthDaysValidForInsurance = 0;
        let maxInsuranceIdx = -1;

        let lastDateRoadFee = null; // Phi Duong Bo
        let lastAuthDaysValidForRoadFee = 0;
        let maxRoadFeeIdx = -1;

        if (authorizeList && authorizeList.length > 0) {
            authorizeList.forEach((item, index) => {
                this.CONSOLE_LOG("   ??????????? Type AUTH:" + item.subTypeArr)
                if (item.subTypeArr && item.subTypeArr.indexOf("Bảo Hiểm Dân Sự") >= 0) {
                    if (maxInsuranceIdx < index) maxInsuranceIdx = index;
                    totalMoneyAuthorize += item.price;
                }
                if (item.subTypeArr && item.subTypeArr.indexOf("Phí Bảo Trì Đường Bộ") >= 0) {
                    if (maxRoadFeeIdx < index) maxRoadFeeIdx = index;
                    totalMoneyAuthorize += item.price;
                }
                if (item.subTypeArr && item.subTypeArr.indexOf("Đăng Kiểm") >= 0) {
                    if (maxAuthIdx < index) maxAuthIdx = index;
                    totalMoneyAuthorize += item.price;
                }
            })
        }
        if (maxAuthIdx >= 0) {
            lastDate = new Date(authorizeList[maxAuthIdx].fillDate);
            lastAuthDaysValidFor = authorizeList[maxAuthIdx].validFor;
        }
        if (maxInsuranceIdx >= 0) {
            lastDateInsurance = new Date(authorizeList[maxInsuranceIdx].fillDate);
            lastAuthDaysValidForInsurance = authorizeList[maxInsuranceIdx].validFor;
        }
        if (maxRoadFeeIdx >= 0) {
            lastDateRoadFee = new Date(authorizeList[maxRoadFeeIdx].fillDate);
            lastAuthDaysValidForRoadFee = authorizeList[maxRoadFeeIdx].validFor;
        }
        let today = new Date();
        if (lastDate) {
            var nextAuthorizeDate = new Date(lastDate)
            nextAuthorizeDate = nextAuthorizeDate.setDate(nextAuthorizeDate.getDate() + lastAuthDaysValidFor);
            const diffTime = Math.abs(today - lastDate); // in ms
            var diffDayFromLastAuthorize = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            nextAuthorizeDate = new Date(nextAuthorizeDate)
        }
        if (lastDateInsurance) {
            var nextAuthorizeDateInsurance = new Date(lastDateInsurance)
            nextAuthorizeDateInsurance = nextAuthorizeDateInsurance.setDate(
                nextAuthorizeDateInsurance.getDate() + lastAuthDaysValidForInsurance);
            const diffTime = Math.abs(today - lastDateInsurance); // in ms
            var diffDayFromLastAuthorizeInsurance = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            nextAuthorizeDateInsurance = new Date(nextAuthorizeDateInsurance)
        }
        if (lastDateRoadFee) {
            var nextAuthorizeDateRoadFee = new Date(lastDateRoadFee)
            nextAuthorizeDateRoadFee = nextAuthorizeDateRoadFee.setDate(
                nextAuthorizeDateRoadFee.getDate() + lastAuthDaysValidForRoadFee);
            const diffTime = Math.abs(today - lastDateRoadFee)
            var diffDayFromLastAuthorizeRoadFee = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            nextAuthorizeDateRoadFee = new Date(nextAuthorizeDateRoadFee)
        }
        
        return {diffDayFromLastAuthorize, nextAuthorizeDate, totalMoneyAuthorize, lastAuthDaysValidFor,
            diffDayFromLastAuthorizeInsurance, nextAuthorizeDateInsurance, lastAuthDaysValidForInsurance,
            diffDayFromLastAuthorizeRoadFee, nextAuthorizeDateRoadFee, lastAuthDaysValidForRoadFee};
    }

    getInfoMoneySpendByTime(theVehicle, duration=12, durationType="month", tillDate=new Date()) {
        // End date is ENd of This Month
        let CALCULATE_END_DATE = this.normalizeFillDate(new Date(tillDate.getFullYear(),tillDate.getMonth()+1,0));

        if (duration > 200 || duration == AppLocales.t("GENERAL_ALL")) {
            // THis Mean All data
            //var CALCULATE_START_DATE = this.normalizeFillDate(new Date(theVehicle.fillGasList[0].fillDate))

            // get in 100 month ago
            var CALCULATE_START_DATE = this.normalizeDateBegin(new Date(CALCULATE_END_DATE.getFullYear(), 
                CALCULATE_END_DATE.getMonth() - 100 + 1, 1));
        } else {
            var CALCULATE_START_DATE = this.normalizeDateBegin(new Date(CALCULATE_END_DATE.getFullYear(), 
                CALCULATE_END_DATE.getMonth() - duration + 1, 1));
            // In case of quarter, need End Date of First Month in THis Quarter
            let baseEndDate = new Date(CALCULATE_END_DATE)
            if (durationType == "quarter") {
                let theQuarter = this.getQuarterNumberOfMonth(tillDate);

                //this.CONSOLE_LOG("theQuarter:" + theQuarter + ",BaseENdDate")
                baseEndDate = new Date( baseEndDate.setMonth((theQuarter-1) * 3))
                //this.CONSOLE_LOG(baseEndDate)
                CALCULATE_START_DATE = this.normalizeDateBegin(new Date(baseEndDate.getFullYear(), 
                    baseEndDate.getMonth() - duration*3 + 1 + 3, 1));
            } else
            // In case of year, just minus Full year
            if (durationType == "year") {
                CALCULATE_START_DATE = this.normalizeDateBegin(new Date(CALCULATE_END_DATE.getFullYear() - duration + 1, 
                    0, 1));
            }
        }
        let arrTotalMoneySpend = [];
        let objTotalMoneySpend = {};

        let arrGasSpend = [];
        let objGasSpend = {};
        if (theVehicle.fillGasList && theVehicle.fillGasList.length > 0) {
            theVehicle.fillGasList.forEach(item => {
                let itemDate = this.normalizeFillDate(new Date(item.fillDate));
                if (itemDate >= CALCULATE_START_DATE && itemDate <= CALCULATE_END_DATE) {
                    let dateKey = "" + itemDate.getFullYear() + "/" + (itemDate.getMonth() + 1) ;
                    if (objGasSpend[""+dateKey]) {
                        // Exist, add more
                        objGasSpend[""+dateKey].y += item.price;
                    } else {
                        // Not Exist, create new Month
                        objGasSpend[""+dateKey] = {
                            x: this.normalizeDateMiddleOfMonth(itemDate),
                            y: item.price
                        }
                    }

                    // THis for total money
                    if (objTotalMoneySpend[""+dateKey]) {
                        // Exist, add more
                        objTotalMoneySpend[""+dateKey].y += item.price;
                    } else {
                        // Not Exist, create new Month
                        objTotalMoneySpend[""+dateKey] = {
                            x: this.normalizeDateMiddleOfMonth(itemDate),
                            y: item.price
                        }
                    }
                }
            })
        }
        let objQuarter={};
        let objYear = {};
        // convert to Array for Chart
        for (var prop in objGasSpend) {
            if (Object.prototype.hasOwnProperty.call(objGasSpend, prop)) {
                if (durationType == "quarter") {
                    // Grouping to Quarter
                    let quarterKey = "" + objGasSpend[""+prop].x.getFullYear() + "/Q" + 
                        this.getQuarterNumberOfMonth(objGasSpend[""+prop].x);
                    let baseDateOfQuarter = new Date(objGasSpend[""+prop].x.getFullYear(),
                        this.getQuarterNumberOfMonth(objGasSpend[""+prop].x) * 3 - 2,15)

                    if (objQuarter[""+quarterKey]) {
                        objQuarter[""+quarterKey].y += objGasSpend[""+prop].y
                    } else {
                        objQuarter[""+quarterKey] = {
                            x: baseDateOfQuarter,
                            y: objGasSpend[""+prop].y
                        }
                    }
                } else  if (durationType == "year") {
                    let yearKey = "" + objGasSpend[""+prop].x.getFullYear();
                    let baseDateOfYear = new Date(objGasSpend[""+prop].x.getFullYear(),
                        5,15)
                    if (objYear[""+yearKey]) {
                        objYear[""+yearKey].y += objGasSpend[""+prop].y
                    } else {
                        objYear[""+yearKey] = {
                            x: baseDateOfYear,
                            y: objGasSpend[""+prop].y
                        }
                    }
                } else {
                    arrGasSpend.push(objGasSpend[""+prop])
                }
            }
        }
        if (durationType == "quarter") {
            for (var prop in objQuarter) {
                // Because these two Obj share same prop, so set in 1 for loop
                if (Object.prototype.hasOwnProperty.call(objQuarter, prop)) {
                        arrGasSpend.push(objQuarter[""+prop])
                }
            }
        }
        if (durationType == "year") {
            for (var prop in objQuarter) {
                // Because these two Obj share same prop, so set in 1 for loop
                if (Object.prototype.hasOwnProperty.call(objQuarter, prop)) {
                        arrGasSpend.push(objYear[""+prop])
                }
            }
        }

        arrGasSpend.sort(function (a, b) {
            return a.x.getTime() - b.x.getTime();
        })

        //------Oil
        objQuarter={};
        objYear = {};
        let arrOilSpend = [];
        let objOilSpend = {};
        if (theVehicle.fillOilList && theVehicle.fillOilList.length > 0) {
            theVehicle.fillOilList.forEach(item => {
                let itemDate = this.normalizeFillDate(new Date(item.fillDate));
                if (itemDate >= CALCULATE_START_DATE && itemDate <= CALCULATE_END_DATE) {
                    let dateKey = "" + itemDate.getFullYear() + "/" + (itemDate.getMonth() + 1) ;
                    if (objOilSpend[""+dateKey]) {
                        // Exist, add more
                        objOilSpend[""+dateKey].y += item.price;
                    } else {
                        // Not Exist, create new Month
                        objOilSpend[""+dateKey] = {
                            x: this.normalizeDateMiddleOfMonth(itemDate),
                            y: item.price
                        }
                    }

                    // THis for total money
                    if (objTotalMoneySpend[""+dateKey]) {
                        // Exist, add more
                        objTotalMoneySpend[""+dateKey].y += item.price;
                    } else {
                        // Not Exist, create new Month
                        objTotalMoneySpend[""+dateKey] = {
                            x: this.normalizeDateMiddleOfMonth(itemDate),
                            y: item.price
                        }
                    }
                }
            })
        }
        // convert to Array for Chart
        for (var prop in objOilSpend) {
            if (Object.prototype.hasOwnProperty.call(objOilSpend, prop)) {
                if (durationType == "quarter") {
                    // Grouping to Quarter
                    let quarterKey = "" + objOilSpend[""+prop].x.getFullYear() + "/Q" + 
                        this.getQuarterNumberOfMonth(objOilSpend[""+prop].x);
                    let baseDateOfQuarter = new Date(objOilSpend[""+prop].x.getFullYear(),
                        this.getQuarterNumberOfMonth(objOilSpend[""+prop].x) * 3 - 2,15)

                    if (objQuarter[""+quarterKey]) {
                        objQuarter[""+quarterKey].y += objOilSpend[""+prop].y
                    } else {
                        objQuarter[""+quarterKey] = {
                            x: baseDateOfQuarter,
                            y: objOilSpend[""+prop].y
                        }
                    }
                } else  if (durationType == "year") {
                    let yearKey = "" + objOilSpend[""+prop].x.getFullYear();
                    let baseDateOfYear = new Date(objOilSpend[""+prop].x.getFullYear(),
                        5,15)
                    if (objYear[""+yearKey]) {
                        objYear[""+yearKey].y += objOilSpend[""+prop].y
                    } else {
                        objYear[""+yearKey] = {
                            x: baseDateOfYear,
                            y: objOilSpend[""+prop].y
                        }
                    }
                } else {
                    arrOilSpend.push(objOilSpend[""+prop])
                }
            }
        }
        if (durationType == "quarter") {
            for (var prop in objQuarter) {
                // Because these two Obj share same prop, so set in 1 for loop
                if (Object.prototype.hasOwnProperty.call(objQuarter, prop)) {
                        arrOilSpend.push(objQuarter[""+prop])
                }
            }
        }
        if (durationType == "year") {
            for (var prop in objYear) {
                // Because these two Obj share same prop, so set in 1 for loop
                if (Object.prototype.hasOwnProperty.call(objYear, prop)) {
                        arrOilSpend.push(objYear[""+prop])
                }
            }
        }

        arrOilSpend.sort(function (a, b) {
            return a.x.getTime() - b.x.getTime();
        })

        //------Auth
        objQuarter={};
        objYear = {};
        let arrAuthSpend = [];
        let objAuthSpend = {};
        if (theVehicle.authorizeCarList && theVehicle.authorizeCarList.length > 0) {
            theVehicle.authorizeCarList.forEach(item => {

                let itemDate = this.normalizeFillDate(new Date(item.fillDate));
                if (itemDate >= CALCULATE_START_DATE && itemDate <= CALCULATE_END_DATE) {
                    let dateKey = "" + itemDate.getFullYear() + "/" + (itemDate.getMonth() + 1) ;
                    if (objAuthSpend[""+dateKey]) {
                        // Exist, add more
                        objAuthSpend[""+dateKey].y += item.price;
                    } else {
                        // Not Exist, create new Month
                        objAuthSpend[""+dateKey] = {
                            x: this.normalizeDateMiddleOfMonth(itemDate),
                            y: item.price
                        }
                    }

                    // THis for total money
                    if (objTotalMoneySpend[""+dateKey]) {
                        // Exist, add more
                        objTotalMoneySpend[""+dateKey].y += item.price;
                    } else {
                        // Not Exist, create new Month
                        objTotalMoneySpend[""+dateKey] = {
                            x: this.normalizeDateMiddleOfMonth(itemDate),
                            y: item.price
                        }
                    }
                }
            })
        }

        // convert to Array for Chart
        for (var prop in objAuthSpend) {
            if (Object.prototype.hasOwnProperty.call(objAuthSpend, prop)) {
                if (durationType == "quarter") {
                    // Grouping to Quarter
                    let quarterKey = "" + objAuthSpend[""+prop].x.getFullYear() + "/Q" + 
                        this.getQuarterNumberOfMonth(objAuthSpend[""+prop].x);
                    let baseDateOfQuarter = new Date(objAuthSpend[""+prop].x.getFullYear(),
                        this.getQuarterNumberOfMonth(objAuthSpend[""+prop].x) * 3 - 2,15)

                    if (objQuarter[""+quarterKey]) {
                        objQuarter[""+quarterKey].y += objAuthSpend[""+prop].y
                    } else {
                        objQuarter[""+quarterKey] = {
                            x: baseDateOfQuarter,
                            y: objAuthSpend[""+prop].y
                        }
                    }
                } else  if (durationType == "year") {
                    let yearKey = "" + objAuthSpend[""+prop].x.getFullYear();
                    let baseDateOfYear = new Date(objAuthSpend[""+prop].x.getFullYear(),
                        5,15)
                    if (objYear[""+yearKey]) {
                        objYear[""+yearKey].y += objAuthSpend[""+prop].y
                    } else {
                        objYear[""+yearKey] = {
                            x: baseDateOfYear,
                            y: objAuthSpend[""+prop].y
                        }
                    }
                } else {
                    arrAuthSpend.push(objAuthSpend[""+prop])
                }
            }
        }
        if (durationType == "quarter") {
            for (var prop in objQuarter) {
                // Because these two Obj share same prop, so set in 1 for loop
                if (Object.prototype.hasOwnProperty.call(objQuarter, prop)) {
                        arrAuthSpend.push(objQuarter[""+prop])
                }
            }
        }
        if (durationType == "year") {
            for (var prop in objYear) {
                // Because these two Obj share same prop, so set in 1 for loop
                if (Object.prototype.hasOwnProperty.call(objYear, prop)) {
                        arrAuthSpend.push(objYear[""+prop])
                }
            }
        }

        arrAuthSpend.sort(function (a, b) {
            return a.x.getTime() - b.x.getTime();
        })



        //------Expense
        objQuarter={};
        objYear = {};
        let arrExpenseSpend = [];
        let objExpenseSpend = {};
        if (theVehicle.expenseList && theVehicle.expenseList.length > 0) {
            theVehicle.expenseList.forEach(item => {
                let itemDate = this.normalizeFillDate(new Date(item.fillDate));
                if (itemDate >= CALCULATE_START_DATE && itemDate <= CALCULATE_END_DATE) {
                    let dateKey = "" + itemDate.getFullYear() + "/" + (itemDate.getMonth() + 1) ;
                    if (objExpenseSpend[""+dateKey]) {
                        // Exist, add more
                        objExpenseSpend[""+dateKey].y += item.price;
                    } else {
                        // Not Exist, create new Month
                        objExpenseSpend[""+dateKey] = {
                            x: this.normalizeDateMiddleOfMonth(itemDate),
                            y: item.price
                        }
                    }

                    // THis for total money
                    if (objTotalMoneySpend[""+dateKey]) {
                        // Exist, add more
                        objTotalMoneySpend[""+dateKey].y += item.price;
                    } else {
                        // Not Exist, create new Month
                        objTotalMoneySpend[""+dateKey] = {
                            x: this.normalizeDateMiddleOfMonth(itemDate),
                            y: item.price
                        }
                    }
                }
            })
        }
        // convert to Array for Chart
        for (var prop in objExpenseSpend) {
            if (Object.prototype.hasOwnProperty.call(objExpenseSpend, prop)) {
                if (durationType == "quarter") {
                    // Grouping to Quarter
                    let quarterKey = "" + objExpenseSpend[""+prop].x.getFullYear() + "/Q" + 
                        this.getQuarterNumberOfMonth(objExpenseSpend[""+prop].x);
                    let baseDateOfQuarter = new Date(objExpenseSpend[""+prop].x.getFullYear(),
                        this.getQuarterNumberOfMonth(objExpenseSpend[""+prop].x) * 3 - 2,15)

                    if (objQuarter[""+quarterKey]) {
                        objQuarter[""+quarterKey].y += objExpenseSpend[""+prop].y
                    } else {
                        objQuarter[""+quarterKey] = {
                            x: baseDateOfQuarter,
                            y: objExpenseSpend[""+prop].y
                        }
                    }
                } else  if (durationType == "year") {
                    let yearKey = "" + objExpenseSpend[""+prop].x.getFullYear();
                    let baseDateOfYear = new Date(objExpenseSpend[""+prop].x.getFullYear(),
                        5,15)
                    if (objYear[""+yearKey]) {
                        objYear[""+yearKey].y += objExpenseSpend[""+prop].y
                    } else {
                        objYear[""+yearKey] = {
                            x: baseDateOfYear,
                            y: objExpenseSpend[""+prop].y
                        }
                    }
                } else {
                    arrExpenseSpend.push(objExpenseSpend[""+prop])
                }
            }
        }
        if (durationType == "quarter") {
            for (var prop in objQuarter) {
                // Because these two Obj share same prop, so set in 1 for loop
                if (Object.prototype.hasOwnProperty.call(objQuarter, prop)) {
                        arrExpenseSpend.push(objQuarter[""+prop])
                }
            }
        }
        if (durationType == "year") {
            for (var prop in objYear) {
                // Because these two Obj share same prop, so set in 1 for loop
                if (Object.prototype.hasOwnProperty.call(objYear, prop)) {
                        arrExpenseSpend.push(objYear[""+prop])
                }
            }
        }
        arrExpenseSpend.sort(function (a, b) {
            return a.x.getTime() - b.x.getTime();
        })


        //------Service
        objQuarter={};
        objYear = {};
        let arrServiceSpend = [];
        let objServiceSpend = {};
        if (theVehicle.serviceList && theVehicle.serviceList.length > 0) {
            theVehicle.serviceList.forEach(item => {
                let itemDate = this.normalizeFillDate(new Date(item.fillDate));
                if (itemDate >= CALCULATE_START_DATE && itemDate <= CALCULATE_END_DATE) {
                    let dateKey = "" + itemDate.getFullYear() + "/" + (itemDate.getMonth() + 1) ;
                    if (objServiceSpend[""+dateKey]) {
                        // Exist, add more
                        objServiceSpend[""+dateKey].y += item.price;
                    } else {
                        // Not Exist, create new Month
                        objServiceSpend[""+dateKey] = {
                            x: this.normalizeDateMiddleOfMonth(itemDate),
                            y: item.price
                        }
                    }

                    // THis for total money
                    if (objTotalMoneySpend[""+dateKey]) {
                        // Exist, add more
                        objTotalMoneySpend[""+dateKey].y += item.price;
                    } else {
                        // Not Exist, create new Month
                        objTotalMoneySpend[""+dateKey] = {
                            x: this.normalizeDateMiddleOfMonth(itemDate),
                            y: item.price
                        }
                    }
                }
            })
        }
        // convert to Array for Chart
        for (var prop in objServiceSpend) {
            if (Object.prototype.hasOwnProperty.call(objServiceSpend, prop)) {
                if (durationType == "quarter") {
                    // Grouping to Quarter
                    let quarterKey = "" + objServiceSpend[""+prop].x.getFullYear() + "/Q" + 
                        this.getQuarterNumberOfMonth(objServiceSpend[""+prop].x);
                    let baseDateOfQuarter = new Date(objServiceSpend[""+prop].x.getFullYear(),
                        this.getQuarterNumberOfMonth(objServiceSpend[""+prop].x) * 3 - 2,15)

                    if (objQuarter[""+quarterKey]) {
                        objQuarter[""+quarterKey].y += objServiceSpend[""+prop].y
                    } else {
                        objQuarter[""+quarterKey] = {
                            x: baseDateOfQuarter,
                            y: objServiceSpend[""+prop].y
                        }
                    }
                } else  if (durationType == "year") {
                    let yearKey = "" + objServiceSpend[""+prop].x.getFullYear();
                    let baseDateOfYear = new Date(objServiceSpend[""+prop].x.getFullYear(),
                        5,15)
                    if (objYear[""+yearKey]) {
                        objYear[""+yearKey].y += objServiceSpend[""+prop].y
                    } else {
                        objYear[""+yearKey] = {
                            x: baseDateOfYear,
                            y: objServiceSpend[""+prop].y
                        }
                    }
                } else {
                    arrServiceSpend.push(objServiceSpend[""+prop])
                }
            }
        }
        if (durationType == "quarter") {
            for (var prop in objQuarter) {
                // Because these two Obj share same prop, so set in 1 for loop
                if (Object.prototype.hasOwnProperty.call(objQuarter, prop)) {
                    arrServiceSpend.push(objQuarter[""+prop])
                }
            }
        }
        if (durationType == "year") {
            for (var prop in objYear) {
                // Because these two Obj share same prop, so set in 1 for loop
                if (Object.prototype.hasOwnProperty.call(objYear, prop)) {
                    arrServiceSpend.push(objYear[""+prop])
                }
            }
        }
        arrServiceSpend.sort(function (a, b) {
            return a.x.getTime() - b.x.getTime();
        })

        // convert to Array for Chart
        for (var prop in objTotalMoneySpend) {
            if (Object.prototype.hasOwnProperty.call(objTotalMoneySpend, prop)) {
                arrTotalMoneySpend.push(objTotalMoneySpend[""+prop])
            }
        }
        arrTotalMoneySpend.sort(function (a, b) {
            return a.x.getTime() - b.x.getTime();
        })

        return {arrGasSpend, arrOilSpend, arrAuthSpend, arrExpenseSpend, arrServiceSpend, arrTotalMoneySpend};
    }

    getInfoMoneySpend(theVehicle, duration = 12, tillDate=new Date()) {
        let CALCULATE_END_DATE = this.normalizeFillDate(new Date(tillDate.getFullYear(),tillDate.getMonth()+1,0));

        if (duration > 200 || duration == AppLocales.t("GENERAL_ALL")) {
            // THis Mean All data
            //var CALCULATE_START_DATE = this.normalizeFillDate(new Date(theVehicle.fillGasList[0].fillDate))
            
            var CALCULATE_START_DATE = this.normalizeDateBegin(new Date(CALCULATE_END_DATE.getFullYear(), 
                CALCULATE_END_DATE.getMonth() - 100 + 1, 1));
        } else {
            var CALCULATE_START_DATE = this.normalizeDateBegin(new Date(CALCULATE_END_DATE.getFullYear(), 
                CALCULATE_END_DATE.getMonth() - duration + 1, 1));
        }

        let totalGasSpend = 0;
        if (theVehicle.fillGasList && theVehicle.fillGasList.length > 0) {
            theVehicle.fillGasList.forEach(item => {
                let itemDate = this.normalizeFillDate(new Date(item.fillDate));
                if (itemDate >= CALCULATE_START_DATE && itemDate <= CALCULATE_END_DATE) {
                    totalGasSpend += item.price;
                }
            })
        }

        let totalOilSpend = 0;
        if (theVehicle.fillOilList && theVehicle.fillOilList.length > 0) {
            theVehicle.fillOilList.forEach(item => {
                let itemDate = this.normalizeFillDate(new Date(item.fillDate));
                if (itemDate >= CALCULATE_START_DATE && itemDate <= CALCULATE_END_DATE) {
                    totalOilSpend += item.price;
                }
            })
        }


        //------Auth
        let totalAuthSpend = 0;
        if (theVehicle.authorizeCarList && theVehicle.authorizeCarList.length > 0) {
            theVehicle.authorizeCarList.forEach(item => {
                let itemDate = this.normalizeFillDate(new Date(item.fillDate));
                if (itemDate >= CALCULATE_START_DATE && itemDate <= CALCULATE_END_DATE) {
                    totalAuthSpend += item.price;
                }
            })
        }


        //------Expense
        let totalExpenseSpend = 0;
        if (theVehicle.expenseList && theVehicle.expenseList.length > 0) {
            theVehicle.expenseList.forEach(item => {
                let itemDate = this.normalizeFillDate(new Date(item.fillDate));
                if (itemDate >= CALCULATE_START_DATE && itemDate <= CALCULATE_END_DATE) {
                    totalExpenseSpend += item.price;
                }
            })
        }

        //------Service
        let totalServiceSpend = 0;
        if (theVehicle.serviceList && theVehicle.serviceList.length > 0) {
            theVehicle.serviceList.forEach(item => {
                let itemDate = this.normalizeFillDate(new Date(item.fillDate));
                if (itemDate >= CALCULATE_START_DATE && itemDate <= CALCULATE_END_DATE) {
                    totalServiceSpend += item.price;
                }
            })
        }

        let totalMoneySpend = totalGasSpend+totalOilSpend+totalAuthSpend+totalExpenseSpend+totalServiceSpend;
        return {totalGasSpend, totalOilSpend, totalAuthSpend, totalExpenseSpend, totalServiceSpend, totalMoneySpend};
    }

    // TODO: Calcualte by Months here. Or no Need ?
    // Result: arrExpenseTypeSpend: [x: "Tien Phat", y: 200(K)]
    //         arrExpenseTypeByTime: [{"TienPhat": [{x: 2019-03-03, y: 200(K)}, {x: 2019-04-03, y: 100(K)}]}]
    getInfoMoneySpendInExpense(expenseList) {
        if (!expenseList) {
            return {};
        }

        let objExpenseTypeSpend = {};// Key is subtype
        let arrExpenseTypeSpend = [];

        let objExpenseTypeByTime = {};// {"TienPhat": {"2019-03-30": 200}}
        let arrExpenseTypeByTime = [];
        if (expenseList && expenseList.length > 0) {
            expenseList.forEach((item, index) => {
                let itemDate = this.normalizeFillDate(new Date(item.fillDate));
                let dateKey = "" + itemDate.getFullYear() + "/" + (itemDate.getMonth() + 1) ;
                if (!objExpenseTypeByTime[""+item.subType]) {
                    objExpenseTypeByTime[""+item.subType] = {};
                }
                if (objExpenseTypeByTime[""+item.subType][""+dateKey]) {
                    // Exist, add more
                    objExpenseTypeByTime[""+item.subType][""+dateKey].y += item.price;
                } else {
                    // Not Exist, create new Month
                    objExpenseTypeByTime[""+item.subType][""+dateKey] = {
                        x: this.normalizeDateMiddleOfMonth(itemDate),
                        y: item.price
                    }
                }

                if (objExpenseTypeSpend[""+item.subType]) {
                    // Exist, increase
                    objExpenseTypeSpend[""+item.subType] += item.price;
                } else {
                    objExpenseTypeSpend[""+item.subType] = item.price;
                }
            })
        }
        // convert to Array for Chart
        for (var prop in objExpenseTypeByTime) {
            if (Object.prototype.hasOwnProperty.call(objExpenseTypeByTime, prop)) {
                let newElement = {};
                newElement[""+prop] = [];
                
                for (var propMonth in objExpenseTypeByTime[""+prop]) {
                    if (Object.prototype.hasOwnProperty.call(objExpenseTypeByTime[""+prop], propMonth)) {
                        newElement[""+prop].push(objExpenseTypeByTime[""+prop][""+propMonth])
                    }
                }
                arrExpenseTypeByTime.push(newElement)
            }
        }


        // convert to Array for Chart
        for (var prop in objExpenseTypeSpend) {
            if (Object.prototype.hasOwnProperty.call(objExpenseTypeSpend, prop)) {
                arrExpenseTypeSpend.push({
                    y: objExpenseTypeSpend[""+prop],
                    x: prop
                })
            }
        }
        // this.CONSOLE_LOG("objExpenseTypeByTime)))))))))))))))))")
        // this.CONSOLE_LOG(objExpenseTypeByTime)
        // this.CONSOLE_LOG("arrExpenseTypeByTime~~~~~~~~~~~~~~~~~~")
        // this.CONSOLE_LOG(arrExpenseTypeByTime)
        return {arrExpenseTypeSpend, arrExpenseTypeByTime};
    }

    getInfoMoneySpendInService(serviceList) {
        if (!serviceList) {
            return {};
        }

        let objExpenseTypeSpend = {};// Key is subtype
        let arrServiceTypeSpend = [];
        let totalServiceSpend2 = 0;

        if (serviceList && serviceList.length > 0) {
            serviceList.forEach((item, index) => {
                let itemDate = this.normalizeFillDate(new Date(item.fillDate));
                let theType = "";
                if (item.isConstantFix) {
                    theType = AppLocales.t("NEW_SERVICE_CONSANTFIX");
                } else {
                    if (item.validForIndex == 0) {
                        theType = AppLocales.t("SETTING_MAINTAIN_L1");
                    } else if (item.validForIndex == 1) {
                        theType = AppLocales.t("SETTING_MAINTAIN_L2");
                    } else if (item.validForIndex == 2) {
                        theType = AppLocales.t("SETTING_MAINTAIN_L3");
                    } else if (item.validForIndex == 3) {
                        theType = AppLocales.t("SETTING_MAINTAIN_L4");
                    } else if (item.validForIndex == 4) {
                        theType = AppLocales.t("SETTING_MAINTAIN_L5");
                    }
                }

                if (objExpenseTypeSpend[""+theType]) {
                    // Exist, increase
                    objExpenseTypeSpend[""+theType] += item.price;
                } else {
                    objExpenseTypeSpend[""+theType] = item.price;
                }
                totalServiceSpend2 += item.price;
            })
        }

        // convert to Array for Chart
        for (var prop in objExpenseTypeSpend) {
            if (Object.prototype.hasOwnProperty.call(objExpenseTypeSpend, prop)) {
                arrServiceTypeSpend.push({
                    y: objExpenseTypeSpend[""+prop],
                    x: prop
                })
            }
        }
        // this.CONSOLE_LOG("objExpenseTypeByTime)))))))))))))))))")
        // this.CONSOLE_LOG(objExpenseTypeByTime)
        // this.CONSOLE_LOG("arrExpenseTypeByTime~~~~~~~~~~~~~~~~~~")
        // this.CONSOLE_LOG(arrExpenseTypeByTime)
        return {arrServiceTypeSpend, totalServiceSpend2};
    }

    // settingService = {
    //     Km: [5000, 10000, 20000, 40000, 80000],
    //     Month: [6, 12, 24, 48, 96]
    // }

    // reminds {
    //     level1: {
    //         currentKm: 100,
    //         nextEstimatedKm: 200,
    //         nextEsimatedDate: date, 
    //     }
    // ]

    // TBD this function. This is Complicated but not Sure Effective
    getRemindInfoForServiceMaintain(serviceList, settingService, prevMaintainReminds) {
        if (!serviceList) {
            return {};
        }
        let nextEstimateDateForService = null;
        let lastEstimateKmForService = 0;
        let serviceReminds = {}

        if (serviceList && serviceList.length > 0) {
            for (let index = serviceList.length -1; index >= 0; index--) {
                let item = serviceList[index];
                if (!item.isContantFix) {
                    // this is the Latest bao Duong
                    let itemDate = this.normalizeFillDate(new Date(item.fillDate));
                    
                    // If Maintain Level1, no need to Remind
                    if (item.validFor == settingService.Km[1]) {
                        // Bao DUong Trung Binh -> Create Remind L1, L2(TrungBinh)
                        serviceReminds.level1 = {
                            description: AppLocales.t("GENERAL_MAINTAIN_BAODUONG") + " " + AppLocales.t("MAINTAIN_LEVEL1"),
                            currentKm: item.currentKm,
                            nextEstimatedKm: item.currentKm + settingService.Km[0]
                        }
                        serviceReminds.level2 = {
                            description: AppLocales.t("GENERAL_MAINTAIN_BAODUONG") + " " + AppLocales.t("MAINTAIN_LEVEL2"),
                            currentKm: item.currentKm,
                            nextEstimatedKm: item.currentKm + item.validFor
                        }
                    } else if (item.validFor == settingService.Km[2]) { // Trung Binh Lon
                        // Bao DUong Trung Binh -> Create Remind L1, L2(TrungBinh), L4|L4
                        serviceReminds.level1 = {
                            description: AppLocales.t("GENERAL_MAINTAIN_BAODUONG") + " " + AppLocales.t("MAINTAIN_LEVEL1"),
                            currentKm: item.currentKm,
                            nextEstimatedKm: item.currentKm + settingService.Km[0]
                        }
                        serviceReminds.level2 = {
                            description: AppLocales.t("GENERAL_MAINTAIN_BAODUONG") + " " + AppLocales.t("MAINTAIN_LEVEL2"),
                            currentKm: item.currentKm,
                            nextEstimatedKm: item.currentKm + settingService.Km[1]
                        }

                        // calculate 
                    }
                }
            }
        }
    }

    // props contain userData
    // Sync data based on information 
    async syncDataPartlyToServer(props) {
        //modifiedInfo: {vehicleIds:[], changedAllVehicles: false, changedCustom: false, changedSetting: false,changedItemCount: 0},
        NetInfo.fetch().then(state => {
        if (state.isConnected) {

            if (props.userData.modifiedInfo.changedItemCount > 0) {
                this.CONSOLE_LOG(">>>>>>>>>>>>>>>>>>>>>>>>>>>> Start syncDataPartlyToServer")
                var objectToSync = {};//vehicleList, someVehicles, customServiceModules...
                if (props.userData.modifiedInfo.changedAllVehicles) {
                    objectToSync.vehicleList = props.userData.vehicleList;
                } else {
                    // if length of ids is same as vehicleList, mean all Car need update
                    if (props.userData.modifiedInfo.vehicleIds.length > 0) {
                        if (props.userData.modifiedInfo.vehicleIds.length == props.userData.vehicleList.length) {
                            objectToSync.vehicleList = props.userData.vehicleList;
                        } else {
                            // Only add some Vehicles
                            objectToSync.someVehicles = [];
                            props.userData.vehicleList.forEach(item => {
                                if (props.userData.modifiedInfo.vehicleIds.indexOf(item.id) >= 0) {
                                    objectToSync.someVehicles.push(item)
                                }
                            })
                        }
                    }
                }

                if (props.userData.modifiedInfo.changedCustom) {
                    objectToSync.customServiceModules = props.userData.customServiceModules;
                    objectToSync.customServiceModulesBike = props.userData.customServiceModulesBike;
                    objectToSync.customVehicleModel = props.userData.customVehicleModel;
                    
                }

                if (props.userData.modifiedInfo.changedSetting) {
                    objectToSync.settings = props.userData.settings;
                    objectToSync.settingService = props.userData.settingService;
                }

                // If there is data in objectToSync, sync
                if (Object.keys(objectToSync).length > 0) {
                    Backend.postSomeDataToServer(objectToSync, props.userData.token,
                    response => {
                        this.CONSOLE_LOG("<<<<<<<<<<<<<<<<<<<<<<<<<< Sync Some Data OK")
                        props.actUserSyncPartlyOK()
                    },
                    error => {
                        this.CONSOLE_LOG(error.response)
                    }
                    );
                }
            }
        } else {
            this.CONSOLE_LOG("*** Dont have NEtwork, will Sync later")
          }
      });

    }

    async syncDataToServer(props) {
        this.CONSOLE_LOG("LengVehicleList:" + props.userData.vehicleList.length)
      if (props.userData.vehicleList && props.userData.vehicleList.length > 0) {
        Backend.postFillItemList({
            vehicleList: props.userData.vehicleList,
            customServiceModules: props.userData.customServiceModules,
            customServiceModulesBike: props.userData.customServiceModulesBike,
            customVehicleModel: props.userData.customVehicleModel,
            settings: props.userData.settings,
            settingService: props.userData.settingService
            }, props.userData.token ,"vehicle",
          response => {
            this.CONSOLE_LOG("Sync Post Vehicle OK")
            Toast.show({
                text: AppLocales.t("TOAST_SYNC_TO_SERVER_OK"),
                //buttonText: "Okay",
                position:"top",
                type: "success"
            })

            props.actVehicleSyncToServerOK()
        },
          error => {this.CONSOLE_LOG(error)}
        );
      }
      // if (props.userData.fillGasList && props.userData.fillGasList.length > 0) {
      //   Backend.postFillItemList(props.userData.fillGasList, props.userData.token, "gas",
      //     response => {this.CONSOLE_LOG("Sync Post Gas OK")},
      //     error => {this.CONSOLE_LOG(error)}
      //   );
      // }
      // if (props.userData.fillOilList && props.userData.fillOilList.length > 0) {
      //   Backend.postFillItemList(props.userData.fillOilList, props.userData.token, "oil",
      //     response => {this.CONSOLE_LOG("Sync Post Oil OK")},
      //     error => {this.CONSOLE_LOG(error)}
      //   );
      // }
      // if (props.userData.authorizeCarList && props.userData.authorizeCarList.length > 0) {
      //   Backend.postFillItemList(props.userData.authorizeCarList, props.userData.token, "authcheck",
      //     response => {this.CONSOLE_LOG("Sync Post AuthCheck OK")},
      //     error => {this.CONSOLE_LOG(error)}
      //   );
      // }
      // if (props.userData.expenseList && props.userData.expenseList.length > 0) {
      //   Backend.postFillItemList(props.userData.expenseList, props.userData.token, "expense",
      //     response => {this.CONSOLE_LOG("Sync Post Expense OK")},
      //     error => {this.CONSOLE_LOG(error)}
      //   );
      // }
      // if (props.userData.serviceList && props.userData.serviceList.length > 0) {
      //   Backend.postFillItemList(props.userData.serviceList, props.userData.token, "service",
      //     response => {this.CONSOLE_LOG("Sync Post Service OK")},
      //     error => {this.CONSOLE_LOG(error)}
      //   );
      // }
    }

    // Data will Have: {
    // vehicleList: props.userData.vehicleList,
    // customServiceModules: props.userData.customServiceModules,
    // customServiceModulesBike: props.userData.customServiceModulesBike,
    // settings: props.userData.settings,
    // settingService: props.userData.settingService
    // }
    syncDataFromServer(props, isMergeDataBefore = false) {
        props.actUserStartSyncPrivate();
        Backend.getAllItemList(props.userData.token,
            response => {
                this.CONSOLE_LOG("Sync Vehicle From Server OK");
                //this.props.actVehicleAddVehicle(response.data, true)
                //this.CONSOLE_LOG(response.data.myJoinRequest)
                props.actVehicleSyncAllFromServer(response.data, props, isMergeDataBefore)
            },
            error => {this.CONSOLE_LOG("Sync Vehicle From Server Error");this.CONSOLE_LOG(error);}
        );
        
        //this.cancelAllAppLocalNotification();

        // If User is Member and TEam have setting of cannot view report
        //this.CONSOLE_LOG(props.userData.userProfile.roleInTeam)
        //user not is manager and setting cannot see
        if (!props.userData.teamInfo || props.userData.userProfile.roleInTeam != "manager") {
            Backend.getLatestTeamInfoOfMe(props.userData.token,
                response => {
                    this.CONSOLE_LOG("===============getLatestTeamInfoOfMe Data SyncAll")
                    this.CONSOLE_LOG(response.data)
                    // Rejoin team can ReUse Create Team
                    props.actUserCreateTeamOK(response.data, true)
        
                    // Sync Team Data heare also
                    if (response.data.canMemberViewReport) {
                      Backend.getAllUserOfTeam({teamId: props.userData.userProfile.teamId}, 
                          props.userData.token, 
                      response2 => {
                          this.CONSOLE_LOG("GEt all Member in Team OK")
        
                          props.actTeamGetDataOK(response2.data, props.userData, props.teamData, props)
                      },
                      error => {
                          props.actUserStartSyncTeamDone();
                          this.CONSOLE_LOG("GEt all Member in Team ERROR")
                          this.CONSOLE_LOG(JSON.stringify(error))
                      }
                      );
                    } else {
                      props.actTeamGetDataOK([], props.userData, props.teamData, props)
                    }
                }, err => {
                    props.actUserStartSyncTeamDone();
                    this.CONSOLE_LOG("get LatestTeamInfo ERROR")
                    this.CONSOLE_LOG(err)
                    if (err.response.data.code == 100) {
                      // Seems User is Removed from Team
                      props.actUserLeaveTeamOK()
                      props.actTeamLeaveTeamOK()
                    }
            })
        } else {
            props.actUserStartSyncTeam();
            Backend.getAllJoinTeamRequest(props.userData.token, 
            response => {
                this.CONSOLE_LOG("GEt all JoinRequest OK")
                // this.CONSOLE_LOG(response.data)
                //this.props.actUserLoginOK(response.data)
                //this.props.navigation.navigate("Settings")
                props.actTeamGetJoinRequestOK(response.data)

                Backend.getAllUserOfTeam({teamId: props.userData.teamInfo.id}, props.userData.token, 
                    response => {
                        this.CONSOLE_LOG("GEt all Member in Team OK")
                        // this.CONSOLE_LOG(response.data)
                        //this.props.actUserLoginOK(response.data)
                        //this.props.navigation.navigate("Settings")
                        // this.setState({
                        //   members: response.data
                        // })
                        props.actTeamGetDataOK(response.data, props.userData, props.teamData, props)
                    },
                    error => {
                        props.actUserStartSyncTeamDone(); // close Dialog also when Error
                        this.CONSOLE_LOG("GEt all Member in Team ERROR")
                        this.CONSOLE_LOG(JSON.stringify(error))
                    }
                );
            },
            error => {
                props.actUserStartSyncTeamDone(); // close Dialog also when Error
                this.CONSOLE_LOG("GEt all JoinRequest AppUtils ERROR")
                this.CONSOLE_LOG(JSON.stringify(error))
            }
            );
        }
    
        // if (!isFailedInOneStep) {
        //   await new Promise((resolve, reject) => {
        //     Backend.getAllItemList("gas", props.userData.token,
        //       response => {
        //         this.CONSOLE_LOG("Sync Gas From Server OK");
        //         //this.props.actVehicleAddFillItem(response.data, AppConstants.FILL_ITEM_GAS, true)
        //         syncData.gas = response.data;
        //         resolve(response.data);
        //       },
        //       error => {this.CONSOLE_LOG("Sync Gas From Server ERR");this.CONSOLE_LOG(error); isFailedInOneStep = true;reject(error)}
        //     );
        //   });
        // }
    
        // if (!isFailedInOneStep) {
        //   await new Promise((resolve, reject) => {
        //     Backend.getAllItemList("oil", props.userData.token,
        //       response => {
        //         this.CONSOLE_LOG("Sync Oil From Server OK");
        //         //this.props.actVehicleAddFillItem(response.data, AppConstants.FILL_ITEM_OIL, true)
        //         syncData.oil = response.data;
        //         resolve(response.data);
        //       },
        //       error => {this.CONSOLE_LOG("Sync Oil From Server ERR");this.CONSOLE_LOG(error); isFailedInOneStep = true;reject(error)}
        //     );
        //   });
        // }
    
        // if (!isFailedInOneStep) {
        //   await new Promise((resolve, reject) => {
        //     Backend.getAllItemList("authcheck", props.userData.token,
        //       response => {
        //         this.CONSOLE_LOG("Sync authcheck From Server OK");
        //         //this.props.actVehicleAddFillItem(response.data, AppConstants.FILL_ITEM_AUTH, true)
        //         syncData.authcheck = response.data;
        //         resolve(response.data);
        //       },
        //       error => {this.CONSOLE_LOG("Sync authcheck From Server ERR");this.CONSOLE_LOG(error); isFailedInOneStep = true;reject(error)}
        //     );
        //   });
        // }
    
        // if (!isFailedInOneStep) {
        //   await new Promise((resolve, reject) => {
        //     Backend.getAllItemList("expense", props.userData.token,
        //       response => {
        //         this.CONSOLE_LOG("Sync expense From Server OK");
        //         //this.props.actVehicleAddFillItem(response.data, AppConstants.FILL_ITEM_EXPENSE, true)
        //         syncData.expense = response.data;
        //         resolve(response.data);
        //       },
        //       error => {this.CONSOLE_LOG("Sync expense From Server ERR");this.CONSOLE_LOG(error); isFailedInOneStep = true;reject(error)}
        //     );
        //   });
        // }
    
        // if (!isFailedInOneStep) {
        //   await new Promise((resolve, reject) => {
        //     Backend.getAllItemList("service", props.userData.token,
        //       response => {
        //         this.CONSOLE_LOG("Sync service From Server OK");
        //         //this.props.actVehicleAddFillItem(response.data, AppConstants.FILL_ITEM_SERVICE, true)
        //         syncData.service = response.data;
        //         resolve(response.data);
        //       },
        //       error => {this.CONSOLE_LOG("Sync service From Server ERR");this.CONSOLE_LOG(error); isFailedInOneStep = true;reject(error)}
        //     );
        //   });
        // }
    
    }

    // remindSetting: kmForOilRemind,dayForAuthRemind,dayForInsuranceRemind,dayForRoadFeeRemind
    async actTempCalculateCarReportAsyncWrapper(currentVehicle, options, remindSetting, prevCarReports, settingService) {
        return new Promise((resolve, reject) => {
            try {
                this.CONSOLE_LOG("~~~~~~~~~~~~~~~~ Calling actTempCalculateCarReportAsync:" + currentVehicle.licensePlate)
                // let result = this.actTempCalculateCarReportAsync(currentVehicle, options, remindSetting);
                // if (result) {
                //     resolve(result)
                // } else {
                //     reject({msg: "null result"})
                // }
                this.actTempCalculateCarReportAsync(currentVehicle, options, remindSetting, prevCarReports, settingService)
                .then (result => {
                    this.CONSOLE_LOG("  ^^^ Result")
                    resolve(result)
                })
                .catch (err => {
                    reject({msg: "null result"})
                })
                this.CONSOLE_LOG("  >>>>>> ENd calling async")
            } catch (err) {
                reject(err)
            }
        })
    }
    async actTempCalculateCarReportAsync(currentVehicle, options, remindSetting, prevCarReports, settingService) {
        //return new Promise((resolve, reject) => {
            if ( !options ) {
                // Default
                options = {
                    durationType: "month",
                    tillDate: new Date(),
                    duration: 12,
                }
            }
            //Cancel all PRevious Notification in case of PRIVATE car
            // No Need Notification
            // if (remindSetting && prevCarReports) {
            //     if (prevCarReports[currentVehicle.id]) {
            //         let report = prevCarReports[currentVehicle.id];
            //         if (report&&report.scheduledNotification) {
            //             if (report.scheduledNotification.authNotify) {
            //                 let notObj = report.scheduledNotification.authNotify;
            //                 if (notObj.notificationId != null && notObj.notificationId != undefined) {
            //                     await new Promise((resolve, reject) => {
            //                         Notifications.cancelScheduledNotificationAsync(notObj.notificationId )
            //                         .then(ret => {
            //                             this.CONSOLE_LOG("  OK Cancel Notification Auth:" + notObj.notificationId)
            //                             resolve(ret);
            //                         }).catch (error => {
            //                             this.CONSOLE_LOG("   Error Cancel:");this.CONSOLE_LOG(error);reject(error)
            //                         })
            //                     })
            //                 }
            //             }
            //             if (report.scheduledNotification.insuranceNotify) {
            //                 let notObj = report.scheduledNotification.insuranceNotify;
            //                 if (notObj.notificationId != null && notObj.notificationId != undefined) {
            //                     await new Promise((resolve, reject) => {
            //                         Notifications.cancelScheduledNotificationAsync(notObj.notificationId )
            //                         .then(ret => {
            //                             this.CONSOLE_LOG("  OK Cancel Notification Insurance:" + notObj.notificationId)
            //                             resolve(ret);
            //                         }).catch (error => {
            //                             this.CONSOLE_LOG("   Error Cancel:");this.CONSOLE_LOG(error);reject(error)
            //                         })
            //                     })
            //                 }
            //             }
            //             if (report.scheduledNotification.roadFeeNotify) {
            //                 let notObj = report.scheduledNotification.roadFeeNotify;
            //                 if (notObj.notificationId != null && notObj.notificationId != undefined) {
            //                     await new Promise((resolve, reject) => {
            //                         Notifications.cancelScheduledNotificationAsync(notObj.notificationId )
            //                         .then(ret => {
            //                             this.CONSOLE_LOG("  OK Cancel Notification RoadFee:" + notObj.notificationId)
            //                             resolve(ret);
            //                         }).catch (error => {
            //                             this.CONSOLE_LOG("   Error Cancel:");this.CONSOLE_LOG(error);reject(error)
            //                         })
            //                     })
            //                 }
            //             }
            //         }
            //     }
            // }

            //let {lastDate, lastKm, averageKmPerDay} = AppUtils.getLastDateAndKmFromGas(currentVehicle.fillGasList);
            let {averageKmPerLiter, averageMoneyPerLiter, averageMoneyPerDay, averageKmPerDay, averageMoneyPerKmPerDay, lastDate, lastKm,
                arrMoneyPerWeek, arrKmPerWeek, totalMoneyGas, arrTotalKmMonthly, arrTotalMoneyMonthly, arrTotalMoneyPerKmMonthly,
                avgKmMonthly, avgMoneyMonthly, avgMoneyPerKmMonthly, totalKmGas}
                = this.getStatForGasUsage(currentVehicle.fillGasList, 
                    options.duration, options.durationType, options.tillDate);

            // let {lastKmOil, lastDateOil, totalMoneyOil, passedKmFromPreviousOil, nextEstimateDateForOil, lastOilKmValidFor}
            //     = this.getInfoForOilUsage(currentVehicle.fillOilList, 
            //         lastDate, lastKm, averageKmPerDay);

            let {lastKmMaintain, lastDateMaintain, lastMaintainKmValidFor, nextEstimatedKmForMaintain,
                nextEstimatedDateForMaintain, passedKmFromPreviousMaintain, totalNextDay}
                = this.getRemindForMaintain(currentVehicle.serviceList, settingService, lastKm)

            let {diffDayFromLastAuthorize, nextAuthorizeDate, totalMoneyAuthorize, lastAuthDaysValidFor,
                diffDayFromLastAuthorizeInsurance, nextAuthorizeDateInsurance, lastAuthDaysValidForInsurance,
                diffDayFromLastAuthorizeRoadFee, nextAuthorizeDateRoadFee, lastAuthDaysValidForRoadFee}
                = this.getInfoCarAuthorizeDate(currentVehicle.authorizeCarList)

            let {arrGasSpend, arrOilSpend, arrAuthSpend, arrExpenseSpend, arrServiceSpend, arrTotalMoneySpend}
                = this.getInfoMoneySpendByTime(currentVehicle, options.duration, options.durationType, options.tillDate);
    
            let {totalGasSpend, totalOilSpend, totalAuthSpend, totalExpenseSpend, totalServiceSpend, totalMoneySpend}
                = this.getInfoMoneySpend(currentVehicle, options.duration, options.tillDate);
            
            let {arrExpenseTypeSpend, arrExpenseTypeByTime} = this.getInfoMoneySpendInExpense(currentVehicle.expenseList,
                options.duration, options.durationType, options.tillDate);

            let {arrServiceTypeSpend, totalServiceSpend2} = this.getInfoMoneySpendInService(currentVehicle.serviceList);

            // Create Notification Scheduler
            // Only process if UserData (not Team)
            // let scheduledNotification = {};
            // if (remindSetting && prevCarReports) {
            //     let todayDate = new Date();
            //     let tomorrowDate = new Date(todayDate.getFullYear(),
            //     todayDate.getMonth(), todayDate.getDate() + 1, 23,59,58);

            //     // if NextAuthDate is Over Today, no need notification
            //     if (nextAuthorizeDate && nextAuthorizeDate.getTime() > tomorrowDate.getTime()) {
                    
            //         let gapToRemind = 15;
            //         if (remindSetting && remindSetting.dayForAuthRemind > 1) {
            //             gapToRemind = remindSetting.dayForAuthRemind;
            //         }
            //         let remindAuthDate = new Date(nextAuthorizeDate);
            //         remindAuthDate.setDate(remindAuthDate.getDate()-gapToRemind)
            //         // If remindAuthDate is Behind Today, but actual AuthDate is still not Come. Remind Tomorrow
            //         if (remindAuthDate.getTime() < todayDate.getTime()) {
            //             remindAuthDate = tomorrowDate;
            //         }

            //         let notifyId = await this.scheduleAppLocalNotification(AppLocales.t("NOTIFICATION_AUTH"), ""+currentVehicle.brand + " " + currentVehicle.model + " "
            //             + currentVehicle.licensePlate, nextAuthorizeDate, remindAuthDate)

            //         if (notifyId!=null && notifyId!=undefined) {
            //             scheduledNotification.authNotify = {
            //                 vehicleId: currentVehicle.id,
            //                 vehiclePlate: currentVehicle.licensePlate,
            //                 remindDate: remindAuthDate,
            //                 // vehicleBrandModel: currentVehicle.brand + " " + currentVehicle.model,
            //                 onDate: nextAuthorizeDate,
            //                 type: "auth",
            //                 notificationId: notifyId, // Set Later
            //             }
            //         }
            //     }
            //     if (nextAuthorizeDateInsurance && nextAuthorizeDateInsurance.getTime() > tomorrowDate.getTime()) {
            //         let gapToRemind = 15;
            //         if (remindSetting && remindSetting.dayForInsuranceRemind > 1) {
            //             gapToRemind = remindSetting.dayForInsuranceRemind;
            //         }
            //         let remindAuthDate = new Date(nextAuthorizeDateInsurance);
            //         remindAuthDate.setDate(remindAuthDate.getDate()-gapToRemind);
            //         // If remindAuthDate is Behind Today, but actual AuthDate is still not Come. Remind Tomorrow
            //         if (remindAuthDate.getTime() < todayDate.getTime()) {
            //             remindAuthDate = tomorrowDate;
            //         }
            //         let notifyId = await this.scheduleAppLocalNotification(AppLocales.t("NOTIFICATION_INSURANCE"), ""+currentVehicle.brand + " " + currentVehicle.model + " "
            //             + currentVehicle.licensePlate, nextAuthorizeDateInsurance, remindAuthDate)
            //         if (notifyId!=null && notifyId!=undefined) {
            //             scheduledNotification.insuranceNotify = {
            //                 vehicleId: currentVehicle.id,
            //                 vehiclePlate: currentVehicle.licensePlate,
            //                 remindDate: remindAuthDate,
            //                 // vehicleBrandModel: currentVehicle.brand + " " + currentVehicle.model,
            //                 onDate: nextAuthorizeDateInsurance,
            //                 type: "insurance",
            //                 notificationId: notifyId,
            //             }
            //         }
            //     }
            //     if (nextAuthorizeDateRoadFee && nextAuthorizeDateRoadFee.getTime() > tomorrowDate.getTime()) {
            //         let gapToRemind = 15;
            //         if (remindSetting && remindSetting.dayForRoadFeeRemind > 1) {
            //             gapToRemind = remindSetting.dayForRoadFeeRemind;
            //         }
            //         let remindAuthDate = new Date(nextAuthorizeDateRoadFee);
            //         remindAuthDate.setDate(remindAuthDate.getDate()-gapToRemind);
            //         // If remindAuthDate is Behind Today, but actual AuthDate is still not Come. Remind Tomorrow
            //         if (remindAuthDate.getTime() < todayDate.getTime()) {
            //             remindAuthDate = tomorrowDate;
            //         }
            //         let notifyId = await this.scheduleAppLocalNotification(AppLocales.t("NOTIFICATION_ROADFEE"), ""+currentVehicle.brand + " " + currentVehicle.model + " "
            //             + currentVehicle.licensePlate, nextAuthorizeDateRoadFee, remindAuthDate)
            //         if (notifyId!=null && notifyId!=undefined) {
            //             scheduledNotification.roadFeeNotify = {
            //                 vehicleId: currentVehicle.id,
            //                 vehiclePlate: currentVehicle.licensePlate,
            //                 // vehicleBrandModel: currentVehicle.brand + " " + currentVehicle.model,
            //                 onDate: nextAuthorizeDateInsurance,
            //                 remindDate: remindAuthDate,
            //                 type: "roadFee",
            //                 notificationId: notifyId,
            //             }
            //         }
            //     }
            // }

            let result = {
                gasReport: {averageKmPerLiter, averageMoneyPerLiter, averageMoneyPerDay, averageKmPerDay, averageMoneyPerKmPerDay, lastDate, lastKm,
                    arrMoneyPerWeek, arrKmPerWeek, totalMoneyGas, arrTotalKmMonthly, arrTotalMoneyMonthly, arrTotalMoneyPerKmMonthly,
                    avgKmMonthly, avgMoneyMonthly, avgMoneyPerKmMonthly, totalKmGas},
                //oilReport: {lastKmOil, lastDateOil, totalMoneyOil, passedKmFromPreviousOil, nextEstimateDateForOil, lastOilKmValidFor},
                authReport: {diffDayFromLastAuthorize, nextAuthorizeDate, totalMoneyAuthorize, lastAuthDaysValidFor,
                    diffDayFromLastAuthorizeInsurance, nextAuthorizeDateInsurance, lastAuthDaysValidForInsurance,
                    diffDayFromLastAuthorizeRoadFee, nextAuthorizeDateRoadFee, lastAuthDaysValidForRoadFee},
                moneyReport: {arrGasSpend, arrOilSpend, arrAuthSpend, arrExpenseSpend, arrServiceSpend,arrTotalMoneySpend,
                    totalGasSpend, totalOilSpend, totalAuthSpend, totalExpenseSpend, totalServiceSpend, totalMoneySpend},
                expenseReport: {arrExpenseTypeSpend, arrExpenseTypeByTime},
                maintainRemind: {lastKmMaintain, lastDateMaintain, lastMaintainKmValidFor, nextEstimatedKmForMaintain,
                    nextEstimatedDateForMaintain, passedKmFromPreviousMaintain, totalNextDay},
                serviceReport: {arrServiceTypeSpend, totalServiceSpend2},
                //scheduledNotification: scheduledNotification
            }
            
            return result;
          //  resolve(result)
        //});
    }

    async scheduleAppLocalNotification(body, title, onDate, remindDate, isForceHour = false) {
        return new Promise((resolve, reject) => {
            // Random Hour on Notification in DayTime
            if (!onDate || !remindDate) {
                // Schedule after 5second
                notifyDate = new Date();
                notifyDate.setTime(notifyDate.getTime() + 5000)
            } else {
                if (isForceHour) {
                    var notifyDate = new Date(remindDate)
                } else {
                    var notifyDate = new Date(
                        remindDate.getFullYear()
                        ,remindDate.getMonth()
                        ,remindDate.getDate()
                        ,getRandomIntInclusive(10, 21),30,0
                    )
                    // var notifyDate = new Date()
                    // notifyDate = new Date(
                    //     notifyDate.getFullYear()
                    //     ,notifyDate.getMonth()
                    //     ,notifyDate.getDate()
                    //     ,23,21,0
                    // )
                }
            }
            if (Platform.OS === 'android') {
                Notifications.createChannelAndroidAsync('qlx-reminders', {
                name: 'Reminders',
                priority: 'max',
                sound: true, // android 7.0 , 6, 5 , 4
                vibrate: [0, 250, 250, 250],
                });
            }
            this.CONSOLE_LOG("#######################3 Create Android Async")
            this.CONSOLE_LOG(notifyDate.toLocaleDateString())

            const localNotification = {
                title: title,
                body: body+ ": " + this.formatDateMonthDayYearVNShort(notifyDate),
                android: {
                    channelId: 'qlx-reminders',
                }
            };
        
            const schedulingOptions = {
                time: notifyDate.getTime()
            }

            // Notifications show only when app is not active.
            // (ie. another app being used or device's screen is locked)
            Notifications.scheduleLocalNotificationAsync(
                localNotification, schedulingOptions
            )
            .then(notifyId => {
                this.CONSOLE_LOG("OK Result:" + notifyId)
                resolve(notifyId);
            }).catch (error => {
                this.CONSOLE_LOG("Error Result:")
                this.CONSOLE_LOG(error)
                reject(error)
            })
                        // this.CONSOLE_LOG("    OK Result:" + notifyId)
            // return notifyId;
        })
    };

    async cancelAppLocalNotification(notificationId) {
        await new Promise((resolve, reject) => {
            Notifications.cancelScheduledNotificationAsync(notificationId )
            .then(ret => {
                this.CONSOLE_LOG("  OK Cancel Notification:" + notificationId)
                resolve(ret);
            }).catch (error => {
                this.CONSOLE_LOG("   Error Cancel:");this.CONSOLE_LOG(error);reject(error)
            })
        })
    };
    async cancelAllAppLocalNotification() {
        await new Promise((resolve, reject) => {
            Notifications.cancelAllScheduledNotificationsAsync( )
            .then(ret => {
                this.CONSOLE_LOG("  OK Cancel All Notification:")
                resolve(ret);
            }).catch (error => {
                this.CONSOLE_LOG("   Error Cancel:");this.CONSOLE_LOG(error);reject(error)
            })
        })
    };
}

const apputils = new AppUtils();

export default apputils;