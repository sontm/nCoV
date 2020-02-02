import { REHYDRATE } from 'redux-persist';
import backend from '../constants/Backend';
import apputils from '../constants/AppUtils';
import AppConstants from '../constants/AppConstants';
import AppLocales from '../constants/i18n';
import NetInfo from "@react-native-community/netinfo";
import {Toast} from 'native-base';


const APPDATA_OPEN_COUNT = 'APPDATA_OPEN_COUNT';
const APPDATA_SYNC_LATEST = 'APPDATA_SYNC_LATEST';


const NCOV_DATA = {
    vietnam_province: [
        {
            date:"2020-02-01T08:00:00.007Z",
            provinces:[
                {
                    name:"Hà Nội",
                    case: 2,
                    death: 0
                },{
                    name:"TP.HCM",
                    case: 2,
                    death: 0
                },{
                    name:"Thanh Hoá",
                    case: 1,
                    death: 0
                },{
                    name:"Khánh Hoà",
                    case: 1,
                    death: 0
                }
            ]
        }
    ],
    china_province: [
        {
            date:"2020-01-31T08:00:00.007Z",
            provinces:[
                {
                    name:"Hubei",
                    case: 7153
                },{
                    name:"Zhejiang",
                    case: 599
                },{
                    name:"Guangdong",
                    case: 520
                },{
                    name:"Henan",
                    case: 422
                },{
                    name:"Hunan",
                    case: 389
                },{
                    name:"Anhui",
                    case: 297
                },{
                    name:"Jiangxi",
                    case: 286
                },{
                    name:"Chongqing",
                    case: 238
                },{
                    name:"Sichuan",
                    case: 207
                },{
                    name:"Shandong",
                    case: 202
                },{
                    name:"Jiangsu",
                    case: 202
                },{
                    name:"Shanghai",
                    case: 169
                },{
                    name:"Beijing",
                    case: 156
                },{
                    name:"Fujian",
                    case: 144
                },{
                    name:"Shaanxi",
                    case: 101
                },{
                    name:"Guangxi",
                    case: 100
                },{
                    name:"Hebei",
                    case: 96
                },{
                    name:"Yunnan",
                    case: 91
                },{
                    name:"Heilongjiang",
                    case: 80
                },{
                    name:"Liaoning",
                    case: 60
                },{
                    name:"Hainan",
                    case: 60
                },{
                    name:"Shanxi",
                    case: 47
                },{
                    name:"Tianjin",
                    case: 37
                },{
                    name:"Gansu",
                    case: 35
                },{
                    name:"Guizhou",
                    case: 29
                },{
                    name:"Ningxia",
                    case: 26
                },{
                    name:"Inner Mongolia",
                    case: 23
                },{
                    name:"Xinjia",
                    case: 18
                },{
                    name:"Jilin",
                    case: 17
                },{
                    name:"Qinghai",
                    case: 9
                },{
                    name:"Xizang",
                    case: 1
                }
            ]
        }
    ],
    data: [
        {
            date:"2020-02-01T08:00:00.007Z",
            world: {
                case: 11948,
                death: 259,
            },
            tranmission_rate_min: 3.0,
            tranmission_rate_max: 4.0,
            fatality_rate: 2,
            incubation_period_min: 2,
            incubation_period_max: 14,
            countries: [
            {
                name:"China",
                name_vn:"China",
                code:"cn",
                case: 11791,
                death: 259,
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
                name:"Japan",
                name_vn:"Japan",
                code:"jp",
                case: 17,
                death: 2,
            },{
                name:"Singapore",
                name_vn:"Singapore",
                code:"sg",
                case: 16,
                death: 2,
            },{
                name:"Hong Kong",
                name_vn:"Hong Kong",
                code:"hk",
                case: 13,
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
                case: 10,
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
                name:"United States",
                name_vn:"United States",
                code:"us",
                case: 7,
                death: 0,
            },{
                name:"Germany",
                name_vn:"Germany",
                code:"ger",
                case: 7,
                death: 0,
            },{
                name:"Macao",
                name_vn:"Macao",
                code:"Macao",
                case: 7,
                death: 0
            },{
                name:"France",
                name_vn:"France",
                code:"fr",
                case: 6,
                death: 0,

            },{
                name:"Vietnam",
                name_vn:"Vietnam",
                code:"vn",
                case: 6,
                death: 0,
                suspect: 28,
                isolate: 93,
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
                case: 4,
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
                name:"Italy",
                name_vn:"Italy",
                code:"Italy",
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
            },{
                name:"Spain",
                name_vn:"Spain",
                code:"Spain",
                case: 1,
                death: 0,
            },{
                name:"Sweden",
                name_vn:"Sweden",
                code:"Sweden",
                case: 1,
                death: 0,
            }
            ]
        },{
            date:"2020-01-31",
            world: {
                case: 9826,
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
                case: 9692,
                death: 213,
                suspect: 15238,
                isolate: null,
                curve: null
            },{
                name:"Thailand",
                name_vn:"Thailand",
                code:"thai",
                case: 14,
                death: 3,
            },{
                name:"Singapore",
                name_vn:"Singapore",
                code:"sg",
                case: 13,
                death: 2,
            },{
                name:"Japan",
                name_vn:"Japan",
                code:"jp",
                case: 14,
                death: 2,

            },{
                name:"South Korea",
                name_vn:"South Korea",
                code:"kr",
                case: 11,
                death: 5,

            },{
                name:"Hong Kong",
                name_vn:"Hong Kong",
                code:"hk",
                case: 12,
                death: 3,

            },{
                name:"Taiwan",
                name_vn:"Taiwan",
                code:"tw",
                case: 9,
                death: 6,

            },{
                name:"Macao",
                name_vn:"Macao",
                code:"Macao",
                case: 7,
                death: 0,

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


const initialState = {
    ncov: NCOV_DATA,
    appDataLatestOn: null,
    countOpen: 0
};

export const actAppIncreaseOpenCount = () => (dispatch) => {
    apputils.CONSOLE_LOG("actAppIncreaseOpenCount:")
    dispatch({
        type: APPDATA_OPEN_COUNT
    })
}

export const actAppSyncLatestDataIfNeeded = (prevAppData, showToast) => (dispatch) => {
    apputils.CONSOLE_LOG("actAppSyncLatestDataIfNeeded:")
    NetInfo.fetch().then(state => {
        if (state.isConnected) {
            backend.getLatestAppDataOn(
                response => {
                    apputils.CONSOLE_LOG(response.data.updatedOn + " vs " + prevAppData.appDataLatestOn)
                    if ((response.data.updatedOn &&  new Date(prevAppData.appDataLatestOn).getTime() < new Date(response.data.updatedOn).getTime())) {
                        apputils.CONSOLE_LOG("   Will Update App Data ")
                        // Need Update latest AppData here
                        backend.getLatestAppData(
                        response2 => {
                            //apputils.CONSOLE_LOG(response2.data)
                            dispatch({
                                type: APPDATA_SYNC_LATEST,
                                payload: {data: response2.data.nCoV, updatedOn: response.data.updatedOn}
                            })
                            if (showToast) {
                                Toast.show({
                                    text: AppLocales.t("NHOME_TOAST_GOT_OK"),
                                    //buttonText: "Okay",
                                    position: "bottom",
                                    type: "success"
                                })
                            }
                        },
                        err2 => {
                            apputils.CONSOLE_LOG("  ERROR GET APPDATA ")
                        })
                    } else {
                        if (showToast) {
                            Toast.show({
                                text: AppLocales.t("NHOME_TOAST_ALREADY_LATEST"),
                                //buttonText: "Okay",
                                position: "bottom"
                            })
                        }
                    }
                    
                },
                err => {
                })
        } else {
          Toast.show({
            text: AppLocales.t("NHOME_TOAST_NEED_INTERNET_CON"),
            //buttonText: "Okay",
            position: "bottom",
            type: "danger"
          })
        }
    });
}

// Note, in this Reducer, cannot Access state.user
export default function(state = initialState, action) {
    switch (action.type) {
    // case REHYDRATE:
    //     apputils.CONSOLE_LOG("HVE JUST LOAD STATE--------------")
    //     let newAA = {...state}; // THis code will Lose all
    //     // if (!state.vehicleList) state.vehicleList= [];
    //     return newAA;
    case APPDATA_OPEN_COUNT:
        return {
            ...state,
            countOpen: state.countOpen+1
        };
    case APPDATA_SYNC_LATEST:
        return {
            ...state,
            appDataLatestOn: action.payload.updatedOn,
            ncov: action.payload.data
        };
    default:
        return state;
    }
}
