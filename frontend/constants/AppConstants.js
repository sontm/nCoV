import { Platform} from 'react-native';
import Layout from './Layout';

// TODO

// test app id "ca-app-pub-3940256099942544~3347511713"
//const ADS_BANNERID_ANDROID = "ca-app-pub-3940256099942544/6300978111"
// const ADS_BANNERID_IOS= "ca-app-pub-3940256099942544/6300978111"
// const ADS_INTERESTIALID_ANDROID = "ca-app-pub-3940256099942544/1033173712"
// const ADS_INTERESTIALID_IOS = "ca-app-pub-3940256099942544/1033173712"

//APpID:ca-app-pub-7157132347657223~8153766505

//"ca-app-pub-5235227193347581/5528923501" // StepsMemory
const ADS_BANNERID_ANDROID = "ca-app-pub-3071645117258809/6534309870"
const ADS_INTERESTIALID_ANDROID = "ca-app-pub-3071645117258809/2595064866"

const ADS_BANNERID_IOS= "ca-app-pub-3940256099942544/6300978111"
const ADS_INTERESTIALID_IOS = "ca-app-pub-3940256099942544/1033173712"

const STATUSBAR_HEIGHT = Platform.OS == 'ios' ? 20 : 0;
const BANNER_ID = Platform.OS === 'ios' ? ADS_BANNERID_IOS : ADS_BANNERID_ANDROID;
const INTERESTIAL_ID = Platform.OS === 'ios' ? ADS_INTERESTIALID_IOS : ADS_INTERESTIALID_ANDROID;

const NCOV_DATA = {
    data: [
        {
            date:"2020-01-31",
            world: {
                case: 9929,
                death: 213,
            },
            tranmission_rate_min: 2.0,
            tranmission_rate_max: 3.1,
            fatality_rate: 2,
            incubation_period_min: 2,
            incubation_period_max: 14,
            countries: [
            {
                name:"China",
                name_vn:"China",
                code:"cn",
                case: 9782,
                death: 213,
                suspect: null,
                isolate: null,
                curve: null
            },{
                name:"Thailand",
                name_vn:"Thailand",
                code:"thai",
                case: 19,
                death: 3,
            },{
                name:"Singapore",
                name_vn:"Singapore",
                code:"sg",
                case: 16,
                death: 2,
            },{
                name:"Japan",
                name_vn:"Japan",
                code:"jp",
                case: 15,
                death: 2,

            },{
                name:"Hong Kong",
                name_vn:"Hong Kong",
                code:"hk",
                case: 12,
                death: 3,

            },{
                name:"South Korea",
                name_vn:"South Korea",
                code:"kr",
                case: 11,
                death: 5,

            },{
                name:"Taiwan",
                name_vn:"Taiwan",
                code:"tw",
                case: 9,
                death: 6,

            },{
                name:"Australia",
                name_vn:"Australia",
                code:"aus",
                case: 9,
                death: 5,

            },{
                name:"Malaysia",
                name_vn:"Malaysia",
                code:"ma",
                case: 8,
                death: 0,

            },{
                name:"Macao",
                name_vn:"Macao",
                code:"Macao",
                case: 7,
                death: 0,

            },{
                name:"France",
                name_vn:"France",
                code:"fr",
                case: 6,
                death: 0,

            },{
                name:"United States",
                name_vn:"United States",
                code:"us",
                case: 6,
                death: 0,

            },{
                name:"Germany",
                name_vn:"Germany",
                code:"ger",
                case: 5,
                death: 0,

            },{
                name:"Vietnam",
                name_vn:"Vietnam",
                code:"vn",
                case: 5,
                death: 0,
                suspect: 32,
                isolate: 97,
            },{
                name:"UAE",
                name_vn:"UAE",
                code:"uae",
                case: 4,
                death: 0,

            },{
                name:"Canada",
                name_vn:"Canada",
                code:"Canada",
                case: 3,
                death: 0,

            },{
                name:"Italy",
                name_vn:"Italy",
                code:"Italy",
                case: 2,
                death: 0,

            },{
                name:"United Kingdom",
                name_vn:"United Kingdom",
                code:"uk",
                case: 2,
                death: 0,

            },{
                name:"Russia",
                name_vn:"Russia",
                code:"ru",
                case: 2,
                death: 0,

            },{
                name:"Finland",
                name_vn:"Finland",
                code:"Finland",
                case: 1,
                death: 0,

            },{
                name:"Sri Lanka",
                name_vn:"Sri Lanka",
                code:"Sri Lanka",
                case: 1,
                death: 0,

            },{
                name:"Cambodia",
                name_vn:"Cambodia",
                code:"Cambodia",
                case: 1,
                death: 0,

            },{
                name:"Philippines",
                name_vn:"Philippines",
                code:"Philippines",
                case: 1,
                death: 0,

            },{
                name:"Nepal",
                name_vn:"Nepal",
                code:"Nepal",
                case: 1,
                death: 0,

            },{
                name:"India",
                name_vn:"India",
                code:"India",
                case: 1,
                death: 0,

            }
            ]
        },{
            date:"2020-01-30",
            world: {
                case: 7818,
                death: 170,
            },
            countries: [
            {
                name:"China",
                name_vn:"China",
                code:"cn",
                case: 7711,
                death: 170,
                suspect: 12167,
                isolate: null,
                curve: null
            },{
                name:"Thailand",
                name_vn:"Thailand",
                code:"Thailand",
                case: 14,
                death: 0
            },{
                name:"Japan",
                name_vn:"Japan",
                code:"jp",
                case: 11,
                death: 0
            },{
                name:"Taiwan",
                name_vn:"Taiwan",
                code:"tw",
                case: 8,
                death: 0
            },{
                name:"Korea",
                name_vn:"Korea",
                code:"kr",
                case: 4,
                death: 0
            },{
                name:"Hong Kong",
                name_vn:"Hong Kong",
                code:"hk",
                case: 10,
                death: 0
            },{
                name:"Macau",
                name_vn:"Macau",
                code:"Macau",
                case: 7,
                death: 0
            },{
                name:"United States",
                name_vn:"United States",
                code:"us",
                case: 5,
                death: 0
            },{
                name:"Singapore",
                name_vn:"Singapore",
                code:"Singapore",
                case: 10,
                death: 0
            },{
                name:"Vietnam",
                name_vn:"Vietnam",
                code:"vn",
                case: 2,
                death: 0
            },{
                name:"Australia",
                name_vn:"Australia",
                code:"Australia",
                case: 7,
                death: 0
            },{
                name:"Nepal",
                name_vn:"Nepal",
                code:"Nepal",
                case: 1,
                death: 0
            },{
                name:"French",
                name_vn:"French",
                code:"fr",
                case: 5,
                death: 0
            },{
                name:"Malaysia",
                name_vn:"Malaysia",
                code:"Malaysia",
                case: 7,
                death: 0
            },{
                name:"Canada",
                name_vn:"Canada",
                code:"Canada",
                case: 3,
                death: 0
            },{
                name:"Cambodia",
                name_vn:"Cambodia",
                code:"Cambodia",
                case: 1,
                death: 0
            },{
                name:"Sri Lanka",
                name_vn:"Sri Lanka",
                code:"Sri Lanka",
                case: 1,
                death: 0
            },{
                name:"Germany",
                name_vn:"Germany",
                code:"Germany",
                case: 4,
                death: 0
            },{
                name:"UAE",
                name_vn:"UAE",
                code:"UAE",
                case: 4,
                death: 0
            },{
                name:"Philippines",
                name_vn:"Philippines",
                code:"Philippines",
                case: 1,
                death: 0
            },{
                name:"India",
                name_vn:"India",
                code:"India",
                case: 1,
                death: 0
            },{
                name:"Finland",
                name_vn:"Finland",
                code:"Finland",
                case: 1,
                death: 0
            }]
        },{
            date:"2020-01-29",
            world: {
                case: 6065,
                death: 132,
            },
            countries: [
            {
                name:"China",
                name_vn:"China",
                code:"cn",
                case: 5974,
                death: 132,
                suspect: 9239,
                isolate: null,
                curve: null
            },{
                name:"Thailand",
                name_vn:"Thailand",
                code:"Thailand",
                case: 14,
                death: 0
            },{
                name:"Japan",
                name_vn:"Japan",
                code:"jp",
                case: 7,
                death: 0
            },{
                name:"Taiwan",
                name_vn:"Taiwan",
                code:"tw",
                case: 8,
                death: 0
            },{
                name:"Korea",
                name_vn:"Korea",
                code:"kr",
                case: 4,
                death: 0
            },{
                name:"Hong Kong",
                name_vn:"Hong Kong",
                code:"hk",
                case: 8,
                death: 0
            },{
                name:"Macau",
                name_vn:"Macau",
                code:"Macau",
                case: 7,
                death: 0
            },{
                name:"United States",
                name_vn:"United States",
                code:"us",
                case: 5,
                death: 0
            },{
                name:"Singapore",
                name_vn:"Singapore",
                code:"Singapore",
                case: 7,
                death: 0
            },{
                name:"Vietnam",
                name_vn:"Vietnam",
                code:"vn",
                case: 2,
                death: 0
            },{
                name:"Australia",
                name_vn:"Australia",
                code:"Australia",
                case: 7,
                death: 0
            },{
                name:"Nepal",
                name_vn:"Nepal",
                code:"Nepal",
                case: 1,
                death: 0
            },{
                name:"French",
                name_vn:"French",
                code:"fr",
                case: 4,
                death: 0
            },{
                name:"Malaysia",
                name_vn:"Malaysia",
                code:"Malaysia",
                case: 4,
                death: 0
            },{
                name:"Canada",
                name_vn:"Canada",
                code:"Canada",
                case: 3,
                death: 0
            },{
                name:"Cambodia",
                name_vn:"Cambodia",
                code:"Cambodia",
                case: 1,
                death: 0
            },{
                name:"Sri Lanka",
                name_vn:"Sri Lanka",
                code:"Sri Lanka",
                case: 1,
                death: 0
            },{
                name:"Germany",
                name_vn:"Germany",
                code:"Germany",
                case: 4,
                death: 0
            },{
                name:"UAE",
                name_vn:"UAE",
                code:"UAE",
                case: 4,
                death: 0
            }]
        },{
            date:"2020-01-28",
            world: {
                case: 4593,
                death: 106,
            },
            countries: [
            {
                name:"China",
                name_vn:"China",
                code:"cn",
                case: 4515,
                death: 106,
                suspect: 6973,
                isolate: null,
                curve: null
            },{
                name:"Thailand",
                name_vn:"Thailand",
                code:"Thailand",
                case: 14,
                death: 0
            },{
                name:"Japan",
                name_vn:"Japan",
                code:"jp",
                case: 6,
                death: 0
            },{
                name:"Taiwan",
                name_vn:"Taiwan",
                code:"tw",
                case: 7,
                death: 0
            },{
                name:"Korea",
                name_vn:"Korea",
                code:"kr",
                case: 4,
                death: 0
            },{
                name:"Hong Kong",
                name_vn:"Hong Kong",
                code:"hk",
                case: 8,
                death: 0
            },{
                name:"Macau",
                name_vn:"Macau",
                code:"Macau",
                case: 7,
                death: 0
            },{
                name:"United States",
                name_vn:"United States",
                code:"us",
                case: 5,
                death: 0
            },{
                name:"Singapore",
                name_vn:"Singapore",
                code:"Singapore",
                case: 7,
                death: 0
            },{
                name:"Vietnam",
                name_vn:"Vietnam",
                code:"vn",
                case: 2,
                death: 0
            },{
                name:"Australia",
                name_vn:"Australia",
                code:"Australia",
                case: 5,
                death: 0
            },{
                name:"Nepal",
                name_vn:"Nepal",
                code:"Nepal",
                case: 1,
                death: 0
            },{
                name:"French",
                name_vn:"French",
                code:"fr",
                case: 3,
                death: 0
            },{
                name:"Malaysia",
                name_vn:"Malaysia",
                code:"Malaysia",
                case: 4,
                death: 0
            },{
                name:"Canada",
                name_vn:"Canada",
                code:"Canada",
                case: 2,
                death: 0
            },{
                name:"Cambodia",
                name_vn:"Cambodia",
                code:"Cambodia",
                case: 1,
                death: 0
            },{
                name:"Sri Lanka",
                name_vn:"Sri Lanka",
                code:"Sri Lanka",
                case: 1,
                death: 0
            },{
                name:"Germany",
                name_vn:"Germany",
                code:"Germany",
                case: 1,
                death: 0
            }]
        },{
            date:"2020-01-27",
            world: {
                case: 2798,
                death: 80,
            },
            countries: [
            {
                name:"China",
                name_vn:"China",
                code:"cn",
                case: 2744,
                death: 80,
                suspect: 5794,
                isolate: null,
                curve: null
            },{
                name:"Thailand",
                name_vn:"Thailand",
                code:"Thailand",
                case: 5,
                death: 0
            },{
                name:"Japan",
                name_vn:"Japan",
                code:"jp",
                case: 4,
                death: 0
            },{
                name:"Taiwan",
                name_vn:"Taiwan",
                code:"tw",
                case: 4,
                death: 0
            },{
                name:"Korea",
                name_vn:"Korea",
                code:"kr",
                case: 4,
                death: 0
            },{
                name:"Hong Kong",
                name_vn:"Hong Kong",
                code:"hk",
                case: 8,
                death: 0
            },{
                name:"Macau",
                name_vn:"Macau",
                code:"Macau",
                case: 5,
                death: 0
            },{
                name:"United States",
                name_vn:"United States",
                code:"us",
                case: 5,
                death: 0
            },{
                name:"Singapore",
                name_vn:"Singapore",
                code:"Singapore",
                case: 4,
                death: 0
            },{
                name:"Vietnam",
                name_vn:"Vietnam",
                code:"vn",
                case: 2,
                death: 0
            },{
                name:"Australia",
                name_vn:"Australia",
                code:"Australia",
                case: 4,
                death: 0
            },{
                name:"Nepal",
                name_vn:"Nepal",
                code:"Nepal",
                case: 1,
                death: 0
            },{
                name:"French",
                name_vn:"French",
                code:"fr",
                case: 3,
                death: 0
            },{
                name:"Malaysia",
                name_vn:"Malaysia",
                code:"Malaysia",
                case: 4,
                death: 0
            },{
                name:"Canada",
                name_vn:"Canada",
                code:"Canada",
                case: 1,
                death: 0
            }]
        },{
            date:"2020-01-26",
            world: {
                case: 2014,
                death: 56,
            },
            countries: [
            {
                name:"China",
                name_vn:"China",
                code:"cn",
                case: 1975,
                death: 56,
                suspect: null,
                isolate: null,
                curve: null
            },{
                name:"Thailand",
                name_vn:"Thailand",
                code:"Thailand",
                case: 5,
                death: 0
            },{
                name:"Japan",
                name_vn:"Japan",
                code:"jp",
                case: 3,
                death: 0
            },{
                name:"Taiwan",
                name_vn:"Taiwan",
                code:"tw",
                case: 3,
                death: 0
            },{
                name:"Korea",
                name_vn:"Korea",
                code:"kr",
                case: 2,
                death: 0
            },{
                name:"Hong Kong",
                name_vn:"Hong Kong",
                code:"hk",
                case: 5,
                death: 0
            },{
                name:"Macau",
                name_vn:"Macau",
                code:"Macau",
                case: 2,
                death: 0
            },{
                name:"United States",
                name_vn:"United States",
                code:"us",
                case: 2,
                death: 0
            },{
                name:"Singapore",
                name_vn:"Singapore",
                code:"Singapore",
                case: 4,
                death: 0
            },{
                name:"Vietnam",
                name_vn:"Vietnam",
                code:"vn",
                case: 2,
                death: 0
            },{
                name:"Australia",
                name_vn:"Australia",
                code:"Australia",
                case: 4,
                death: 0
            },{
                name:"Nepal",
                name_vn:"Nepal",
                code:"Nepal",
                case: 1,
                death: 0
            },{
                name:"French",
                name_vn:"French",
                code:"fr",
                case: 3,
                death: 0
            },{
                name:"Malaysia",
                name_vn:"Malaysia",
                code:"Malaysia",
                case: 3,
                death: 0
            }]
        },{
            date:"2020-01-25",
            world: {
                case: 1320,
                death: 41,
            },
            countries: [
            {
                name:"China",
                name_vn:"China",
                code:"cn",
                case: 1287,
                death: 41,
                suspect: null,
                isolate: null,
                curve: null
            },{
                name:"Thailand",
                name_vn:"Thailand",
                code:"Thailand",
                case: 4,
                death: 0
            },{
                name:"Japan",
                name_vn:"Japan",
                code:"jp",
                case: 3,
                death: 0
            },{
                name:"Taiwan",
                name_vn:"Taiwan",
                code:"tw",
                case: 3,
                death: 0
            },{
                name:"Korea",
                name_vn:"Korea",
                code:"kr",
                case: 2,
                death: 0
            },{
                name:"Hong Kong",
                name_vn:"Hong Kong",
                code:"hk",
                case: 5,
                death: 0
            },{
                name:"Macau",
                name_vn:"Macau",
                code:"Macau",
                case: 2,
                death: 0
            },{
                name:"United States",
                name_vn:"United States",
                code:"us",
                case: 2,
                death: 0
            },{
                name:"Singapore",
                name_vn:"Singapore",
                code:"Singapore",
                case: 3,
                death: 0
            },{
                name:"Vietnam",
                name_vn:"Vietnam",
                code:"vn",
                case: 2,
                death: 0
            },{
                name:"Australia",
                name_vn:"Australia",
                code:"Australia",
                case: 3,
                death: 0
            },{
                name:"Nepal",
                name_vn:"Nepal",
                code:"Nepal",
                case: 1,
                death: 0
            },{
                name:"French",
                name_vn:"French",
                code:"fr",
                case: 3,
                death: 0
            }]
        },{
            date:"2020-01-24",
            world: {
                case: 846,
                death: 25,
            },
            countries: [
            {
                name:"China",
                name_vn:"China",
                code:"cn",
                case: 830,
                death: 25,
                suspect: null,
                isolate: null,
                curve: null
            },{
                name:"Thailand",
                name_vn:"Thailand",
                code:"Thailand",
                case: 4,
                death: 0
            },{
                name:"Japan",
                name_vn:"Japan",
                code:"jp",
                case: 1,
                death: 0
            },{
                name:"Taiwan",
                name_vn:"Taiwan",
                code:"tw",
                case: 1,
                death: 0
            },{
                name:"Korea",
                name_vn:"Korea",
                code:"kr",
                case: 2,
                death: 0
            },{
                name:"Hong Kong",
                name_vn:"Hong Kong",
                code:"hk",
                case: 2,
                death: 0
            },{
                name:"Macau",
                name_vn:"Macau",
                code:"Macau",
                case: 2,
                death: 0
            },{
                name:"United States",
                name_vn:"United States",
                code:"us",
                case: 1,
                death: 0
            },{
                name:"Singapore",
                name_vn:"Singapore",
                code:"Singapore",
                case: 1,
                death: 0
            },{
                name:"Vietnam",
                name_vn:"Vietnam",
                code:"vn",
                case: 2,
                death: 0
            }]
        },{
            date:"2020-01-23",
            world: {
                case: 581,
                death: 17,
            },
            countries: [
            {
                name:"China",
                name_vn:"China",
                code:"cn",
                case: 571,
                death: 17,
                suspect: null,
                isolate: null,
                curve: null
            },{
                name:"Thailand",
                name_vn:"Thailand",
                code:"Thailand",
                case: 4,
                death: 0
            },{
                name:"Japan",
                name_vn:"Japan",
                code:"jp",
                case: 1,
                death: 0
            },{
                name:"Taiwan",
                name_vn:"Taiwan",
                code:"tw",
                case: 1,
                death: 0
            },{
                name:"Korea",
                name_vn:"Korea",
                code:"kr",
                case: 1,
                death: 0
            },{
                name:"Hong Kong",
                name_vn:"Hong Kong",
                code:"hk",
                case: 1,
                death: 0
            },{
                name:"Macau",
                name_vn:"Macau",
                code:"Macau",
                case: 1,
                death: 0
            },{
                name:"United States",
                name_vn:"United States",
                code:"us",
                case: 1,
                death: 0
            }]
        },{
            date:"2020-01-22",
            world: {
                case: 314,
                death: 6,
            },
            countries: [
            {
                name:"China",
                name_vn:"China",
                code:"cn",
                case: 309,
                death: 6,
                suspect: null,
                isolate: null,
                curve: null
            },{
                name:"Thailand",
                name_vn:"Thailand",
                code:"Thailand",
                case: 2,
                death: 0
            },{
                name:"Japan",
                name_vn:"Japan",
                code:"jp",
                case: 1,
                death: 0
            },{
                name:"Taiwan",
                name_vn:"Taiwan",
                code:"tw",
                case: 1,
                death: 0
            },{
                name:"Korea",
                name_vn:"Korea",
                code:"kr",
                case: 1,
                death: 0
            }]
        },{
            date:"2020-01-21",
            world: {
                case: 282,
                death: 6,
            },
            countries: [
            {
                name:"China",
                name_vn:"China",
                code:"cn",
                case: 278,
                death: 6,
                suspect: null,
                isolate: null,
                curve: null
            },{
                name:"Thailand",
                name_vn:"Thailand",
                code:"Thailand",
                case: 2,
                death: 0
            },{
                name:"Japan",
                name_vn:"Japan",
                code:"jp",
                case: 1,
                death: 0
            },{
                name:"Korea",
                name_vn:"Korea",
                code:"Korea",
                case: 1,
                death: 0
            }]
        }
    ]
}




export default {
    NCOV_DATA: NCOV_DATA,

    DEFAULT_VERSION: "0.2.4",
    IS_DEBUG_MODE: true,
    // TODO Enable these values
    SETTING_KM_SHOWWARN: 100,
    SETTING_DAY_SHOW_WARN: 30,

    SETTING_MAX_CAR_INDIVIDUAL: 30,

    DEFAULT_BOTTOM_NAV_HEIGHT: 50,
    DEFAULT_FORM_WIDTH: Layout.window.width*1.0 - 10,
    DEFAULT_FORM_PADDING_HORIZON: 5,// Layout.window.width*0.05,
    DEFAULT_FORM_BUTTON_WIDTH: 130,

    ADS_BANNERID: BANNER_ID,
    ADS_INTERESTIALID: INTERESTIAL_ID,
    ADS_COUNT_CLICK_SHOW_INTERESTIAL: 12, // after every x click, show Interestial
    ADS_COUNT_CLICK_INTERACTIVE: 0,

    // Tempo data which
    BUFFER_NEED_RECALCULATE_VEHICLE_ID: [],
    TEMPDATA_SERVICE_MAINTAIN_MODULES: {},
    TEMPDATA_CREATESERVICEMODULE_ISBIKE: false,
    TEMPDATA_MODALDIALOG_STATE: 0,

    CURRENT_VEHICLE_ID: "0",
    CURRENT_EDIT_FILL_ID: "0",
    STORAGE_VEHICLE_LIST: "STORAGE_VEHICLE_LIST",
    STORAGE_FILL_GAS_LIST: "STORAGE_FILL_GAS_LIST",
    STORAGE_FILL_OIL_LIST: "STORAGE_FILL_OIL_LIST",
    STORAGE_AUTHORIZE_CAR_LIST: "STORAGE_AUTHORIZE_CAR_LIST",

    FILL_ITEM_GAS: "gas",
    FILL_ITEM_OIL: "oil",
    FILL_ITEM_AUTH: "auth",
    FILL_ITEM_EXPENSE: "expense",
    FILL_ITEM_SERVICE: "service",

    

    DEFAULT_REPORT_RANGE: 6, // 6 tháng
    DEFAULT_IOS_STATUSBAR_HEIGHT: STATUSBAR_HEIGHT, // in IOS, should set this to 20
    TEMPO_USE_BARCHART_GAS: true,
    LEGEND_CHITIEU: [
        {name:"Xăng"},{name:"Pháp Lý"},{name:"Phụ Chi"},{name:"Bảo Dưỡng"}
    ],
    LEGEND_CHITIEU_2: [
        {name:"Xăng"},{name:"Phụ Chi"},{name:"Pháp Lý"},{name:"Bảo Dưỡng"}
    ],

    SERVER_API:"https://yamastack.com/api/",

    //SERVER_API:"http://18.140.121.240:3000/api",
    //SERVER_API:  "http://192.168.1.51:3000/api",
    //SERVER_API:  "http://192.168.0.108:3000/api",
    //SERVER_API:  "http://localhost:3000/api", // why localhost here (not OK when on LAN setting of Expo)
    //SERVER_API:  "http://172.20.10.2:3000/api",
    COLOR_SCALE_10: ["#1890FF","#ff7f0e","#98df8a","#9467bd","#17becf","#ffbb78","#aec7e8","#e377c2","#c49c94","#dbdb8d"],
    COLOR_PICKER_TEXT: "#1565c0",//"#1f77b4",

    COLOR_GREY_DARK: "rgb(80, 80, 80)",
    COLOR_GREY_MIDDLE: "rgb(150, 150, 150)",
    COLOR_GREY_BG: "rgb(200, 200, 200)",
    COLOR_GREY_MIDDLE_LIGHT_BG: "rgb(220, 220, 220)",
    COLOR_GREY_LIGHT_BG: "rgb(240, 240, 240)",

    COLOR_HEADER_BG: "#1565c0", // MainThemeColor
    COLOR_HEADER_BG_LIGHT: "#4093db",//"#5e92f3", 
    COLOR_HEADER_BG_LIGHT_SUPER: "#b5e6ff",
    COLOR_HEADER_BG_DARKER: "#003c8f",
    COLOR_HEADER_BUTTON: "white",

    COLOR_BUTTON_BG: "#1565c0", // Main Theme color 3488d1
    COLOR_FACEBOOK: "#3b5998", // FB color
    COLOR_GOOGLE: "#DB4437",
    COLOR_TOMATO:"#ff7f0e",
    COLOR_D3_LIGHT_BLUE: "#1f77b4",
    COLOR_D3_DARK_GREEN: "#2ca02c",
    COLOR_D3_MIDDLE_GREEN: "#43d175", // TODO
    COLOR_D3_LIGHT_GREEN: "#98df8a",
    COLOR_TEXT_LIGHT_INFO: "rgb(150,150,150)",
    COLOR_TEXT_DARKDER_INFO: "rgb(110,110,110)",
    COLOR_TEXT_DARKEST_INFO: "rgb(90,90,90)",
    COLOR_TEXT_INACTIVE_TAB: "#a6b8de",

    COLOR_FILL_FUEL: "#2c8ef4", // blue
    COLOR_FILL_AUTH: "#3cc97b", // green
    COLOR_FILL_EXPENSE: "#FF9501", // orange
    COLOR_FILL_SERVICE: "#df43fa", // purple
    COLOR_FILL_CAR: "#2c8ef4"
};

//https://codepen.io/whitelynx/pen/pbberp
// Color from d3.scale.category20()
// 0   #1f77b4
// 1   #aec7e8
// 2   #ff7f0e
// 3   #ffbb78
// 4   #2ca02c
// 5   #98df8a
// 6   #d62728
// 7   #ff9896
// 8   #9467bd
// 9   #c5b0d5
// 10  #8c564b
// 11  #c49c94
// 12  #e377c2
// 13  #f7b6d2
// 14  #7f7f7f
// 15  #c7c7c7
// 16  #bcbd22
// 17  #dbdb8d
// 18  #17becf
// 19  #9edae5