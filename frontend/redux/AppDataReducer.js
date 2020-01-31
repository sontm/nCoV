import { REHYDRATE } from 'redux-persist';
import backend from '../constants/Backend';
import apputils from '../constants/AppUtils';
const APPDATA_OPEN_COUNT = 'APPDATA_OPEN_COUNT';
const APPDATA_SYNC_LATEST = 'APPDATA_SYNC_LATEST';
const APPDATA_TOGGLE_DEBUG = 'APPDATA_TOGGLE_DEBUG';

// ### Toyota OK
// Alphard Altis Avanza Camry Fortuner Hiace Hilux Innova LandPrado LandCruiser Prado Rush Vios Wigo Yaris
// ### Ford	OK
// Ecosport Escape Everest Explorer F150 Fiesta Focus Ranger Tourneo Transit
// ### Honda	OK
// Accord Brio BRV City Civic CRV HRV Jazz
// ### Hyundai OK
// Accent Elantra Genesis i10 Kona SantaFe Solati Sonata Starex Tucson 
// ### Mazda OK
// 2 3 6 BT50 CX3 CX5 CX8 CX9 MX5
// ### Kia OK
// Cerato(K3) Morning Optima(K5) Quoris(K9) GrandSedona Rondo Soluto Sorento 
// ### Mitsubishi OK
// Attrage Mirage Outlander Pajero Triton Xpander
// ### Nissan OK
// Juke Livina Murano Navara Nismo Sunny Teana Terra Urvan X-Trail 
// ### Vinfast
// Fadil LuxA2.0 LuxSA2.0 LuxV8
// ### Suzuki OK
// Blind Carry CarryPro Celerio Ciaz Ertiga Swift Vitara
// ### Subaru OK
// BRZ Forester Impreza Legacy Levorg Outback XV WXR
// ### Chevrolet OK
// Aveo Captiva Colorado Cruze Orlando Spark Trailblazer Trax
// ### ISUZU OK
// D-MAX MU-X Nseries Qseries
// ### DAIHATSU OK
// AYLA COPEN GRANMAX HIMAX SIGRA TERIOS 
// ### Mercedes OK
// A200 A250 A45 C200 C300 CLA200 CLA250 CLA45 E200 E250 E350  GLA200 GLA250  GLA45 GLC200 GLC250 GLC300 GLC43

// Not Prepare Data for THis, LUXURY
// ### BMW
// 118i 218i 320i 420i 520i 530i 730Li 740Li 750i M4 X1 X2 X3 X4 X5 X6 X7
// ### MiniCooper 
// Convertible Countryman Clubman One JCW Roadster S
// ### Renault
// CLIO DUSTER KOLEOS LATITUDE LOGAN MEGANE SANDERO TALISMAN 
// ### Audi
// A3 A4 A5 A6 A7 A8L Q2 Q3 Q5 Q7 Q8 R8  RS7 S8 TTS
// ### Lexus
// ES250 ES300h GS300 GS350 NX300 RX300 RX350 RX350L RX450H GX460 LX570 RC300 LS500 LS500h
// ### Volkswagen
// BeetleDune Elegance Jetta Luxury Passat Polo Premium Scirocco Sharan Tiguan Touareg
// ### Peugeot 
// 208 2008 308 3008 408 508 5008 Luxury Premium RCZ

// Honday Bike
//  ADV AirBlade Beat Blade Dream Future Genio Lead Mokey MSX125 PCX Rebel Sonic SH SHMode SuperCub Vario Vision Wave WinnerX 
// Yamaha 
//  Acruzo Exciter FreeGo FZ150i Janus Jupiter Lattte MT03 NVX Grande R15 R3 Sirius TFX150
// Suzuki
//  Address Axelo GD110 GSX150 GSX-R150 GSX-S150 Impulse Raider Revo Satria SkyDrive Viva X-Bike
// Piaggio
//  Liberty Medley Zip Vespa
// SYM
//  Abela Amigo Angela AngelEz Attila Elegant Elite Elizabeth Joyride Fancy Galaxy Husky Passing Shark StarSR StarX Venus VF3i

const DATA_BRAND_MODEL = [
    { id: 1,name: "Toyota", type:"car",
        models: [{"id":1,"name":"Alphard"},{"id":2,"name":"Altis"},{"id":3,"name":"Avanza"},{"id":4,"name":"Camry"},{"id":5,"name":"Fortuner"},{"id":6,"name":"Hiace"},{"id":7,"name":"Hilux"},{"id":8,"name":"Innova"},{"id":9,"name":"LandPrado"},{"id":10,"name":"LandCruiser"},{"id":11,"name":"Prado"},{"id":12,"name":"Rush"},{"id":13,"name":"Vios"},{"id":14,"name":"Wigo"},{"id":15,"name":"Yaris"}]},
    { id: 2,name: "Hyundai",  type:"car",
        models: [{"id":1,"name":"Accent"},{"id":11,"name":"Click"},{"id":2,"name":"Elantra"},{"id":3,"name":"Genesis"},{"id":4,"name":"i10"},{"id":5,"name":"Kona"},{"id":6,"name":"SantaFe"},{"id":7,"name":"Solati"},
        {"id":8,"name":"Sonata"},{"id":9,"name":"Starex"},{"id":10,"name":"Tucson"}  ]},
    { id: 3,name: "Mazda", type:"car", 
        models: [{"id":1,"name":"2"},{"id":2,"name":"3"},{"id":3,"name":"6"},{"id":4,"name":"BT50"},{"id":5,"name":"CX3"},{"id":6,"name":"CX5"},{"id":7,"name":"CX8"},{"id":8,"name":"CX9"},{"id":9,"name":"MX5"}]},
    { id: 4,name: "Kia", type:"car",
        models: [{"id":1,"name":"Cerato(K3)"},{"id":2,"name":"Morning"},{"id":3,"name":"Optima(K5)"},{"id":4,"name":"Quoris(K9)"},{"id":5,"name":"GrandSedona"},{"id":6,"name":"Rondo"},
        {"id":7,"name":"Soluto"},{"id":8,"name":"Sorento"},{"id":9,"name":"Frontier"}  ]},
    { id: 5,name: "Honda",  type:"car",
        models: [{"id":1,"name":"Accord"},{"id":2,"name":"Brio"},{"id":3,"name":"BRV"},{"id":4,"name":"City"},{"id":5,"name":"Civic"},{"id":6,"name":"CRV"},{"id":7,"name":"HRV"},{"id":8,"name":"Jazz"}]},
    { id: 6,name: "Ford",  type:"car",
        models: [{"id":1,"name":"Ecosport"},{"id":2,"name":"Escape"},{"id":3,"name":"Everest"},{"id":4,"name":"Explorer"},{"id":5,"name":"F150"},{"id":6,"name":"Fiesta"},{"id":7,"name":"Focus"},{"id":8,"name":"Ranger"},{"id":9,"name":"Tourneo"},{"id":10,"name":"Transit"}]},
    { id: 7,name: "Mitsubishi",  type:"car",
        models: [{"id":1,"name":"Attrage"},{"id":2,"name":"Mirage"},{"id":3,"name":"Outlander"},{"id":4,"name":"Pajero"},{"id":5,"name":"Triton"},{"id":6,"name":"Xpander"}]},
    
    { id: 8,name: "Nissan",  type:"car",
        models: [{"id":1,"name":"Juke"},{"id":2,"name":"Livina"},{"id":3,"name":"Murano"},{"id":4,"name":"Navara"},{"id":5,"name":"Nismo"},{"id":6,"name":"Sunny"},{"id":7,"name":"Teana"},{"id":8,"name":"Terra"},{"id":9,"name":"Tida"},{"id":10,"name":"Urvan"},{"id":11,"name":"X-Trail"}]},
    { id: 9,name: "Suzuki",  type:"car",
        models: [{"id":1,"name":"Blind"},{"id":2,"name":"Carry"},{"id":3,"name":"CarryPro"},{"id":4,"name":"Celerio"},{"id":5,"name":"Ciaz"},{"id":6,"name":"Ertiga"},{"id":7,"name":"Swift"},{"id":8,"name":"Vitara"}]},
    { id: 10,name: "Subaru",  type:"car",
        models: [{"id":1,"name":"BRZ"},{"id":2,"name":"Forester"},{"id":3,"name":"Impreza"},{"id":4,"name":"Legacy"},{"id":5,"name":"Levorg"},{"id":6,"name":"Outback"},{"id":7,"name":"XV"},{"id":8,"name":"WXR"}]},
    { id: 11,name: "Chevrolet",  type:"car",
        models: [{"id":1,"name":"Aveo"},{"id":2,"name":"Captiva"},{"id":3,"name":"Colorado"},{"id":4,"name":"Cruze"},{"id":5,"name":"Orlando"},{"id":6,"name":"Spark"},{"id":7,"name":"Trailblazer"},{"id":8,"name":"Trax"}]},
    { id: 12,name: "Isuzu",  type:"car",
        models: [{"id":1,"name":"D-MAX"},{"id":2,"name":"MU-X"},{"id":3,"name":"Nseries"},{"id":4,"name":"Qseries"}]},
    { id: 13,name: "Daihatsu",  type:"car",
        models: [{"id":1,"name":"AYLA"},{"id":2,"name":"COPEN"},{"id":3,"name":"GRANMAX"},{"id":4,"name":"HIMAX"},{"id":5,"name":"SIGRA"},{"id":6,"name":"TERIOS"}]},
    { id: 14,name: "Mercedes",  type:"car",
        models: [{"id":1,"name":"A200"},{"id":2,"name":"A250"},{"id":3,"name":"A45"},{"id":4,"name":"C200"},{"id":5,"name":"C300"},{"id":6,"name":"CLA200"},{"id":7,"name":"CLA250"},{"id":8,"name":"CLA45"},{"id":9,"name":"E200"},{"id":10,"name":"E250"},{"id":11,"name":"E350"},
        {"id":13,"name":"GLA200"},{"id":14,"name":"GLA250"},{"id":16,"name":"GLA45"},{"id":17,"name":"GLC200"},{"id":18,"name":"GLC250"},{"id":19,"name":"GLC300"},{"id":20,"name":"GLC43"}]},
    { id: 15,name: "VINFAST",  type:"car",
        models: [{"id":1,"name":"Fadil"},{"id":2,"name":"LuxA2.0"},{"id":3,"name":"LuxSA2.0"},{"id":4,"name":"LuxV8"}]},
    { id: 16,name: "Xe Tải", type:"car",
        models: [
        {"id":20,"name":"CAMC"},{"id":21,"name":"Changan"},{"id":22,"name":"Chenglong"},{"id":23,"name":"Daewoo"},{"id":24,"name":"DFSK"},{"id":25,"name":"Dongben"},{"id":26,"name":"Dongfeng"},
        {"id":27,"name":"Fuso"},{"id":28,"name":"Hyundai"},{"id":29,"name":"Hino"},{"id":30,"name":"Isuzu"},{"id":31,"name":"Jac"},{"id":32,"name":"Kenbo"},
        {"id":33,"name":"Shacman"},{"id":34,"name":"Suzuki"},{"id":35,"name":"Tata"},{"id":36,"name":"Teraco"},{"id":37,"name":"TMT"},{"id":38,"name":"Veam"},
        {"id":1,"name":"Thaco County"},{"id":2,"name":"Thaco City"},{"id":3,"name":"Thaco Forland"},{"id":4,"name":"Thaco Frontier"},{"id":5,"name":"Thaco Auman"},{"id":6,"name":"Thaco Mobihome"},{"id":7,"name":"Thaco Ollin"},{"id":8,"name":"Thaco Towner"},{"id":9,"name":"Thaco Solati"},{"id":10,"name":"Thaco Universe"}
    ]},
  
  
    // Motorbike
    { id: 100,name: "Honda", type:"bike",
        models: [{"id":1,"name":"ADV"},{"id":2,"name":"AirBlade"},{"id":3,"name":"Beat"},{"id":4,"name":"Blade"},
        {"id":5,"name":"Dream"},{"id":6,"name":"Future"},{"id":7,"name":"Genio"},{"id":8,"name":"Lead"},
        {"id":9,"name":"Mokey"},{"id":10,"name":"MSX125"},{"id":11,"name":"PCX"},{"id":12,"name":"Rebel"},{"id":13,"name":"Sonic"},
        {"id":14,"name":"SHMode"},{"id":15,"name":"SH"},{"id":16,"name":"SuperCub"},{"id":17,"name":"Vario"},
        {"id":18,"name":"Vision"},{"id":19,"name":"Wave"},{"id":20,"name":"WinnerX"}]},
    { id: 101,name: "Yamaha", type:"bike",
        models: [{"id":1,"name":"Acruzo"},{"id":2,"name":"Exciter"},{"id":3,"name":"FreeGo"},{"id":4,"name":"FZ150i"},
        {"id":5,"name":"Janus"},{"id":6,"name":"Jupiter"},{"id":7,"name":"Lattte"},{"id":16,"name":"Luvias"},{"id":8,"name":"MT03"},{"id":9,"name":"NVX"},
        {"id":10,"name":"Grande"},{"id":11,"name":"R15"},{"id":12,"name":"R3"},{"id":13,"name":"Sirius"},{"id":14,"name":"TFX150"}]},
    { id: 102,name: "Suzuki", type:"bike",
        models: [{"id":1,"name":"Address"},{"id":2,"name":"Axelo"},{"id":3,"name":"GD110"},{"id":4,"name":"GSX150"},
        {"id":5,"name":"GSX-R150"},{"id":6,"name":"GSX-S150"},{"id":7,"name":"Impulse"},{"id":8,"name":"Raider"},
        {"id":9,"name":"Revo"},{"id":10,"name":"Satria"},{"id":11,"name":"SkyDrive"},{"id":12,"name":"Viva"},{"id":13,"name":"X-Bike"}]},
    { id: 103,name: "Piaggio", type:"bike",
        models: [{"id":1,"name":"Liberty"},{"id":2,"name":"Medley"},{"id":3,"name":" Zip"},{"id":4,"name":"Vespa"}]},
    { id: 104,name: "SYM", type:"bike",
        models: [{"id":1,"name":"Abela"},{"id":2,"name":"Amigo"},{"id":3,"name":"Angela"},{"id":4,"name":"AngelEz"},
        {"id":5,"name":"Attila"},{"id":6,"name":"Elegant"},{"id":7,"name":"Elite"},{"id":8,"name":"Elizabeth"},
        {"id":9,"name":"Joyride"},{"id":10,"name":"Fancy"},{"id":11,"name":"Galaxy"},{"id":12,"name":"Husky"},
        {"id":13,"name":"Passing"},{"id":14,"name":"Shark"},{"id":15,"name":"StarSR"},
        {"id":16,"name":"StarX"},{"id":17,"name":"Venus"},{"id":18,"name":"VF3i"}]},
]

// This is Fixed in App, not in Server
const DATA_AUTH_TYPE = [
    {id: 1, name: "Đăng Kiểm"},
    {id: 2, name: "Bảo Hiểm Dân Sự"},
    {id: 3, name: "Phí Bảo Trì Đường Bộ"},
]
const DATA_EXPENSE_TYPE = [
    {id: 1, name: "Tiền Phạt"},
    {id: 2, name: "Cầu Đường"},
    {id: 3, name: "Gửi Xe"},
    {id: 4, name: "Rửa Xe"}
]
const DATA_SERVICE_TYPE = [
    {id: 1, name: "Dầu Máy"}, // Dầu Máy
    {id: 2, name: "Dầu Phanh"}, // Lop Xe
    {id: 3, name: "Dầu Trợ Lực Lái"},// Sam Xe
    {id: 4, name: "Dầu Li Hơp"},//
    {id: 5, name: "Dầu Vi Sai"},
    {id: 6, name: "Dầu Hộp Số Thường"},
    {id: 7, name: "Dầu Hộp Số Tự Động"},
    {id: 8, name: "Dầu Hộp Số Phụ"},

    {id: 9, name: "Lọc Nhiên Liệu"},
    {id: 10, name: "Loc Dầu Máy"},
    {id: 11, name: "Lọc Điều Hòa"},
    {id: 12, name: "Lọc Gió Động Cơ"},

    {id: 13, name: "Gas Điều Hoà"},
    {id: 14, name: "Nước Làm Mát"},
    {id: 15, name: "Đường Ống Làm Mát"},

    {id: 16, name: "Phanh: Bàn Đạp"},
    {id: 17, name: "Phanh: Phanh Tay"},
    {id: 18, name: "Phanh: Trống, Guốc"},
    {id: 19, name: "Phanh: Ống Dẫn"},
    {id: 20, name: "Phanh: Đĩa, Má"},
    {id: 21, name: "Phanh: Tuyô"},

    {id: 22, name: "Lốp: Áp Suất"},
    {id: 23, name: "Lốp: Đảo Lốp"},
    {id: 24, name: "Lốp: Bơm Vá"},

    {id: 25, name: "VôLăng, Dẫn Động"},
    {id: 26, name: "Đai Dẫn Động"},
    {id: 27, name: "Ống Xả & Giá Đỡ"},
    {id: 28, name: "Dây Curoa"},
    {id: 29, name: "Mỡ Trục CácĐăng"},
    {id: 30, name: "BuLông Trục CácĐăng"},
    {id: 31, name: "Cao Su Bán Trục"},
    {id: 32, name: "Khớp Cầu"},
    {id: 33, name: "Rotuyn"},

    {id: 34, name: "Đánh Lửa, Bugi"},
    {id: 35, name: "Ắc Quy"},
    {id: 36, name: "Xupap"},
    {id: 37, name: "Bộ Lọc Than Hoạt Tính"},
    {id: 38, name: "Bình Xăng & Ống Dẫn"},

    {id: 39, name: "Nước Rửa Kính"},
    {id: 40, name: "Vòi Nước Rửa Kính"},
    {id: 41, name: "Cơ Cấu Gạt Nước"},
    
    {id: 42, name: "Hệ thống Bánh Xe"},
    {id: 43, name: "Hệ thống Còi"},
    {id: 44, name: "Hệ thống Cửa & Cốp"},
    {id: 45, name: "Hệ thống Đai an toàn"},
    {id: 46, name: "Hệ thống Đèn"},
    {id: 47, name: "Đèn trên Đồng Hồ"},
    {id: 48, name: "Hệ thống Điện"},
    {id: 49, name: "Hệ thống Ghế"},
    {id: 50, name: "Hệ thống Làm Mát"},
    {id: 51, name: "Hệ thống Ly Hợp"},
    {id: 52, name: "Hệ thống Kiểm Soát Khí Thải"},
    {id: 53, name: "Hệ thống Kính, Gương"},
    {id: 54, name: "Hệ thống Phanh"},
    {id: 55, name: "Hệ thống Treo"},
]

const DATA_SERVICE_TYPE_BIKE = [
    {id: 1, name: "Dầu máy"}, // Dầu Máy
    {id: 2, name: "Dầu phanh"},
    {id: 3, name: "Dầu truyền động cuối"},
    {id: 4, name: "Dầu láp"},
    {id: 5, name: "Dung dịch làm mát"},

    {id: 6, name: "Lọc dầu máy"},
    {id: 7, name: "Lọc ly tâm dầu máy"},
    {id: 8, name: "Lọc gió"},
    {id: 9, name: "Lọc xăng"},
    {id: 10, name: "Đường ống xăng"},

    {id: 11, name: "Bugi"},
    {id: 12, name: "Xupap"},

    {id: 13, name: "Má phanh"},
    {id: 14, name: "Guốc phanh"},

    {id: 15, name: "Săm"},
    {id: 16, name: "Lốp"},
    {id: 17, name: "Bánh Xe, Đũa Xe"},

    {id: 18, name: "Nhông"},
    {id: 19, name: "Xích"},
    {id: 20, name: "Sên"},
    {id: 21, name: "Dây đai (Curoa)"},
    {id: 22, name: "Hộp lọc gió Dây đai"},

    {id: 23, name: "Đèn pha"},
    {id: 24, name: "Đèn xi nhan"},
    {id: 25, name: "Đèn phanh"},
    {id: 26, name: "Ắc quy"},
    {id: 27, name: "Cầu chì"},
    {id: 28, name: "Còi xe"},

    {id: 29, name: "Chân chống nghiêng"},
    {id: 30, name: "Chân chống đứng"},
    {id: 31, name: "Giảm sóc"},

    {id: 32, name: "Guốc văng ly hợp"},
    {id: 33, name: "Đĩa ly hợp"},
    {id: 34, name: "Bi văng ly hợp"},
    {id: 35, name: "Bi cổ lái"},
    {id: 36, name: "Bình xăng"},
    {id: 37, name: "Két nước"},
    {id: 38, name: "Bô xe"},
    {id: 39, name: "Yên xe"},
    {id: 40, name: "Bướm gió"},
    {id: 41, name: "Gương xe"},

    {id: 42, name: "Dây điện gas"},
    {id: 43, name: "Dây điện phanh"},
    {id: 44, name: "Dây điện Km"},

    {id: 45, name: "Ốc, Vít, Móc, Kẹp"},
    {id: 46, name: "Hệ thống cấp khí phụ"},
    {id: 47, name: "Hệ thống công tắc"},
    {id: 48, name: "Hệ thống đèn"},
    {id: 49, name: "Hệ thống điện"},
    {id: 50, name: "Hệ thống kiểm soát hơi xăng"},
    {id: 51, name: "Hệ thống kiểm soát khí thải"},
    {id: 52, name: "Hệ thống làm mát"},
    {id: 53, name: "Hệ thống ly hợp"},
    {id: 54, name: "Hệ thống phanh"},
    {id: 55, name: "Hệ thống thông hơi máy"},
    {id: 56, name: "Hệ thống tay ga"},
    {id: 57, name: "Hệ thống vòng bi"},
]

const initialState = {
    carModels: DATA_BRAND_MODEL,
    typeAuth: DATA_AUTH_TYPE,
    typeExpense: DATA_EXPENSE_TYPE,
    typeService: DATA_SERVICE_TYPE,
    typeServiceBike: DATA_SERVICE_TYPE_BIKE,
    appDataLatestOn: null,

    countOpen: 0,
    isNoAds: false,
    isDebugMode: false
};

export const actAppToggleDebugMode = () => (dispatch) => {
    apputils.CONSOLE_LOG("actAppToggleDebugMode:")
    dispatch({
        type: APPDATA_TOGGLE_DEBUG
    })
}

export const actAppIncreaseOpenCount = () => (dispatch) => {
    apputils.CONSOLE_LOG("actAppIncreaseOpenCount:")
    dispatch({
        type: APPDATA_OPEN_COUNT
    })
}

export const actAppSyncLatestDataIfNeeded = (prevAppData) => (dispatch) => {
    apputils.CONSOLE_LOG("actAppSyncLatestDataIfNeeded:")
    backend.getLatestAppDataOn(
    response => {
        apputils.CONSOLE_LOG(response.data.updatedOn + " vs " + prevAppData.appDataLatestOn)
        if (response.data.updatedOn &&  new Date(prevAppData.appDataLatestOn).getTime() < new Date(response.data.updatedOn).getTime()) {
            apputils.CONSOLE_LOG("-----Need Update App Data ")
            // Need Update latest AppData here
            backend.getLatestAppData(
            response2 => {
                //apputils.CONSOLE_LOG(response.data)
                dispatch({
                    type: APPDATA_SYNC_LATEST,
                    payload: {data: response2.data, updatedOn: response.data.updatedOn}

                })
            },
            err2 => {
        
            })
        }
        
    },
    err => {

    })

    

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
            carModels: action.payload.data.vehicles,
            typeExpense: action.payload.data.expenses,
            typeService: action.payload.data.services,
            typeServiceBike: action.payload.data.servicesBike,
        };
    case APPDATA_TOGGLE_DEBUG:
        return {
            ...state,
            isDebugMode: !state.isDebugMode ? true: false
        };
    default:
        return state;
    }
}
