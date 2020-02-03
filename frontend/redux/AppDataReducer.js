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
        date:"2020-02-03T15:00:00.007Z",
        provinces:[
            {
                name:"TP.HCM",
                case: 3,
                death: 0
            },{
                name:"Vĩnh Phúc",
                case: 3,
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
    },
    {
        date:"2020-02-02T15:00:00.007Z",
        provinces:[
            {
                name:"TP.HCM",
                case: 3,
                death: 0
            },{
                name:"Vĩnh Phúc",
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
    },
    {
        date:"2020-02-01T15:00:00.007Z",
        provinces:[
            {
                name:"Vĩnh Phúc",
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
        date:"2020-02-02T15:00:00.007Z",
        provinces:[
            {
                name:"Hubei",
                case: 9074
            },{
                name:"Zhejiang",
                case: 661
            },{
                name:"Guangdong",
                case: 604
            },{
                name:"Henan",
                case: 493
            },{
                name:"Hunan",
                case: 463
            },{
                name:"Anhui",
                case: 340
            },{
                name:"Jiangxi",
                case: 333
            },{
                name:"Chongqing",
                case: 262
            },{
                name:"Sichuan",
                case: 236
            },{
                name:"Jiangsu",
                case: 231
            },{
                name:"Shandong",
                case: 225
            },{
                name:"Beijing",
                case: 183
            },{
                name:"Shanghai",
                case: 177
            },{
                name:"Fujian",
                case: 159
            },{
                name:"Shaanxi",
                case: 116
            },{
                name:"Guangxi",
                case: 111
            },{
                name:"Hebei",
                case: 104
            },{
                name:"Yunnan",
                case: 99
            },{
                name:"Heilongjiang",
                case: 95
            },{
                name:"Liaoning",
                case: 64
            },{
                name:"Hainan",
                case: 63
            },{
                name:"Shanxi",
                case: 56
            },{
                name:"Gansu",
                case: 45
            },{
                name:"Tianjin",
                case: 40
            },{
                name:"Guizhou",
                case: 38
            },{
                name:"Ningxia",
                case: 28
            },{
                name:"Inner Mongolia",
                case: 26
            },{
                name:"Xinjia",
                case: 23
            },{
                name:"Jilin",
                case: 21
            },{
                name:"Qinghai",
                case: 9
            },{
                name:"Xizang",
                case: 1
            }
        ]
    },
    {
        date:"2020-02-01T15:00:00.007Z",
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
        date:"2020-02-03T15:00:00.007Z",
        world: {
            case: 17488,
            death: 362,
            curve: 523,
            risk:"Very High"
        },
        tranmission_rate_min: 3.0,
        tranmission_rate_max: 4.0,
        fatality_rate: 2,
        incubation_period_min: 2,
        incubation_period_max: 14,
        countries: [
        {
            name:"Mainland China",
            case: 17302,
            death: 361,
            suspect: null,
            isolate: null,
            severe: 2296,
            curve: 512,
            risk:"Very High"
        },{
            name:"Japan",
            case: 20,
            death: 0,
        },{
            name:"Thailand",
            case: 19,
            death: 0,
            curve: 7
        },{
            name:"Singapore",
            case: 18,
            death: 0,
        },{
            name:"South Korea",
            case: 15,
            death: 0,
        },{
            name:"Hong Kong",
            case: 15,
            death: 0,
        },{
            name:"Australia",
            case: 12,
            death: 0,
            curve: 2
        },{
            name:"United States",
            case: 11,
            death: 0,
            note:"+ 1 Case in Snohomish, Washington. Male, Age 30s from Jan.21.\n\n"
                +"+ 2 Cases in Chicago, Illinois. 1 Female at Age 60s from Jan.24; 1 Male husband from Jan.30\n\n"
                +"+ 3 Cases in California. 2 from Jan.26 in Orange C., L.A.; 1 Male adult from Jan.31 in Santa Clara C.\n\n"
                +"+ 1 Case in Maricopa County, Arizona. 1 Student from Jan.26.\n\n"
                +"+ 1 Case in Boston, Massachusetts. 1 Male at Age 20s From Feb.1.\n\n"
                +"+ 1 Case in Santa Clara C., California. 1 Female From Feb.2.\n\n"
                +"+ 2 Case in San Benito C., California. 1 Male and 1 Female at age 50s From Feb.2.\n\n"
        },{
            name:"Taiwan",
            case: 10,
            death: 0,
        },{
            name:"Germany",
            case: 10,
            death: 0,
        },{
            name:"Malaysia",
            case: 8,
            death: 0,
        },{
            name:"Macao",
            case: 8,
            death: 0
        },{
            name:"Vietnam",
            case: 8,
            death: 0,
            suspect: 304,
            isolate: 270,
            curve: 2,
            note:"+ 2 bệnh nhân người Trung Quốc.\n\n"
                +"+ 3 người Việt Nam, trong đó 2 trường hợp đang được cách ly điều trị tại BC Nhiệt đới cơ sở 2, 1 trường hợp tại BVDK tỉnh Thanh Hoá. Cả 3 đều trở về từ Vũ Hán.\n\n"
                +"+ 1 người Việt Nam là lễ tân tại khách sạn Khánh Hoà, tiếp xúc với 2 người Trung Quốc đang điều trị tại Việt Nam.\n\n"
                +"+ 1 bệnh nhân có quốc tịch Mỹ, bay về Việt Nam ngày 14/1, quá cảnh tại sân bay Vũ Hán.\n\n"
                +"+ Sáng 3/2, Bộ Y tế xác nhận nữ bệnh nhân 29 tuổi, là công nhân trở về từ Vũ Hán, dương tính với nCoV."
        },{
            name:"France",
            case: 6,
            death: 0
        },{
            name:"UAE",
            case: 5,
            death: 0,
        },{
            name:"Canada",
            case: 4,
            death: 0,
        },{
            name:"India",
            case: 3,
            death: 0,
        },{
            name:"United Kingdom",
            case: 2,
            death: 0,
        },{
            name:"Russia",
            case: 2,
            death: 0,
        },{
            name:"Italy",
            case: 2,
            death: 0,
        },{
            name:"Philippines",
            case: 2,
            death: 1,
        },{
            name:"Cambodia",
            case: 1,
            death: 0,
        },{
            name:"Finland",
            case: 1,
            death: 0,
        },{
            name:"Sri Lanka",
            case: 1,
            death: 0,
            curve: 1
        },{
            name:"Nepal",
            case: 1,
            death: 0,
        },{
            name:"Spain",
            case: 1,
            death: 0,
        },{
            name:"Sweden",
            case: 1,
            death: 0,
        }
        ]
    },
    {
        date:"2020-02-02T15:00:00.007Z",
        world: {
            case: 14557,
            death: 305,
            risk:"High"
        },
        tranmission_rate_min: 3.0,
        tranmission_rate_max: 4.0,
        fatality_rate: 2,
        incubation_period_min: 2,
        incubation_period_max: 14,
        countries: [
        {
            name:"Mainland China",
            case: 14380,
            death: 304,
            suspect: null,
            isolate: null,
            curve: null,
            risk:"Very High"
        },{
            name:"Japan",
            case: 20,
            death: 0,
        },{
            name:"Thailand",
            case: 19,
            death: 0,
        },{
            name:"Singapore",
            case: 18,
            death: 0,
        },{
            name:"South Korea",
            case: 15,
            death: 0,
        },{
            name:"Hong Kong",
            case: 14,
            death: 0,
        },{
            name:"Australia",
            case: 12,
            death: 0,
        },{
            name:"Taiwan",
            case: 10,
            death: 0,
        },{
            name:"Malaysia",
            case: 8,
            death: 0,
        },{
            name:"United States",
            case: 8,
            death: 0,
            note:"+ 1 Case in Snohomish, Washington. Male, Age 30s from Jan.21.\n\n"
                +"+ 2 Cases in Chicago, Illinois. 1 Female at Age 60s from Jan.24; 1 Male husband from Jan.30\n\n"
                +"+ 3 Cases in California. 2 from Jan.26 in Orange C., L.A.; 1 Male adult from Jan.31 in Santa Clara C.\n\n"
                +"+ 1 Case in Maricopa County, Arizona. 1 Student from Jan.26.\n\n"
                +"+ 1 Case in Boston, Massachusetts. 1 Male at Age 20s From Feb.1."
        },{
            name:"Germany",
            case: 8,
            death: 0,
        },{
            name:"Macao",
            case: 7,
            death: 0
        },{
            name:"Vietnam",
            case: 7,
            death: 0,
            suspect: 92,
            isolate: 27,
            note:"+ 2 bệnh nhân người Trung Quốc.\n\n+ 3 người Việt Nam, trong đó 2 trường hợp đang được cách ly điều trị tại BC Nhiệt đới cơ sở 2, 1 trường hợp tại BVDK tỉnh Thanh Hoá. Cả 3 đều trở về từ Vũ Hán.\n\n+ 1 người Việt Nam là lễ tân tại khách sạn Khánh Hoà, tiếp xúc với 2 người Trung Quốc đang điều trị tại Việt Nam.\n\n+ 1 bệnh nhân có quốc tịch Mỹ, bay về Việt Nam ngày 14/1, quá cảnh tại sân bay Vũ Hán."
        },{
            name:"France",
            case: 6,
            death: 0,
        },{
            name:"UAE",
            case: 5,
            death: 0,
        },{
            name:"Canada",
            case: 4,
            death: 0,
        },{
            name:"United Kingdom",
            case: 2,
            death: 0,
        },{
            name:"Russia",
            case: 2,
            death: 0,
        },{
            name:"Italy",
            case: 2,
            death: 0,
        },{
            name:"Philippines",
            case: 2,
            death: 1,
        },{
            name:"India",
            case: 2,
            death: 0,
        },{
            name:"Cambodia",
            case: 1,
            death: 0,
        },{
            name:"Finland",
            case: 1,
            death: 0,
        },{
            name:"Sri Lanka",
            case: 1,
            death: 0
        },{
            name:"Nepal",
            case: 1,
            death: 0,
        },{
            name:"Spain",
            case: 1,
            death: 0,
        },{
            name:"Sweden",
            case: 1,
            death: 0,
        }
        ]
    },
    
    {
        date:"2020-02-01T15:00:00.007Z",
        world: {
            case: 11953,
            death: 259,
        },
        tranmission_rate_min: 3.0,
        tranmission_rate_max: 4.0,
        fatality_rate: 2,
        incubation_period_min: 2,
        incubation_period_max: 14,
        countries: [
        {
            name:"Mainland China",
            case: 11791,
            death: 259,
            suspect: null,
            isolate: null,
            curve: null
        },{
            name:"Thailand",
            case: 19,
            death: 0,
        },{
            name:"Japan",
            case: 17,
            death: 0,
        },{
            name:"Singapore",
            case: 16,
            death: 0,
        },{
            name:"Hong Kong",
            case: 13,
            death: 0,
        },{
            name:"Australia",
            case: 12,
            death: 0,
        },{
            name:"South Korea",
            case: 12,
            death: 0,
        },{
            name:"Taiwan",
            case: 10,
            death: 0,
        },{
            name:"Malaysia",
            case: 8,
            death: 0,
        },{
            name:"United States",
            case: 7,
            death: 0,
        },{
            name:"Germany",
            case: 7,
            death: 0,
        },{
            name:"Macao",
            case: 7,
            death: 0
        },{
            name:"France",
            case: 6,
            death: 0,
        },{
            name:"Vietnam",
            case: 6,
            death: 0,
            suspect: 153,
            isolate: 27,
        },{
            name:"UAE",
            case: 4,
            death: 0,
        },{
            name:"Canada",
            case: 4,
            death: 0,
        },{
            name:"United Kingdom",
            case: 2,
            death: 0,

        },{
            name:"Russia",
            case: 2,
            death: 0,

        },{
            name:"Italy",
            case: 2,
            death: 0,
        },{
            name:"Finland",
            case: 1,
            death: 0,
        },{
            name:"Sri Lanka",
            case: 1,
            death: 0
        },{
            name:"Cambodia",
            case: 1,
            death: 0,
        },{
            name:"Philippines",
            case: 1,
            death: 0,
        },{
            name:"Nepal",
            case: 1,
            death: 0,
        },{
            name:"India",
            case: 1,
            death: 0,
        },{
            name:"Spain",
            case: 1,
            death: 0,
        },{
            name:"Sweden",
            case: 1,
            death: 0,
        }
        ]
    },{
        date:"2020-01-31T15:00:00.007Z",
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
            name:"Mainland China",
            case: 9692,
            death: 213,
            suspect: 15238,
            isolate: null,
            curve: null
        },{
            name:"Thailand",
            case: 14,
            death: 0,
        },{
            name:"Singapore",
            case: 13,
            death: 0,
        },{
            name:"Japan",
            case: 14,
            death: 0,

        },{
            name:"South Korea",
            case: 11,
            death: 0,

        },{
            name:"Hong Kong",
            case: 12,
            death: 0,

        },{
            name:"Taiwan",
            case: 9,
            death: 0,

        },{
            name:"Macao",
            case: 7,
            death: 0,

        },{
            name:"Australia",
            case: 9,
            death: 0,

        },{
            name:"Malaysia",
            case: 8,
            death: 0,

        },{
            name:"France",
            case: 6,
            death: 0,

        },{
            name:"United States",
            case: 6,
            death: 0,

        },{
            name:"Germany",
            case: 5,
            death: 0,

        },{
            name:"Vietnam",
            case: 5,
            death: 0,
            suspect: 32,
            isolate: 97,
        },{
            name:"UAE",
            case: 4,
            death: 0,

        },{
            name:"Canada",
            case: 3,
            death: 0,

        },{
            name:"Italy",
            case: 2,
            death: 0,

        },{
            name:"Finland",
            case: 1,
            death: 0,

        },{
            name:"Sri Lanka",
            case: 1,
            death: 0,

        },{
            name:"Cambodia",
            case: 1,
            death: 0,

        },{
            name:"Philippines",
            case: 1,
            death: 0,

        },{
            name:"Nepal",
            case: 1,
            death: 0,

        },{
            name:"India",
            case: 1,
            death: 0,

        }
        ]
    },{
        date:"2020-01-30T15:00:00.007Z",
        world: {
            case: 7818,
            death: 170,
        },
        countries: [
        {
            name:"Mainland China",
            case: 7711,
            death: 170,
            suspect: 12167,
            isolate: null,
            curve: null
        },{
            name:"Thailand",
            case: 14,
            death: 0
        },{
            name:"Japan",
            case: 11,
            death: 0
        },{
            name:"Taiwan",
            case: 8,
            death: 0
        },{
            name:"Korea",
            case: 4,
            death: 0
        },{
            name:"Hong Kong",
            case: 10,
            death: 0
        },{
            name:"Macau",
            case: 7,
            death: 0
        },{
            name:"United States",
            case: 5,
            death: 0
        },{
            name:"Singapore",
            case: 10,
            death: 0
        },{
            name:"Vietnam",
            case: 2,
            death: 0
        },{
            name:"Australia",
            case: 7,
            death: 0
        },{
            name:"Nepal",
            case: 1,
            death: 0
        },{
            name:"French",
            case: 5,
            death: 0
        },{
            name:"Malaysia",
            case: 7,
            death: 0
        },{
            name:"Canada",
            case: 3,
            death: 0
        },{
            name:"Cambodia",
            case: 1,
            death: 0
        },{
            name:"Sri Lanka",
            case: 1,
            death: 0
        },{
            name:"Germany",
            case: 4,
            death: 0
        },{
            name:"UAE",
            case: 4,
            death: 0
        },{
            name:"Philippines",
            case: 1,
            death: 0
        },{
            name:"India",
            case: 1,
            death: 0
        },{
            name:"Finland",
            case: 1,
            death: 0
        }]
    },{
        date:"2020-01-29T15:00:00.007Z",
        world: {
            case: 6065,
            death: 132,
        },
        countries: [
        {
            name:"Mainland China",
            case: 5974,
            death: 132,
            suspect: 9239,
            isolate: null,
            curve: null
        },{
            name:"Thailand",
            case: 14,
            death: 0
        },{
            name:"Japan",
            case: 7,
            death: 0
        },{
            name:"Taiwan",
            case: 8,
            death: 0
        },{
            name:"Korea",
            case: 4,
            death: 0
        },{
            name:"Hong Kong",
            case: 8,
            death: 0
        },{
            name:"Macau",
            case: 7,
            death: 0
        },{
            name:"United States",
            case: 5,
            death: 0
        },{
            name:"Singapore",
            case: 7,
            death: 0
        },{
            name:"Vietnam",
            case: 2,
            death: 0
        },{
            name:"Australia",
            case: 7,
            death: 0
        },{
            name:"Nepal",
            case: 1,
            death: 0
        },{
            name:"French",
            case: 4,
            death: 0
        },{
            name:"Malaysia",
            case: 4,
            death: 0
        },{
            name:"Canada",
            case: 3,
            death: 0
        },{
            name:"Cambodia",
            case: 1,
            death: 0
        },{
            name:"Sri Lanka",
            case: 1,
            death: 0
        },{
            name:"Germany",
            case: 4,
            death: 0
        },{
            name:"UAE",
            case: 4,
            death: 0
        }]
    },{
        date:"2020-01-28T15:00:00.007Z",
        world: {
            case: 4593,
            death: 106,
        },
        countries: [
        {
            name:"Mainland China",
            case: 4515,
            death: 106,
            suspect: 6973,
            isolate: null,
            curve: null
        },{
            name:"Thailand",
            case: 14,
            death: 0
        },{
            name:"Japan",
            case: 6,
            death: 0
        },{
            name:"Taiwan",
            case: 7,
            death: 0
        },{
            name:"Korea",
            case: 4,
            death: 0
        },{
            name:"Hong Kong",
            case: 8,
            death: 0
        },{
            name:"Macau",
            case: 7,
            death: 0
        },{
            name:"United States",
            case: 5,
            death: 0
        },{
            name:"Singapore",
            case: 7,
            death: 0
        },{
            name:"Vietnam",
            case: 2,
            death: 0
        },{
            name:"Australia",
            case: 5,
            death: 0
        },{
            name:"Nepal",
            case: 1,
            death: 0
        },{
            name:"French",
            case: 3,
            death: 0
        },{
            name:"Malaysia",
            case: 4,
            death: 0
        },{
            name:"Canada",
            case: 2,
            death: 0
        },{
            name:"Cambodia",
            case: 1,
            death: 0
        },{
            name:"Sri Lanka",
            case: 1,
            death: 0
        },{
            name:"Germany",
            case: 1,
            death: 0
        }]
    },{
        date:"2020-01-27T15:00:00.007Z",
        world: {
            case: 2798,
            death: 80,
        },
        countries: [
        {
            name:"Mainland China",
            case: 2744,
            death: 80,
            suspect: 5794,
            isolate: null,
            curve: null
        },{
            name:"Thailand",
            case: 5,
            death: 0
        },{
            name:"Japan",
            case: 4,
            death: 0
        },{
            name:"Taiwan",
            case: 4,
            death: 0
        },{
            name:"Korea",
            case: 4,
            death: 0
        },{
            name:"Hong Kong",
            case: 8,
            death: 0
        },{
            name:"Macau",
            case: 5,
            death: 0
        },{
            name:"United States",
            case: 5,
            death: 0
        },{
            name:"Singapore",
            case: 4,
            death: 0
        },{
            name:"Vietnam",
            case: 2,
            death: 0
        },{
            name:"Australia",
            case: 4,
            death: 0
        },{
            name:"Nepal",
            case: 1,
            death: 0
        },{
            name:"French",
            case: 3,
            death: 0
        },{
            name:"Malaysia",
            case: 4,
            death: 0
        },{
            name:"Canada",
            case: 1,
            death: 0
        }]
    },{
        date:"2020-01-26T15:00:00.007Z",
        world: {
            case: 2014,
            death: 56,
        },
        countries: [
        {
            name:"Mainland China",
            case: 1975,
            death: 56,
            suspect: null,
            isolate: null,
            curve: null
        },{
            name:"Thailand",
            case: 5,
            death: 0
        },{
            name:"Japan",
            case: 3,
            death: 0
        },{
            name:"Taiwan",
            case: 3,
            death: 0
        },{
            name:"Korea",
            case: 2,
            death: 0
        },{
            name:"Hong Kong",
            case: 5,
            death: 0
        },{
            name:"Macau",
            case: 2,
            death: 0
        },{
            name:"United States",
            case: 2,
            death: 0
        },{
            name:"Singapore",
            case: 4,
            death: 0
        },{
            name:"Vietnam",
            case: 2,
            death: 0
        },{
            name:"Australia",
            case: 4,
            death: 0
        },{
            name:"Nepal",
            case: 1,
            death: 0
        },{
            name:"French",
            case: 3,
            death: 0
        },{
            name:"Malaysia",
            case: 3,
            death: 0
        }]
    },{
        date:"2020-01-25T15:00:00.007Z",
        world: {
            case: 1320,
            death: 41,
        },
        countries: [
        {
            name:"Mainland China",
            case: 1287,
            death: 41,
            suspect: null,
            isolate: null,
            curve: null
        },{
            name:"Thailand",
            case: 4,
            death: 0
        },{
            name:"Japan",
            case: 3,
            death: 0
        },{
            name:"Taiwan",
            case: 3,
            death: 0
        },{
            name:"Korea",
            case: 2,
            death: 0
        },{
            name:"Hong Kong",
            case: 5,
            death: 0
        },{
            name:"Macau",
            case: 2,
            death: 0
        },{
            name:"United States",
            case: 2,
            death: 0
        },{
            name:"Singapore",
            case: 3,
            death: 0
        },{
            name:"Vietnam",
            case: 2,
            death: 0
        },{
            name:"Australia",
            case: 3,
            death: 0
        },{
            name:"Nepal",
            case: 1,
            death: 0
        },{
            name:"French",
            case: 3,
            death: 0
        }]
    },{
        date:"2020-01-24T15:00:00.007Z",
        world: {
            case: 846,
            death: 25,
        },
        countries: [
        {
            name:"Mainland China",
            case: 830,
            death: 25,
            suspect: null,
            isolate: null,
            curve: null
        },{
            name:"Thailand",
            case: 4,
            death: 0
        },{
            name:"Japan",
            case: 1,
            death: 0
        },{
            name:"Taiwan",
            case: 1,
            death: 0
        },{
            name:"Korea",
            case: 2,
            death: 0
        },{
            name:"Hong Kong",
            case: 2,
            death: 0
        },{
            name:"Macau",
            case: 2,
            death: 0
        },{
            name:"United States",
            case: 1,
            death: 0
        },{
            name:"Singapore",
            case: 1,
            death: 0
        },{
            name:"Vietnam",
            case: 2,
            death: 0
        }]
    },{
        date:"2020-01-23T15:00:00.007Z",
        world: {
            case: 581,
            death: 17,
        },
        countries: [
        {
            name:"Mainland China",
            case: 571,
            death: 17,
            suspect: null,
            isolate: null,
            curve: null
        },{
            name:"Thailand",
            case: 4,
            death: 0
        },{
            name:"Japan",
            case: 1,
            death: 0
        },{
            name:"Taiwan",
            case: 1,
            death: 0
        },{
            name:"Korea",
            case: 1,
            death: 0
        },{
            name:"Hong Kong",
            case: 1,
            death: 0
        },{
            name:"Macau",
            case: 1,
            death: 0
        },{
            name:"United States",
            case: 1,
            death: 0
        }]
    },{
        date:"2020-01-22T15:00:00.007Z",
        world: {
            case: 314,
            death: 6,
        },
        countries: [
        {
            name:"Mainland China",
            case: 309,
            death: 6,
            suspect: null,
            isolate: null,
            curve: null
        },{
            name:"Thailand",
            case: 2,
            death: 0
        },{
            name:"Japan",
            case: 1,
            death: 0
        },{
            name:"Taiwan",
            case: 1,
            death: 0
        },{
            name:"Korea",
            case: 1,
            death: 0
        }]
    },{
        date:"2020-01-21T15:00:00.007Z",
        world: {
            case: 282,
            death: 6,
        },
        countries: [
        {
            name:"Mainland China",
            case: 278,
            death: 6,
            suspect: null,
            isolate: null,
            curve: null
        },{
            name:"Thailand",
            case: 2,
            death: 0
        },{
            name:"Japan",
            case: 1,
            death: 0
        },{
            name:"Korea",
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
