import { REHYDRATE } from 'redux-persist';
import AppConstants from '../constants/AppConstants'
import AppUtils from '../constants/AppUtils'
import backend from '../constants/Backend';

var _ = require('lodash');

const VEHICLE_SYNC_FROMSERVER = 'VEHICLE_SYNC_FROMSERVER';
const VEHICLE_SYNC_TOSERVER = 'VEHICLE_SYNC_TOSERVER';

const VEHICLE_ADD = 'VEHICLE_ADD';
const VEHICLE_EDIT = 'VEHICLE_EDIT';
const VEHICLE_DEL = 'VEHICLE_DEL';

const VEHICLE_FILL_GAS_ADD = 'VEHICLE_FILL_GAS_ADD';
const VEHICLE_FILL_OIL_ADD = 'VEHICLE_FILL_OIL_ADD';
const VEHICLE_CAR_AUTH_ADD = 'VEHICLE_CAR_AUTH_ADD';
const VEHICLE_EXPENSE_ADD = 'VEHICLE_EXPENSE_ADD';
const VEHICLE_SERVICE_ADD = 'VEHICLE_SERVICE_ADD';

const VEHICLE_FILL_GAS_DEL = 'VEHICLE_FILL_GAS_DEL';
const VEHICLE_FILL_OIL_DEL = 'VEHICLE_FILL_OIL_DEL';
const VEHICLE_CAR_AUTH_DEL = 'VEHICLE_CAR_AUTH_DEL';
const VEHICLE_EXPENSE_DEL = 'VEHICLE_EXPENSE_DEL';
const VEHICLE_SERVICE_DEL = 'VEHICLE_SERVICE_DEL';

const VEHICLE_FILL_GAS_EDIT = 'VEHICLE_FILL_GAS_EDIT';
const VEHICLE_FILL_OIL_EDIT = 'VEHICLE_FILL_OIL_EDIT';
const VEHICLE_CAR_AUTH_EDIT = 'VEHICLE_CAR_AUTH_EDIT';
const VEHICLE_EXPENSE_EDIT = 'VEHICLE_EXPENSE_EDIT';
const VEHICLE_SERVICE_EDIT = 'VEHICLE_SERVICE_EDIT';

const USER_LOGIN_OK = 'USER_LOGIN_OK';
const USER_UPDATEPROFILE_OK = 'USER_UPDATEPROFILE_OK';
const USER_REGISTER_OK = 'USER_REGISTER_OK';
const USER_LOGOUT = 'USER_LOGOUT';
const USER_CREATE_TEAM_OK = 'USER_CREATE_TEAM_OK';
const USER_LEAVE_TEAM_OK = 'USER_LEAVE_TEAM_OK';

const USER_CREATE_VEHICLEMODEL = 'USER_CREATE_VEHICLEMODEL';
const USER_DEL_VEHICLEMODEL = 'USER_DEL_VEHICLEMODEL';

const USER_SYNC_PARTLY_OK = 'USER_SYNC_PARTLY_OK';

const USER_SET_MAX_METER = 'USER_SET_MAX_METER';
const USER_GET_APPNOTIFICATION = 'USER_GET_APPNOTIFICATION';
const USER_SAW_ALL_APPNOTIFICATION = 'USER_SAW_ALL_APPNOTIFICATION';

const TEMP_CALCULATE_CARREPORT = 'TEMP_CALCULATE_CARREPORT';
const TEMP_CALCULATE_CARREPORT_ALL = 'TEMP_CALCULATE_CARREPORT_ALL';

const SETTING_MAINTAIN_TYPE = 'SETTING_MAINTAIN_TYPE';
const SETTING_REMIND = 'SETTING_REMIND';

const USER_SYNC_PRIVATE_START = 'USER_SYNC_PRIVATE_START';
const USER_SYNC_PRIVATE_DONE = 'USER_SYNC_PRIVATE_DONE';
const USER_SYNC_TEAM_START = 'USER_SYNC_TEAM_START';
const USER_SYNC_TEAM_DONE = 'USER_SYNC_TEAM_DONE';
const USER_INIT_DATA = 'USER_INIT_DATA';
const USER_FORCE_CLOSE_MODAL = 'USER_FORCE_CLOSE_MODAL';

const USER_GOT_MY_JOINREQUEST = 'USER_GOT_MY_JOINREQUEST';

const CUSTOM_ADD_SERVICEMODULE = 'CUSTOM_ADD_SERVICEMODULE';
const CUSTOM_ADD_SERVICEMODULE_BIKE = 'CUSTOM_ADD_SERVICEMODULE_BIKE';
const CUSTOM_DEL_SERVICEMODULE = 'CUSTOM_DEL_SERVICEMODULE';
const CUSTOM_DEL_SERVICEMODULE_BIKE = 'CUSTOM_DEL_SERVICEMODULE_BIKE';

const DEFAULT_SETTING_REMIND = {
    kmForOilRemind: 50,
    dayForAuthRemind: 15,
    dayForInsuranceRemind: 15,
    dayForRoadFeeRemind: 15,
}
const DEFAULT_SETTING_SERVICE = {
    Km: [5000, 10000, 20000, 40000, 80000],
    Month: [6, 12, 24, 48, 96],
    KmBike: [4000, 8000, 12000, 16000, 20000],
    MonthBike: [4, 8, 12, 18, 24],

    LevelEnable: [true, true, true, false, false],
    LevelBikeEnable: [true, true, false, false, false],
}
// Each Item: fillDate: new Date().toLocaleString(),amount: "",price: "",currentKm: "",type: "oil",subType: "",remark: "",
const initialState = {
    // Below will Sync. Special when User Leave Team, Join Team...
    teamInfo: {},//"code": "bfOdOi7L", "id": "","name": "PhuPhuong", canMemberViewReport
    // Below will Sync; Updated in Login
    userProfile: {},//"email": "tester3","fullName": "Test3","id": "","phone": "","type": "local", teamId, teamCode, 
                        //class:"freeUser", pictureUrl, roleInTeam
    isLogined: false,
    token: "",
    defaultVehicleId: "",


    carReports:{}, // {vehicleid: {gasReport,authReport,moneyReport,maintainRemind, scheduledNotification}}

    // Below will Sync
    vehicleList:[],//fillGasList:[],fillOilList:[],authorizeCarList:[],expenseList:[],serviceList:[]/
                    // Each item: maxMeter ...
                    // "id":"isDefault": false,"licensePlate","model": "CRV","ownerFullName", userId":, maxMeter
    
    // Below will Sync
    customServiceModules: [],
    // Below will Sync
    customServiceModulesBike: [],
    // Below will Sync
    customVehicleModel: [],//{ id:!=0,name, type:"car|bike",models: [{"id":!=0,"name":"Juke"}]

    // Below will Sync
    settings: DEFAULT_SETTING_REMIND, //kmForOilRemind,dayForAuthRemind,dayForInsuranceRemind,dayForRoadFeeRemind
    // Below will Sync
    settingService: DEFAULT_SETTING_SERVICE,

    // WIll Sync from Server
    notifications: [], //  "content","enable","forAll","id","issueDate","teamId",title",userId". Will add notSeen Locally
    // WIll Sync from Server
    myJoinRequest: {}, // "email" "fullName" "id" "phone" "status" "teamCode""teamName""updatedOn" "userId"

    countNotSeenNoti: 0,

    isNoAds: false,

    modalState: 0, // 1: syncPrivate, 2: syncTeam, 0: close. ++ when start each sync, -- when done each

    // Object of store information to server
    // if vehicleIds.lengt > 0, mean only update in some information
    // changedAllVehicles true mean All need update all Vehicles, 
    // changedSetting/changedCustom true mean setting/custom service need update
    // changedItemCount mean number of item changed
    modifiedInfo: {vehicleIds:[], changedAllVehicles: false, changedCustom: false, changedSetting: false,changedItemCount: 0},

    lastSyncFromServerOn: null, // date of last sync
    lastSyncToServerOn: null,
};

export const reCalculateCarReports = (currentVehicle, prevUserData, theDispatch, vehicleId) => {
    // For calcualte All Time data
    let options = {
        durationType: "month",
        tillDate: new Date(),
        duration: 300,
    }

    // If currentVehicle is NULL, need get by vehicleId
    if (!currentVehicle) {
        AppUtils.CONSOLE_LOG("=====vehicleNull, id:" + vehicleId + "ml:" + prevUserData.vehicleList.length)
        for (let l = 0; l < prevUserData.vehicleList.length; l++ ) {
            AppUtils.CONSOLE_LOG("   list id:" + prevUserData.vehicleList[l].id)
            if (prevUserData.vehicleList[l].id == vehicleId) {
                currentVehicle = prevUserData.vehicleList[l];
            }
        }
    }
    if (currentVehicle) {
        AppUtils.actTempCalculateCarReportAsyncWrapper(currentVehicle, options, 
            prevUserData.settings, prevUserData.carReports, prevUserData.settingService)
        .then (result => {
            AppUtils.CONSOLE_LOG("<<<<<<<reCalculateCarReports FINISH")
            if (theDispatch) {
                theDispatch({
                    type: TEMP_CALCULATE_CARREPORT,
                    payload: {id: currentVehicle.id, data: result}
                })
            } else {
                dispatch({
                    type: TEMP_CALCULATE_CARREPORT,
                    payload: {id: currentVehicle.id, data: result}
                })
            }
        })
        .catch (error => {
            AppUtils.CONSOLE_LOG(error)
        })
    }
}

export const actSettingSetMaintainType = (data) => (dispatch) => {
    AppUtils.CONSOLE_LOG("actSettingSetMaintainType:")
    dispatch({
        type: SETTING_MAINTAIN_TYPE,
        payload: data
    })
}
export const actSettingSetRemind = (data) => (dispatch) => {
    AppUtils.CONSOLE_LOG("actSettingSetRemind:")
    dispatch({
        type: SETTING_REMIND,
        payload: data
    })
}

export const actUserRegisterOK = (data) => (dispatch) => {
    AppUtils.CONSOLE_LOG("actUserRegisterOK:")
    dispatch({
        type: USER_REGISTER_OK,
        payload: data
    })
}

export const actUserCreateTeamOK = (data, isMember) => (dispatch) => {
    AppUtils.CONSOLE_LOG("actCreateTeamOK:")
    AppUtils.CONSOLE_LOG(data)
    dispatch({
        type: USER_CREATE_TEAM_OK,
        payload: {data: data, isMember: isMember}
    })
}
export const actUserLeaveTeamOK = (data) => (dispatch) => {
    AppUtils.CONSOLE_LOG("actUserLeaveTeamOK:")
    dispatch({
        type: USER_LEAVE_TEAM_OK
    })
}

// data will have fullname, phone and token if needed
export const actUserUpdateProfileOK = (data) => (dispatch) => {
    AppUtils.CONSOLE_LOG("actUserUpdateProfileOK:")
    dispatch({
        type: USER_UPDATEPROFILE_OK,
        payload: data
    })
}

//{user,token,teamInfo}
export const actUserLoginOK = (data) => (dispatch) => {
    AppUtils.CONSOLE_LOG("actUserLoginOK:")
    dispatch({
        type: USER_LOGIN_OK,
        payload: data
    })
}
export const actUserLogout = () => (dispatch) => {
    AppUtils.CONSOLE_LOG("actUserLogout:")
    dispatch({
        type: USER_LOGOUT,
    })
}





export const actVehicleAddVehicle = (vehicle, prevUserData) => (dispatch, getState) => {
    AppUtils.CONSOLE_LOG("actVehicleAddVehicle:")
    dispatch({
        type: VEHICLE_ADD,
        payload: vehicle
    })
    let {userData} = getState();
    reCalculateCarReports(vehicle, userData, dispatch)
}
export const actVehicleEditVehicle = (vehicle, prevUserData) => (dispatch, getState) => {
    AppUtils.CONSOLE_LOG("actVehicleEditVehicle:")
    dispatch({
        type: VEHICLE_EDIT,
        payload: vehicle
    })
    let {userData} = getState();
    reCalculateCarReports(vehicle, userData, dispatch)
}
export const actVehicleDeleteVehicle = (vehicleId, licensePlate) => (dispatch) => {
    AppUtils.CONSOLE_LOG("actVehicleDeleteVehicle:"+vehicleId+",licensePlate:" + licensePlate)
    dispatch({
        type: VEHICLE_DEL,
        payload: {id: vehicleId, licensePlate: licensePlate}
    })
}

export const actVehicleAddFillItem = (data, type, prevUserData) => (dispatch, getState) => {
    AppUtils.CONSOLE_LOG("actVehicleAddFillItem:")
    //AppConstants.BUFFER_NEED_RECALCULATE_VEHICLE_ID.push(data.vehicleId)

    if (type == AppConstants.FILL_ITEM_GAS) {
        dispatch({
            type: VEHICLE_FILL_GAS_ADD,
            payload: data
        })
    } else if (type == AppConstants.FILL_ITEM_OIL) {
        dispatch({
            type: VEHICLE_FILL_OIL_ADD,
            payload: data
        })
    } else if (type == AppConstants.FILL_ITEM_AUTH) {
        dispatch({
            type: VEHICLE_CAR_AUTH_ADD,
            payload: data
        })
    } else if (type == AppConstants.FILL_ITEM_EXPENSE) {
        dispatch({
            type: VEHICLE_EXPENSE_ADD,
            payload: data
        })
    } else if (type == AppConstants.FILL_ITEM_SERVICE) {
        dispatch({
            type: VEHICLE_SERVICE_ADD,
            payload: data
        })
    }
    let {userData} = getState();
    reCalculateCarReports(null, userData, dispatch, data.vehicleId)
}

// type: gas, oil, auth, 
export const actVehicleDeleteFillItem = (vehicleId, itemId, type, prevUserData) => (dispatch, getState) => {
    AppUtils.CONSOLE_LOG("actVehicleDeleteFillItem:"+itemId+",type:" + type)
    //AppConstants.BUFFER_NEED_RECALCULATE_VEHICLE_ID.push(itemId.vehicleId)

    if (type == AppConstants.FILL_ITEM_GAS) {
        dispatch({
            type: VEHICLE_FILL_GAS_DEL,
            payload: {itemId, vehicleId: vehicleId}
        })
    } else if (type == AppConstants.FILL_ITEM_OIL) {
        dispatch({
            type: VEHICLE_FILL_OIL_DEL,
            payload: {itemId, vehicleId: vehicleId}
        })
    } else if (type == AppConstants.FILL_ITEM_AUTH) {
        dispatch({
            type: VEHICLE_CAR_AUTH_DEL,
            payload: {itemId, vehicleId: vehicleId}
        })
    } else if (type == AppConstants.FILL_ITEM_EXPENSE) {
        dispatch({
            type: VEHICLE_EXPENSE_DEL,
            payload: {itemId, vehicleId: vehicleId}
        })
    } else if (type == AppConstants.FILL_ITEM_SERVICE) {
        dispatch({
            type: VEHICLE_SERVICE_DEL,
            payload: {itemId, vehicleId: vehicleId}
        })
    }

    let {userData} = getState();
    reCalculateCarReports(null, userData, dispatch, vehicleId)
}

// type: gas, oil, auth, 
export const actVehicleEditFillItem = (itemId, type, prevUserData) => (dispatch, getState) => {
    AppUtils.CONSOLE_LOG(">>>>>>>>>>>>> Start Dispatch actVehicleEditFillItem:"+itemId+",type:" + type)
    AppUtils.CONSOLE_LOG(itemId)
    AppConstants.BUFFER_NEED_RECALCULATE_VEHICLE_ID.push(itemId.vehicleId)

    if (type == AppConstants.FILL_ITEM_GAS) {
        dispatch({
            type: VEHICLE_FILL_GAS_EDIT,
            payload: itemId
        })
    } else if (type == AppConstants.FILL_ITEM_OIL) {
        dispatch({
            type: VEHICLE_FILL_OIL_EDIT,
            payload: itemId
        })
    } else if (type == AppConstants.FILL_ITEM_AUTH) {
        dispatch({
            type: VEHICLE_CAR_AUTH_EDIT,
            payload: itemId
        })
    } else if (type == AppConstants.FILL_ITEM_EXPENSE) {
        dispatch({
            type: VEHICLE_EXPENSE_EDIT,
            payload: itemId
        })
    } else if (type == AppConstants.FILL_ITEM_SERVICE) {
        dispatch({
            type: VEHICLE_SERVICE_EDIT,
            payload: itemId
        })
    }

    AppUtils.CONSOLE_LOG("<<<<<<<<<<<< END Dispatch actVehicleEditFillItem:"+itemId+",type:" + type)
    let {userData} = getState();
    // AppUtils.CONSOLE_LOG(prevUserData.vehicleList[0].authorizeCarList)
    // AppUtils.CONSOLE_LOG("  >>>>>>>>>>>> Start reCalculateCarReports")
    // AppUtils.CONSOLE_LOG(userData.vehicleList[0].authorizeCarList)

    reCalculateCarReports(null, userData, dispatch, itemId.vehicleId)
}





export const actTempCalculateCarReport = (currentVehicle, options, prevUserData, theDispatch) => (dispatch) => {
    // If Report of this Vehicle already Exist, and Is not FOrce, no need to Re-calculate
    if (!prevUserData || !prevUserData.carReports || !prevUserData.carReports[currentVehicle.id] || 
            AppConstants.BUFFER_NEED_RECALCULATE_VEHICLE_ID.indexOf(currentVehicle.id) >= 0) {
        AppUtils.CONSOLE_LOG(">>>actTempCalculateCarReport in User:")
        // if (!prevUserData || !prevUserData.carReports) {
        //     // Maybe from Sync from Server, clear all Notifications
        //     apputils.cancelAllAppLocalNotification();
        // }
        let theIdx = AppConstants.BUFFER_NEED_RECALCULATE_VEHICLE_ID.indexOf(currentVehicle.id);
        AppConstants.BUFFER_NEED_RECALCULATE_VEHICLE_ID.splice(theIdx, 1);
        // For calcualte All Time data
        options = {
            durationType: "month",
            tillDate: new Date(),
            duration: 300,
        }

        AppUtils.actTempCalculateCarReportAsyncWrapper(currentVehicle, options, 
            prevUserData.settings, prevUserData.carReports, prevUserData.settingService)
        .then (result => {
            AppUtils.CONSOLE_LOG("<<<<<<<actTempCalculateCarReport FINISH")
            if (theDispatch) {
                theDispatch({
                    type: TEMP_CALCULATE_CARREPORT,
                    payload: {id: currentVehicle.id, data: result}
                })
            } else {
                dispatch({
                    type: TEMP_CALCULATE_CARREPORT,
                    payload: {id: currentVehicle.id, data: result}
                })
            }
        })
        .catch (error => {
            AppUtils.CONSOLE_LOG(error)
        })
    }
}

// data will have
// vehicleList: props.userData.vehicleList,
    // customServiceModules: props.userData.customServiceModules,
    // customServiceModulesBike: props.userData.customServiceModulesBike,
    //customVehicleModel:
    // settings: props.userData.settings,
    // settingService: props.userData.settingService
    // teamInfo: teamInfo
// oldProps have both userData, teamData
export const actVehicleSyncAllFromServer = (data, oldProps, isMergeDataBeforeLogin) => (dispatch) => {
    AppUtils.CONSOLE_LOG("actVehicleSyncFromServer:")
    dispatch({
        type: VEHICLE_SYNC_FROMSERVER,
        payload: {data: data, isMergeDataBeforeLogin: isMergeDataBeforeLogin}
    })

    // TODO for when SYnc, need re-calcualte Report
    let options = {
        durationType: "month",
        tillDate: new Date(),
        duration: 300,
    }
    let allCarReports = {};
    let needProcess = 0;
    let doneProcess = 0;
    let newCarIds = [];
    let isSomeCarRemoved = false;
    let isAlreadyDispatch = false;

    if (data.vehicleList && data.vehicleList.length > 0) {
        data.vehicleList.forEach ((vehicle, index) => {
            newCarIds.push(vehicle.id);
        })
    }

    if (isMergeDataBeforeLogin) {
        allCarReports = oldProps.userData.carReports;
    }
    // compare with Currrent Length of CarReports, if Larger, mean some Care removed, so Need reload
    if (!isMergeDataBeforeLogin && Object.keys(oldProps.userData.carReports).length > newCarIds.length) {
        isSomeCarRemoved = true;
    }

    if (data.vehicleList && data.vehicleList.length > 0) {
        data.vehicleList.forEach ((vehicle, index) => {
            // Deep Compare Object here
            let isSameData = false;
            for (let l = 0; l < oldProps.userData.vehicleList.length; l++) {
                if (oldProps.userData.vehicleList[l].id == vehicle.id) {
                    // Found Matched Vehicle, Compare is Same
                    if (_.isEqual(vehicle, oldProps.userData.vehicleList[l])) {
                        isSameData = true;
                        break;
                    }
                }
            }
            if (isSameData && oldProps.userData.carReports[""+vehicle.id]) {
                AppUtils.CONSOLE_LOG("&&&&&&&&&&&&&&^^^^^^^^ Yeah Same Data when sync from Server, No need Reports:"+ vehicle.licensePlate)
                allCarReports[""+vehicle.id] = oldProps.userData.carReports[""+vehicle.id]
            } else {
                needProcess++;
                AppUtils.actTempCalculateCarReportAsyncWrapper(vehicle, options)
                .then (result => {
                    AppUtils.CONSOLE_LOG("  OK User Calculate Report:" + vehicle.licensePlate)
                    allCarReports[""+vehicle.id] = result
                    doneProcess++;
                    
                    //if (index == data.vehicleList.length - 1) {
                    if (doneProcess == needProcess) {
                        oldProps.actUserStartSyncPrivateDone();
                        isAlreadyDispatch = true;
                        AppUtils.CONSOLE_LOG("======================= Final Dispatch User Reports:")
                        dispatch({
                            type: TEMP_CALCULATE_CARREPORT_ALL,
                            payload: allCarReports
                        })
                    }
                })
                .catch (error => {
                    AppUtils.CONSOLE_LOG("  Error User Calculate Report:" + vehicle.licensePlate)
                    AppUtils.CONSOLE_LOG(error)
                })
            }
        })
    }

    if (isSomeCarRemoved && !isAlreadyDispatch) {
        // We still Force to ReCalculate Reports when some Car Removed
        oldProps.actUserStartSyncTeamDone();
        dispatch({
            type: TEMP_CALCULATE_CARREPORT_ALL,
            payload: allCarReports
        })
    } else
    if (needProcess == 0) {
        // Nothing New,
        oldProps.actUserStartSyncPrivateDone();
    }
}




export const actUserInitializeInitialDataWhenAppStart = () => (dispatch) => {
    AppUtils.CONSOLE_LOG("actUserInitializeInitialDataWhenAppStart:")
    dispatch({
        type: USER_INIT_DATA
    })
}
export const actUserStartSyncPrivate = () => (dispatch) => {
    AppUtils.CONSOLE_LOG("actUserStartSyncPrivate:")
    dispatch({
        type: USER_SYNC_PRIVATE_START
    })
}
export const actUserStartSyncPrivateDone = () => (dispatch) => {
    AppUtils.CONSOLE_LOG("actUserStartSyncPrivate:")
    dispatch({
        type: USER_SYNC_PRIVATE_DONE,
        
    })
}
export const actUserStartSyncTeam = () => (dispatch) => {
    AppUtils.CONSOLE_LOG("actUserStartSyncPrivate:")
    dispatch({
        type: USER_SYNC_TEAM_START
    })
}
export const actUserStartSyncTeamDone = () => (dispatch) => {
    AppUtils.CONSOLE_LOG("actUserStartSyncPrivate:")
    dispatch({
        type: USER_SYNC_TEAM_DONE
    })
}
export const actUserForCloseModal = () => (dispatch) => {
    AppUtils.CONSOLE_LOG("actUserForCloseModal:")
    dispatch({
        type: USER_FORCE_CLOSE_MODAL
    })
}





export const actVehicleSyncToServerOK = (data) => (dispatch) => {
    AppUtils.CONSOLE_LOG("actVehicleSyncToServerOK:")
    dispatch({
        type: VEHICLE_SYNC_TOSERVER
    })
}


export const actCustomAddServiceModule = (data) => (dispatch) => {
    AppUtils.CONSOLE_LOG("actCustomAddServiceModule:")
    dispatch({
        type: CUSTOM_ADD_SERVICEMODULE,
        payload: data
    })
}
export const actCustomAddServiceModuleBike = (data) => (dispatch) => {
    AppUtils.CONSOLE_LOG("actCustomAddServiceModuleBike:")
    dispatch({
        type: CUSTOM_ADD_SERVICEMODULE_BIKE,
        payload: data
    })
}
export const actCustomDelServiceModule = (data) => (dispatch) => {
    AppUtils.CONSOLE_LOG("actCustomDelServiceModule:")
    dispatch({
        type: CUSTOM_DEL_SERVICEMODULE,
        payload: data
    })
}
export const actCustomDelServiceModuleBike = (data) => (dispatch) => {
    AppUtils.CONSOLE_LOG("actCustomDelServiceModuleBike:")
    dispatch({
        type: CUSTOM_DEL_SERVICEMODULE_BIKE,
        payload: data
    })
}


// data: {vehicleId, maxMeter}
export const actUserSetMaxOdometer = (data) => (dispatch) => {
    AppUtils.CONSOLE_LOG("actUserSetMaxOdometer:")
    dispatch({
        type: USER_SET_MAX_METER,
        payload: data
    })
}

// data: {type, brand, model}
export const actUserCreateNewVehicleModel = (data) => (dispatch) => {
    AppUtils.CONSOLE_LOG("actUserCreateNewVehicleModel:")
    dispatch({
        type: USER_CREATE_VEHICLEMODEL,
        payload: data
    })
}

// data: {brand, model, isBike}
export const actUserDelNewVehicleModel = (data) => (dispatch) => {
    AppUtils.CONSOLE_LOG("actUserDelNewVehicleModel:")
    dispatch({
        type: USER_DEL_VEHICLEMODEL,
        payload: data
    })
}


export const actUserGetNotifications = (prevUserProps) => (dispatch) => {
    // If Report of this Vehicle already Exist, and Is not FOrce, no need to Re-calculate
    AppUtils.CONSOLE_LOG("actUserGetNotifications, token:" + prevUserProps.token)
    let notiIds = [];
    if (prevUserProps.notifications) {
        prevUserProps.notifications.forEach(item => {
            notiIds.push(item.id)
        })
    }
    if (prevUserProps.isLogined) {
        backend.getAllNotification(notiIds, prevUserProps.token,
        response => {
            AppUtils.CONSOLE_LOG("  OK Got Notification:" )
            AppUtils.CONSOLE_LOG(response.data)
            if (response.data && response.data.length > 0) {
                dispatch({
                    type: USER_GET_APPNOTIFICATION,
                    payload: response.data
                })
            }
        },error => {
            AppUtils.CONSOLE_LOG("  Error Got Notificationt:")
        })
    } else {
        backend.getAllNotificationGuest(notiIds,
            response => {
                AppUtils.CONSOLE_LOG("  OK Got Notification GUeest:" )
                AppUtils.CONSOLE_LOG(response.data)
                if (response.data && response.data.length > 0) {
                    dispatch({
                        type: USER_GET_APPNOTIFICATION,
                        payload: response.data
                    })
                }
            },error => {
                AppUtils.CONSOLE_LOG("  Error Got Notificationt GUeest:")
                AppUtils.CONSOLE_LOG(error.response)
            })
    }
}

export const actUserSawAllNotifications = () => (dispatch) => {
    dispatch({
        type: USER_SAW_ALL_APPNOTIFICATION,
    })
}

export const actUserGotMyJoinRequest = (data) => (dispatch) => {
    AppUtils.CONSOLE_LOG("  actUserGotMyJoinRequest" )
    dispatch({
        type: USER_GOT_MY_JOINREQUEST,
        payload: data
    })
}


export const actUserSyncPartlyOK = () => (dispatch) => {
    AppUtils.CONSOLE_LOG("  actUserSyncPartlyOK" )
    dispatch({
        type: USER_SYNC_PARTLY_OK,
    })
}

function checkNameExistInServiceModule(arr, value) {
    if (arr && arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].name == value) {
                return i;
            }
        }
    }
    return -1;
}
// Note, in this Reducer, cannot Access state.user
export default function(state = initialState, action) {
    switch (action.type) {
    // case REHYDRATE:
    //     AppUtils.CONSOLE_LOG("HVE JUST LOAD STATE--------------")
    //     let newAA = {...state}; // THis code will Lose all
    //     if (!state.vehicleList) state.vehicleList= [];
    //     return newAA;
    case USER_CREATE_TEAM_OK:
        return {
            ...state,
            teamInfo: action.payload.data,
            userProfile: {...state.userProfile, 
                teamId: action.payload.data.id,
                teamCOde: action.payload.data.code,
                roleInTeam: action.payload.isMember ? "member" : "manager"
            },
            myJoinRequest: {},
        };
    case USER_LEAVE_TEAM_OK:
        let prevStateLeaveTEam = {...state};
        prevStateLeaveTEam.teamInfo= {};
        prevStateLeaveTEam.userProfile.teamId = null;
        prevStateLeaveTEam.userProfile.teamCode = null;
        prevStateLeaveTEam.userProfile.roleInTeam = null;
        prevStateLeaveTEam.myJoinRequest= {};

        return prevStateLeaveTEam;
    case USER_LOGIN_OK:
        return {
            ...state,
            userProfile: action.payload.user,
            token: action.payload.token,
            teamInfo: action.payload.teamInfo,
            myJoinRequest: {},

            notifications: [],

            modifiedInfo: {vehicleIds:[], changedAllVehicles: false, changedCustom: false, changedSetting: false,changedItemCount: 0},
            isLogined: true
        };
    case USER_LOGOUT:
        return {
            ...state,
            userProfile: {},
            isLogined: false,
            token: "",
            teamInfo: {},
            defaultVehicleId: "",
            vehicleList:[],
            carReports:{},
            settings: DEFAULT_SETTING_REMIND,
            settingService: DEFAULT_SETTING_SERVICE,
            //notifications: [], When Logout, No Need clear Notifications
            myJoinRequest: {},
            countNotSeenNoti: 0,
            modalState: 0,

            customServiceModules: [],
            customServiceModulesBike: [],
            customVehicleModel: [],

            modifiedInfo: {vehicleIds:[], changedAllVehicles: false, changedCustom: false, changedSetting: false,changedItemCount: 0},

            lastSyncFromServerOn: null, // date of last sync
            lastSyncToServerOn: null,
        };
    case USER_UPDATEPROFILE_OK:
        let prevStateUpdateProfile = {...state};
        if (action.payload.fullName) {
            prevStateUpdateProfile.userProfile.fullName = action.payload.fullName;
        }
        if (action.payload.phone) {
            prevStateUpdateProfile.userProfile.phone = action.payload.phone;
        }
        if (action.payload.token) {
            prevStateUpdateProfile.token = action.payload.token;
        }
        return prevStateUpdateProfile;
    case VEHICLE_SYNC_FROMSERVER:
        // Process Notification Sync Here 
        let data = action.payload.data;
        let isMergeDataBeforeLogin = action.payload.isMergeDataBeforeLogin;

        // Compare and Merge Vehicle List, if Same ID, use the Server One
        let newVehicleList = data.vehicleList;
        AppUtils.CONSOLE_LOG("&&&&&&&&&&&&&&&&&&&&& newVehicleList:" + newVehicleList.length)
        let modifiedInfo = {vehicleIds:[], changedAllVehicles: false, changedCustom: false, changedSetting: false,changedItemCount: 0};
        if (isMergeDataBeforeLogin) {
            let prevVehicleList = state.vehicleList;
            AppUtils.CONSOLE_LOG("&&&&&&&&&&&&&&&&&&&&& prevVehicleList:" + prevVehicleList.length)
            if (prevVehicleList && prevVehicleList.length > 0) {
                // This mean have Prev data, need Sync to Server
                modifiedInfo = {vehicleIds:[], 
                    changedAllVehicles: true, changedCustom: false, changedSetting: false,changedItemCount: 1};
                prevVehicleList.forEach(item => {
                    // Check if same ID
                    if (newVehicleList && newVehicleList.length > 0) {
                        let isSameID = false;
                        for(let l = 0; l < newVehicleList.length; l++) {
                            if (newVehicleList[l].id == item.id) {
                                // Same ID,
                                isSameID = true;
                                break;
                            }
                        }
                        if (!isSameID) {
                            // Add to new List if not Exist
                            newVehicleList.push(item)
                        }
                    } else {
                        // push new item
                        newVehicleList.push(item)
                    }
                })
            }
        }

        let receivedNotis0 = data.notifications;
        let newNotis0 = [];
        if (receivedNotis0 && receivedNotis0.length > 0) {
            newNotis0 = receivedNotis0;
        }
        newNotis0.sort(function(a, b) {
            let aDate = new Date(a.issueDate);
            let bDate = new Date(b.issueDate);
            // Descending
            return bDate - aDate;
        })

        let syncCustom1 = data.customServiceModules;
        let syncCustom2 = data.customServiceModulesBike;
        let syncCustom3 = data.customVehicleModel;

        let isSaveCustom = false;
        //if (isMergeDataBeforeLogin) {
            // only merge if Server data empty and PhoneData > 0
            if((state.customServiceModules&&state.customServiceModules.length>0) && 
                (!syncCustom1 || syncCustom1.length == 0)) {
                    syncCustom1 = state.customServiceModules;
                    isSaveCustom = true;
            }
            if((state.customServiceModulesBike&&state.customServiceModulesBike.length>0) && 
                (!syncCustom2 || syncCustom2.length == 0)) {
                    syncCustom2 = state.customServiceModulesBike;
                    isSaveCustom = true;
            }
            if((state.customVehicleModel&&state.customVehicleModel.length>0) && 
                (!syncCustom3 || syncCustom3.length == 0)) {
                    syncCustom3 = state.customVehicleModel;
                    isSaveCustom = true;
            }
        //}
        if (isSaveCustom) {
            modifiedInfo.changedCustom = true;
            modifiedInfo.changedItemCount = modifiedInfo.changedItemCount+1;
        }

        let newStateSyncFrom = {
            ...state,
            vehicleList: newVehicleList,
            customServiceModules: syncCustom1,
            customServiceModulesBike: syncCustom2,
            customVehicleModel: syncCustom3,
            settings: data.settings,
            settingService: data.settingService,
            notifications: newNotis0,
            myJoinRequest: data.myJoinRequest,
            countNotSeenNoti: 0,

            isNoAds: data.isNoAds,

            teamInfo: data.teamInfo,

            modifiedInfo: modifiedInfo,

            //carReports: {},// this will be updated during Caluclation,because some may not need to Re-calculate
            lastSyncFromServerOn: new Date()
        }
        if (!newStateSyncFrom.settingService) {
            newStateSyncFrom.settingService = DEFAULT_SETTING_SERVICE;
        }
        

        return newStateSyncFrom;
    case VEHICLE_SYNC_TOSERVER:
        return {
            ...state,
            lastSyncToServerOn: new Date()
        }
    case VEHICLE_ADD:
        var newStateVehicleAdd = {
            ...state,
        };
        if (!newStateVehicleAdd.vehicleList) {
            newStateVehicleAdd.vehicleList = [];
        }
        newStateVehicleAdd.vehicleList = [...newStateVehicleAdd.vehicleList, action.payload]
        
        // Handle if this Vehicle is Default, change all Others
        if (action.payload.isDefault) {
            newStateVehicleAdd.defaultVehicleId = action.payload.id;
            for (let i = 0; i < newStateVehicleAdd.vehicleList.length; i++) {
                if (newStateVehicleAdd.vehicleList[i].id != action.payload.id) {
                    newStateVehicleAdd.vehicleList[i].isDefault = false
                }
            } 
        }

        // All Vehicles should be Updated 
        newStateVehicleAdd.modifiedInfo= {
            ...newStateVehicleAdd.modifiedInfo,
            changedAllVehicles: true,
            changedItemCount: newStateVehicleAdd.modifiedInfo.changedItemCount+1
        }
        return newStateVehicleAdd;
    case VEHICLE_EDIT:
        let newStateVehicle = {...state}
        for (let i = 0; i < newStateVehicle.vehicleList.length; i++) {
            if (newStateVehicle.vehicleList[i].id == action.payload.id) {
                newStateVehicle.vehicleList[i] = {...newStateVehicle.vehicleList[i], ...action.payload}
                break;
            }
        }
        // Handle if this Vehicle is Default, change all Others
        if (action.payload.isDefault) {
            newStateVehicle.defaultVehicleId = action.payload.id;
            for (let i = 0; i < newStateVehicle.vehicleList.length; i++) {
                if (newStateVehicle.vehicleList[i].id != action.payload.id) {
                    newStateVehicle.vehicleList[i].isDefault = false
                }
            } 
        }

        // Information to Sync should be only this vehicle
        // All Vehicles should be Updated 
        let oldIds = newStateVehicle.modifiedInfo.vehicleIds;
        if (oldIds.indexOf(action.payload.id) < 0){
            oldIds.push(action.payload.id)
        }

        newStateVehicle.modifiedInfo= {
            ...newStateVehicle.modifiedInfo,
            vehicleIds: oldIds,
            changedItemCount: newStateVehicle.modifiedInfo.changedItemCount+1
        }

        return newStateVehicle;
    case VEHICLE_DEL:
        // Remove element from array
        let newState = {...state};
        for (let i = 0; i < newState.vehicleList.length; i++) {
            if ((newState.vehicleList[i].id && newState.vehicleList[i].id == action.payload.id)
                    || (newState.vehicleList[i].licensePlate == action.payload.licensePlate)) {
                newState.vehicleList.splice(i, 1);
                break;
            }
        }
        // Remove from carReports
        if (newState.carReports[""+action.payload.id]) {
            delete newState.carReports[""+action.payload.id];
        }

        // All Vehicles should be Updated 
        newState.modifiedInfo= {
            ...newState.modifiedInfo,
            changedAllVehicles: true,
            changedItemCount: newState.modifiedInfo.changedItemCount+1
        }

        return newState;
    case VEHICLE_FILL_GAS_ADD:
        // add to Vehicle 
        let newStateAddGas = {...state};
        for (let i = 0; i < newStateAddGas.vehicleList.length; i++) {
            if (newStateAddGas.vehicleList[i].id == action.payload.vehicleId ) {
                action.payload.fillDate = new Date(action.payload.fillDate)

                newStateAddGas.vehicleList[i].fillGasList = 
                    [...newStateAddGas.vehicleList[i].fillGasList, action.payload];
                    
                newStateAddGas.vehicleList[i].fillGasList.sort(function(a, b) {
                    let aDate = new Date(a.fillDate);
                    let bDate = new Date(b.fillDate);
                    // Ascending
                    return aDate - bDate;
                })

                break;
            }
        }

        // Information to Sync should be only this vehicle
        let oldIdsGas = newStateAddGas.modifiedInfo.vehicleIds;
        if (oldIdsGas.indexOf(action.payload.vehicleId) < 0){
            oldIdsGas.push(action.payload.vehicleId)
        }

        newStateAddGas.modifiedInfo= {
            ...newStateAddGas.modifiedInfo,
            vehicleIds: oldIdsGas,
            changedItemCount: newStateAddGas.modifiedInfo.changedItemCount+1
        }

        return newStateAddGas;
        
    case VEHICLE_FILL_OIL_ADD:
        // add to Vehicle 
        let newStateAddOil = {...state};
        for (let i = 0; i < newStateAddOil.vehicleList.length; i++) {
            if (newStateAddOil.vehicleList[i].id == action.payload.vehicleId ) {
                action.payload.fillDate = new Date(action.payload.fillDate)
                newStateAddOil.vehicleList[i].fillOilList = 
                    [...newStateAddOil.vehicleList[i].fillOilList, action.payload];
                
                newStateAddOil.vehicleList[i].fillOilList.sort(function(a, b) {
                    let aDate = new Date(a.fillDate);
                    let bDate = new Date(b.fillDate);
                    // Ascending
                    return aDate - bDate;
                })
                break;
            }
        }

        // Information to Sync should be only this vehicle
        let oldIdsOil = newStateAddOil.modifiedInfo.vehicleIds;
        if (oldIdsOil.indexOf(action.payload.vehicleId) < 0){
            oldIdsOil.push(action.payload.vehicleId)
        }

        newStateAddOil.modifiedInfo= {
            ...newStateAddOil.modifiedInfo,
            vehicleIds: oldIdsOil,
            changedItemCount: newStateAddOil.modifiedInfo.changedItemCount+1
        }
        
        return newStateAddOil;

    case VEHICLE_CAR_AUTH_ADD:
        // add to Vehicle 
        let newStateAddAuth = {...state};
        for (let i = 0; i < newStateAddAuth.vehicleList.length; i++) {
            if (newStateAddAuth.vehicleList[i].id == action.payload.vehicleId ) {
                action.payload.fillDate = new Date(action.payload.fillDate)
                newStateAddAuth.vehicleList[i].authorizeCarList = 
                    [...newStateAddAuth.vehicleList[i].authorizeCarList, action.payload];
                
                newStateAddAuth.vehicleList[i].authorizeCarList.sort(function(a, b) {
                    let aDate = new Date(a.fillDate);
                    let bDate = new Date(b.fillDate);
                    // Ascending
                    return aDate - bDate;
                })
                break;
            }
        }

        // Information to Sync should be only this vehicle
        let oldIdsAuth = newStateAddAuth.modifiedInfo.vehicleIds;
        if (oldIdsAuth.indexOf(action.payload.vehicleId) < 0){
            oldIdsAuth.push(action.payload.vehicleId)
        }
        

        newStateAddAuth.modifiedInfo= {
            ...newStateAddAuth.modifiedInfo,
            vehicleIds: oldIdsAuth,
            changedItemCount: newStateAddAuth.modifiedInfo.changedItemCount+1
        }

        return newStateAddAuth;
    case VEHICLE_EXPENSE_ADD:
        // add to Vehicle 
        let newStateAddExpense = {...state};
        for (let i = 0; i < newStateAddExpense.vehicleList.length; i++) {
            if (newStateAddExpense.vehicleList[i].id == action.payload.vehicleId ) {
                action.payload.fillDate = new Date(action.payload.fillDate)
                newStateAddExpense.vehicleList[i].expenseList = 
                    [...newStateAddExpense.vehicleList[i].expenseList, action.payload];
                    newStateAddExpense.vehicleList[i].expenseList.sort(function(a, b) {
                    let aDate = new Date(a.fillDate);
                    let bDate = new Date(b.fillDate);
                    // Ascending
                    return aDate - bDate;
                })
                break;
            }
        }

        // Information to Sync should be only this vehicle
        let oldIdsExp = newStateAddExpense.modifiedInfo.vehicleIds;
        if (oldIdsExp.indexOf(action.payload.vehicleId) < 0){
            oldIdsExp.push(action.payload.vehicleId)
        }

        newStateAddExpense.modifiedInfo= {
            ...newStateAddExpense.modifiedInfo,
            vehicleIds: oldIdsExp,
            changedItemCount: newStateAddExpense.modifiedInfo.changedItemCount+1
        }

        return newStateAddExpense;
    case VEHICLE_SERVICE_ADD:
        // add to Vehicle 
        let newStateAddService = {...state};
        for (let i = 0; i < newStateAddService.vehicleList.length; i++) {
            if (newStateAddService.vehicleList[i].id == action.payload.vehicleId ) {
                action.payload.fillDate = new Date(action.payload.fillDate)
                newStateAddService.vehicleList[i].serviceList = 
                    [...newStateAddService.vehicleList[i].serviceList, action.payload];
                    
                newStateAddService.vehicleList[i].serviceList.sort(function(a, b) {
                    let aDate = new Date(a.fillDate);
                    let bDate = new Date(b.fillDate);
                    // Ascending
                    return aDate - bDate;
                })
                break;
            }
        }

        // Information to Sync should be only this vehicle
        let oldIdsService = newStateAddService.modifiedInfo.vehicleIds;
        if (oldIdsService.indexOf(action.payload.vehicleId) < 0){
            oldIdsService.push(action.payload.vehicleId)
        }

        newStateAddService.modifiedInfo= {
            ...newStateAddService.modifiedInfo,
            vehicleIds: oldIdsService,
            changedItemCount: newStateAddService.modifiedInfo.changedItemCount+1
        }

        return newStateAddService;

    case VEHICLE_FILL_GAS_DEL:
        let delState1 = {...state};
        let  findVehicle1 = delState1.vehicleList.find(
            item => item.id == action.payload.vehicleId);
        if (findVehicle1) {
            for (let i = 0; i < findVehicle1.fillGasList.length; i++) {
                if (findVehicle1.fillGasList[i].id == action.payload.itemId) {
                    findVehicle1.fillGasList.splice(i, 1);
                    break;
                }
            }
        }

        // Information to Sync should be only this vehicle
        let oldIdsGasDel = delState1.modifiedInfo.vehicleIds;
        if (oldIdsGasDel.indexOf(action.payload.vehicleId) < 0){
            oldIdsGasDel.push(action.payload.vehicleId)
        }
        delState1.modifiedInfo= {
            ...delState1.modifiedInfo,
            vehicleIds: oldIdsGasDel,
            changedItemCount: delState1.modifiedInfo.changedItemCount+1
        }

        return delState1;

    case VEHICLE_FILL_OIL_DEL:
        let delState2 = {...state};
        let  findVehicle2 = delState2.vehicleList.find(
            item => item.id == action.payload.vehicleId);
        if (findVehicle2) {
            for (let i = 0; i < findVehicle2.fillOilList.length; i++) {
                if (findVehicle2.fillOilList[i].id == action.payload.itemId) {
                    findVehicle2.fillOilList.splice(i, 1);
                    break;
                }
            }
        }
        // Information to Sync should be only this vehicle
        let oldIdsOilDel = delState2.modifiedInfo.vehicleIds;
        if (oldIdsOilDel.indexOf(action.payload.vehicleId) < 0){
            oldIdsOilDel.push(action.payload.vehicleId)
        }
        delState2.modifiedInfo= {
            ...delState2.modifiedInfo,
            vehicleIds: oldIdsOilDel,
            changedItemCount: delState2.modifiedInfo.changedItemCount+1
        }

        return delState2;

    case VEHICLE_CAR_AUTH_DEL:
        let delState3 = {...state};
        let  findVehicle3 = delState3.vehicleList.find(
            item => item.id == action.payload.vehicleId);
        if (findVehicle3) {
            for (let i = 0; i < findVehicle3.authorizeCarList.length; i++) {
                if (findVehicle3.authorizeCarList[i].id == action.payload.itemId) {
                    findVehicle3.authorizeCarList.splice(i, 1);
                    break;
                }
            }
        }

        // Information to Sync should be only this vehicle
        let oldIdsAuthDel = delState3.modifiedInfo.vehicleIds;
        if (oldIdsAuthDel.indexOf(action.payload.vehicleId) < 0){
            oldIdsAuthDel.push(action.payload.vehicleId)
        }
        delState3.modifiedInfo= {
            ...delState3.modifiedInfo,
            vehicleIds: oldIdsAuthDel,
            changedItemCount: delState3.modifiedInfo.changedItemCount+1
        }

        return delState3;

    case VEHICLE_FILL_GAS_EDIT:
        let newStateVehicleGasEdit = {...state}
        for (let i = 0; i < newStateVehicleGasEdit.vehicleList.length; i++) {
            if (newStateVehicleGasEdit.vehicleList[i].id == action.payload.vehicleId ) {
                for (let j = 0; j < newStateVehicleGasEdit.vehicleList[i].fillGasList.length; j++) {
                    if (newStateVehicleGasEdit.vehicleList[i].fillGasList[j].id == action.payload.id) {
                        action.payload.fillDate = new Date(action.payload.fillDate)
                        newStateVehicleGasEdit.vehicleList[i].fillGasList[j] = {...action.payload}

                        newStateVehicleGasEdit.vehicleList[i].fillGasList.sort(function(a, b) {
                            let aDate = new Date(a.fillDate);
                            let bDate = new Date(b.fillDate);
                            // Ascending
                            return aDate - bDate;
                        })
                        break;
                    }
                }
            }
        }

        // Information to Sync should be only this vehicle
        let oldIdsGasEdit= newStateVehicleGasEdit.modifiedInfo.vehicleIds;
        if (oldIdsGasEdit.indexOf(action.payload.vehicleId) < 0){
            oldIdsGasEdit.push(action.payload.vehicleId)
        }
        newStateVehicleGasEdit.modifiedInfo= {
            ...newStateVehicleGasEdit.modifiedInfo,
            vehicleIds: oldIdsGasEdit,
            changedItemCount: newStateVehicleGasEdit.modifiedInfo.changedItemCount+1
        }

        return newStateVehicleGasEdit;
    case VEHICLE_FILL_OIL_EDIT:
        let newStateVehicleOilEdit = {...state}
        for (let i = 0; i < newStateVehicleOilEdit.vehicleList.length; i++) {
            if (newStateVehicleOilEdit.vehicleList[i].id == action.payload.vehicleId ) {
                for (let j = 0; j < newStateVehicleOilEdit.vehicleList[i].fillOilList.length; j++) {
                    if (newStateVehicleOilEdit.vehicleList[i].fillOilList[j].id == action.payload.id) {
                        action.payload.fillDate = new Date(action.payload.fillDate)
                        newStateVehicleOilEdit.vehicleList[i].fillOilList[j] = {...action.payload}

                        newStateVehicleOilEdit.vehicleList[i].fillOilList.sort(function(a, b) {
                            let aDate = new Date(a.fillDate);
                            let bDate = new Date(b.fillDate);
                            // Ascending
                            return aDate - bDate;
                        })
                        break;
                    }
                }
            }
        }

        // Information to Sync should be only this vehicle
        let oldIdsOilEdit= newStateVehicleOilEdit.modifiedInfo.vehicleIds;
        if (oldIdsOilEdit.indexOf(action.payload.vehicleId) < 0){
            oldIdsOilEdit.push(action.payload.vehicleId)
        }
        newStateVehicleOilEdit.modifiedInfo= {
            ...newStateVehicleOilEdit.modifiedInfo,
            vehicleIds: oldIdsOilEdit,
            changedItemCount: newStateVehicleOilEdit.modifiedInfo.changedItemCount+1
        }

        return newStateVehicleOilEdit;
    case VEHICLE_CAR_AUTH_EDIT:
        let newStateVehicleAuthEdit = {...state}
        for (let i = 0; i < newStateVehicleAuthEdit.vehicleList.length; i++) {
            if (newStateVehicleAuthEdit.vehicleList[i].id == action.payload.vehicleId ) {
                for (let k = 0; k < newStateVehicleAuthEdit.vehicleList[i].authorizeCarList.length; k++) {
                    if (newStateVehicleAuthEdit.vehicleList[i].authorizeCarList[k].id == action.payload.id) {
                        action.payload.fillDate = new Date(action.payload.fillDate)
                        newStateVehicleAuthEdit.vehicleList[i].authorizeCarList[k] = {...action.payload}

                        newStateVehicleAuthEdit.vehicleList[i].authorizeCarList.sort(function(a, b) {
                            let aDate = new Date(a.fillDate);
                            let bDate = new Date(b.fillDate);
                            // Ascending
                            return aDate - bDate;
                        })
                        break;
                    }
                }
            }
        }
        // Information to Sync should be only this vehicle
        let oldIdsAuthEdit= newStateVehicleAuthEdit.modifiedInfo.vehicleIds;
        if (oldIdsAuthEdit.indexOf(action.payload.vehicleId) < 0){
            oldIdsAuthEdit.push(action.payload.vehicleId)
        }
        newStateVehicleAuthEdit.modifiedInfo= {
            ...newStateVehicleAuthEdit.modifiedInfo,
            vehicleIds: oldIdsAuthEdit,
            changedItemCount: newStateVehicleAuthEdit.modifiedInfo.changedItemCount+1
        }
        return newStateVehicleAuthEdit;
    
    case VEHICLE_EXPENSE_DEL:
        let delState4 = {...state};
        let  findVehicle4 = delState4.vehicleList.find(
            item => item.id == action.payload.vehicleId);
        if (findVehicle4) {
            for (let i = 0; i < findVehicle4.expenseList.length; i++) {
                if (findVehicle4.expenseList[i].id == action.payload.itemId) {
                    findVehicle4.expenseList.splice(i, 1);
                    break;
                }
            }
        }
        // Information to Sync should be only this vehicle
        let oldIdsExpDel= delState4.modifiedInfo.vehicleIds;
        if (oldIdsExpDel.indexOf(action.payload.vehicleId) < 0){
            oldIdsExpDel.push(action.payload.vehicleId)
        }
        delState4.modifiedInfo= {
            ...delState4.modifiedInfo,
            vehicleIds: oldIdsExpDel,
            changedItemCount: delState4.modifiedInfo.changedItemCount+1
        }
        return delState4;
    case VEHICLE_EXPENSE_EDIT:
        let newStateVehicleExpenseEdit = {...state}
        for (let i = 0; i < newStateVehicleExpenseEdit.vehicleList.length; i++) {
            if (newStateVehicleExpenseEdit.vehicleList[i].id == action.payload.vehicleId ) {
                for (let k = 0; k < newStateVehicleExpenseEdit.vehicleList[i].expenseList.length; k++) {
                    if (newStateVehicleExpenseEdit.vehicleList[i].expenseList[k].id == action.payload.id) {
                        action.payload.fillDate = new Date(action.payload.fillDate)
                        newStateVehicleExpenseEdit.vehicleList[i].expenseList[k] = {...action.payload}

                        newStateVehicleExpenseEdit.vehicleList[i].expenseList.sort(function(a, b) {
                            let aDate = new Date(a.fillDate);
                            let bDate = new Date(b.fillDate);
                            // Ascending
                            return aDate - bDate;
                        })
                        break;
                    }
                }
            }
        }
        // Information to Sync should be only this vehicle
        let oldIdsExpEdit= newStateVehicleExpenseEdit.modifiedInfo.vehicleIds;
        if (oldIdsExpEdit.indexOf(action.payload.vehicleId) < 0){
            oldIdsExpEdit.push(action.payload.vehicleId)
        }
        newStateVehicleExpenseEdit.modifiedInfo= {
            ...newStateVehicleExpenseEdit.modifiedInfo,
            vehicleIds: oldIdsExpEdit,
            changedItemCount: newStateVehicleExpenseEdit.modifiedInfo.changedItemCount+1
        }
        return newStateVehicleExpenseEdit;

    case VEHICLE_SERVICE_DEL:
        let delState5 = {...state};
        let  findVehicle5 = delState5.vehicleList.find(
            item => item.id == action.payload.vehicleId);
        if (findVehicle5) {
            for (let i = 0; i < findVehicle5.serviceList.length; i++) {
                if (findVehicle5.serviceList[i].id == action.payload.itemId) {
                    findVehicle5.serviceList.splice(i, 1);
                    break;
                }
            }
        }
        // Information to Sync should be only this vehicle
        let oldIdsServiceDel= delState5.modifiedInfo.vehicleIds;
        if (oldIdsServiceDel.indexOf(action.payload.vehicleId) < 0){
            oldIdsServiceDel.push(action.payload.vehicleId)
        }
        delState5.modifiedInfo= {
            ...delState5.modifiedInfo,
            vehicleIds: oldIdsServiceDel,
            changedItemCount: delState5.modifiedInfo.changedItemCount+1
        }
        return delState5;

    case VEHICLE_SERVICE_EDIT:
        let newStateVehicleServiceEdit = {...state}
        for (let i = 0; i < newStateVehicleServiceEdit.vehicleList.length; i++) {
            if (newStateVehicleServiceEdit.vehicleList[i].id == action.payload.vehicleId ) {
                for (let k = 0; k < newStateVehicleServiceEdit.vehicleList[i].serviceList.length; k++) {
                    if (newStateVehicleServiceEdit.vehicleList[i].serviceList[k].id == action.payload.id) {
                        action.payload.fillDate = new Date(action.payload.fillDate)
                        newStateVehicleServiceEdit.vehicleList[i].serviceList[k] = {...action.payload}

                        newStateVehicleServiceEdit.vehicleList[i].serviceList.sort(function(a, b) {
                            let aDate = new Date(a.fillDate);
                            let bDate = new Date(b.fillDate);
                            // Ascending
                            return aDate - bDate;
                        })
                        break;
                    }
                }
            }
        }
        // Information to Sync should be only this vehicle
        let oldIdsServiceEdit= newStateVehicleServiceEdit.modifiedInfo.vehicleIds;
        if (oldIdsServiceEdit.indexOf(action.payload.vehicleId) < 0){
            oldIdsServiceEdit.push(action.payload.vehicleId)
        }
        newStateVehicleServiceEdit.modifiedInfo= {
            ...newStateVehicleServiceEdit.modifiedInfo,
            vehicleIds: oldIdsServiceEdit,
            changedItemCount: newStateVehicleServiceEdit.modifiedInfo.changedItemCount+1
        }
        return newStateVehicleServiceEdit;

    case USER_SYNC_PARTLY_OK:
        // user partly done, reset
        return {
            ...state,
            modifiedInfo: {vehicleIds:[], changedAllVehicles: false, changedCustom: false, changedSetting: false,changedItemCount: 0},
            lastSyncToServerOn: new Date()
        };
    case TEMP_CALCULATE_CARREPORT:
        let newStateCarReport = {
            ...state,
        };
        newStateCarReport.carReports[""+action.payload.id] = action.payload.data

        return newStateCarReport;
    case TEMP_CALCULATE_CARREPORT_ALL:
        let newStateCarReportAll = {
            ...state,
        };
        newStateCarReportAll.carReports = action.payload
        newStateCarReportAll.modalState = (newStateCarReportAll.modalState-1 >= 0) ? (newStateCarReportAll.modalState-1) : 0

        return newStateCarReportAll;

    case SETTING_REMIND:
        let settingRemindOld = {...state};

        settingRemindOld.settings = action.payload;

        // Information to Sync should be only this vehicle
        settingRemindOld.modifiedInfo= {
            ...settingRemindOld.modifiedInfo,
            changedSetting: true,
            changedItemCount: settingRemindOld.modifiedInfo.changedItemCount+1
        }

        return settingRemindOld;

    case SETTING_MAINTAIN_TYPE:
        let settingMaintain = {...state};

        settingMaintain.settingService = action.payload;

        // Information to Sync should be only this vehicle
        settingMaintain.modifiedInfo= {
            ...settingMaintain.modifiedInfo,
            changedSetting: true,
            changedItemCount: settingMaintain.modifiedInfo.changedItemCount+1
        }

        return settingMaintain;

    case CUSTOM_ADD_SERVICEMODULE:
        let prevStateService = {...state};
        if ( !prevStateService.customServiceModules ) {
            prevStateService.customServiceModules = [];
        }
        let idxa0 = checkNameExistInServiceModule(prevStateService.customServiceModules, 
            action.payload.name);
        if ( idxa0 < 0) {
            // when not exist, add
            prevStateService.customServiceModules.push(action.payload)
        }

        // Information to Sync should be only this vehicle
        prevStateService.modifiedInfo= {
            ...prevStateService.modifiedInfo,
            changedCustom: true,
            changedItemCount: prevStateService.modifiedInfo.changedItemCount+1
        }

        return prevStateService;
    case CUSTOM_ADD_SERVICEMODULE_BIKE:
        let prevStateServiceBike = {...state};
        if ( !prevStateServiceBike.customServiceModulesBike ) {
            prevStateServiceBike.customServiceModulesBike = [];
        }
        let idxa1 = checkNameExistInServiceModule(prevStateServiceBike.customServiceModulesBike, 
            action.payload.name);
        if ( idxa1 < 0) {
            // when not exist, add
            prevStateServiceBike.customServiceModulesBike.push(action.payload)
        }

        // Information to Sync should be only this vehicle
        prevStateServiceBike.modifiedInfo= {
            ...prevStateServiceBike.modifiedInfo,
            changedCustom: true,
            changedItemCount: prevStateServiceBike.modifiedInfo.changedItemCount+1
        }

        return prevStateServiceBike;
    case CUSTOM_DEL_SERVICEMODULE:
        let prevStateServiceDel = {...state};
        if ( !prevStateServiceDel.customServiceModules ) {
            prevStateServiceDel.customServiceModules = [];
        }
        let idx = checkNameExistInServiceModule(prevStateService.customServiceModules, 
            action.payload.name);
        if ( idx >= 0) {
            prevStateServiceDel.customServiceModules.splice(idx, 1);
        }

        prevStateServiceDel.modifiedInfo= {
            ...prevStateServiceDel.modifiedInfo,
            changedCustom: true,
            changedItemCount: prevStateServiceDel.modifiedInfo.changedItemCount+1
        }

        return prevStateServiceDel;
    case CUSTOM_DEL_SERVICEMODULE_BIKE:
        let prevStateServiceDelBike = {...state};
        if ( !prevStateServiceDelBike.customServiceModulesBike ) {
            prevStateServiceDelBike.customServiceModulesBike = [];
        }
        let idx2 = checkNameExistInServiceModule(prevStateServiceDelBike.customServiceModulesBike, 
            action.payload.name);
        if ( idx2 >= 0) {
            prevStateServiceDelBike.customServiceModulesBike.splice(idx2, 1);
        }

        prevStateServiceDelBike.modifiedInfo= {
            ...prevStateServiceDelBike.modifiedInfo,
            changedCustom: true,
            changedItemCount: prevStateServiceDelBike.modifiedInfo.changedItemCount+1
        }

        return prevStateServiceDelBike;

    case USER_SET_MAX_METER:
        let prevStateSetMeter = {...state};
        for (let i = 0; i < prevStateSetMeter.vehicleList.length; i++) {
            if (prevStateSetMeter.vehicleList[i].id == action.payload.vehicleId ) {
                prevStateSetMeter.vehicleList[i].maxMeter = action.payload.maxMeter;

                break;
            }
        }
        return prevStateSetMeter;
    case USER_CREATE_VEHICLEMODEL:
        //action.payload: {type, brand, model}
        //customVehicleModel: [],//[{ id:!=0,name, type:"car|bike",models: [{"id":!=0,"name":"Juke"}]]
        let prevStateNewModel = {...state};
        let foundInBrand = false;
        if (!prevStateNewModel.customVehicleModel) {
            prevStateNewModel.customVehicleModel = [];
        }

        prevStateNewModel.customVehicleModel.forEach(item => {
            // if same brand and type
            if (item.type == action.payload.type && item.name == action.payload.brand) {
                foundInBrand = true;
                // Exist, check to add new Model
                let modelExist = false;
                item.models.forEach(m => {
                    if (m.name == action.payload.model) {
                        modelExist = true;
                    }
                })
                if (!modelExist) {
                    item.models.push({id: 100, name: action.payload.model})
                }
            }
        })
        if (!foundInBrand) {
            prevStateNewModel.customVehicleModel.push({
                id: 100, name: action.payload.brand, type: action.payload.type,
                models: [{id: 100, name: action.payload.model}]
            })
        }
        prevStateNewModel.modifiedInfo= {
            ...prevStateNewModel.modifiedInfo,
            changedCustom: true,
            changedItemCount: prevStateNewModel.modifiedInfo.changedItemCount+1
        }

        return prevStateNewModel;
    case USER_DEL_VEHICLEMODEL:
        //data: {brand, model, isBike}
        let prevStateDelModel = {...state};
        let type = "car";
        if (action.payload.isBike) {
            type = "bike";
        }
        AppUtils.CONSOLE_LOG("DELETEEEEE")
        AppUtils.CONSOLE_LOG(action.payload)

        if (!prevStateDelModel.customVehicleModel) {
            prevStateDelModel.customVehicleModel = [];
        }

        let brandIdx = -1;
        prevStateDelModel.customVehicleModel.forEach((item, bidx) => {
            // if same brand and type
            if (item.type == type && item.name == action.payload.brand) {
                AppUtils.CONSOLE_LOG("  FOund BRAND")
                // Exist, check to add new Model
                for (let idx = 0; idx < item.models.length; idx++) {
                    let m = item.models[idx];
                    if (m.name == action.payload.model) {
                        item.models.splice(idx, 1);
                        break;
                    }
                }
                if (item.models.length == 0) {
                    brandIdx = bidx;
                }
            }
        })
        // if empty models, delete
        if (brandIdx != -1) {
            prevStateDelModel.customVehicleModel.splice(brandIdx, 1);
        }
        prevStateDelModel.modifiedInfo= {
            ...prevStateDelModel.modifiedInfo,
            changedCustom: true,
            changedItemCount: prevStateDelModel.modifiedInfo.changedItemCount+1
        }

        return prevStateDelModel;
        
    case USER_GET_APPNOTIFICATION:
        let prevNotis = state.notifications;
        if (!prevNotis) {
            prevNotis = [];
        }
        // add to notifications list if not exist ID
        let receivedNotis = action.payload;
        AppUtils.CONSOLE_LOG("USER_GET_APPNOTIFICATION:" + receivedNotis.length)
        let newNotis = [...prevNotis];
        let isHaveNew = false;
        let countNotSeenNoti = 0;
        receivedNotis.forEach (item => {
            let existedItem = prevNotis.find(noti => noti.id == item.id);
            if (!existedItem) {
                isHaveNew = true;
                // Not Exist, Add
                // New Item is not Seen
                item.notSeen = true;
                countNotSeenNoti++;

                newNotis.unshift(item);
            }
        })
        // Sort by Time
        if (isHaveNew) {
            newNotis.sort(function(a, b) {
                let aDate = new Date(a.issueDate);
                let bDate = new Date(b.issueDate);
                // Descending
                return bDate - aDate;
            })
        }
        // AppUtils.CONSOLE_LOG("  FInal Notifications")
        // AppUtils.CONSOLE_LOG(newNotis)

        return {
            ...state,
            notifications: newNotis,
            countNotSeenNoti: countNotSeenNoti
        }
    case USER_SAW_ALL_APPNOTIFICATION:
        AppUtils.CONSOLE_LOG("USER_SAW_ALL_APPNOTIFICATION")
        let prevNotis2 = state.notifications;
        if (!prevNotis2) {
            prevNotis2 = [];
        }
        let newNotis2 = [...prevNotis2];
        newNotis2.forEach(item => {
            item.notSeen = false;
        })
        return {
            ...state,
            notifications: newNotis2,
            countNotSeenNoti: 0
        }
    case USER_GOT_MY_JOINREQUEST:
        return {
            ...state,
            myJoinRequest: action.payload
        }

    case USER_SYNC_PRIVATE_START:
        return {
            ...state,
            modalState: 1
        }
    case USER_SYNC_PRIVATE_DONE:
        return {
            ...state,
            modalState: (state.modalState-1 >= 0) ? (state.modalState-1) : 0
        }
    case USER_SYNC_TEAM_START:
        return {
            ...state,
            modalState: state.modalState+1
        }
    case USER_SYNC_TEAM_DONE:
        return {
            ...state,
            modalState: (state.modalState-1 >= 0) ? (state.modalState-1) : 0
        }
    case USER_INIT_DATA:
        return {
            ...state,
            modalState: 0
        }
    case USER_FORCE_CLOSE_MODAL:
        return {
            ...state,
            modalState: 0
        }
    default:
        return state;
    }
}
