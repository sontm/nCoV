import { REHYDRATE } from 'redux-persist';
import backend from '../constants/Backend';
import apputils from '../constants/AppUtils';
import AppConstants from '../constants/AppConstants';
const APPDATA_OPEN_COUNT = 'APPDATA_OPEN_COUNT';
const APPDATA_SYNC_LATEST = 'APPDATA_SYNC_LATEST';

const initialState = {
    ncov:AppConstants.NCOV_DATA,
    appDataLatestOn: null,
    countOpen: 0
};

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
        if (true || (response.data.updatedOn &&  new Date(prevAppData.appDataLatestOn).getTime() < new Date(response.data.updatedOn).getTime())) {
            apputils.CONSOLE_LOG("-----Need Update App Data ")
            // Need Update latest AppData here
            backend.getLatestAppData(
            response2 => {
                apputils.CONSOLE_LOG(response2.data)
                dispatch({
                    type: APPDATA_SYNC_LATEST,
                    payload: {data: response2.data.nCoV, updatedOn: response.data.updatedOn}
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
            ncov: action.payload.data
        };
    default:
        return state;
    }
}
