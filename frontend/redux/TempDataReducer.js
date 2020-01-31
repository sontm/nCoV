
import AppUtils from '../constants/AppUtils'
import AppConstants from '../constants/AppConstants';
const TEMP_CALCULATE_CARREPORT = 'TEMP_CALCULATE_CARREPORT';
const TEMP_CALCULATE_TEAMCARREPORT = 'TEMP_CALCULATE_TEAMCARREPORT';
const TEMP_CAR_LIST = 'TEMP_CAR_LIST';
const initialState = {
    carReports:{}, // {id: {gasReport,oilReport,authReport,moneyReport}}
    teamCarList:[],
    teamCarReports: {}
};

async function actTempCalculateCarReportAsync(currentVehicle, options) {
    return new Promise((resolve, reject) => {
        if ( !options ) {
            // Default
            options = {
                durationType: "month",
                tillDate: new Date(),
                duration: 12,
            }
        }

        //let {lastDate, lastKm, averageKmPerDay} = AppUtils.getLastDateAndKmFromGas(currentVehicle.fillGasList);
        let {averageKmPerLiter, averageMoneyPerLiter, averageMoneyPerDay, averageKmPerDay, averageMoneyPerKmPerDay, lastDate, lastKm,
            arrMoneyPerWeek, arrKmPerWeek, totalMoneyGas, arrTotalKmMonthly, arrTotalMoneyMonthly, arrTotalMoneyPerKmMonthly,
            avgKmMonthly, avgMoneyMonthly, avgMoneyPerKmMonthly}
            = AppUtils.getStatForGasUsage(currentVehicle.fillGasList, 
                options.duration, options.durationType, options.tillDate);

        let {lastKmOil, lastDateOil, totalMoneyOil, passedKmFromPreviousOil, nextEstimateDateForOil}
            = AppUtils.getInfoForOilUsage(currentVehicle.fillOilList, 
                lastDate, lastKm, averageKmPerDay);
        let {diffDayFromLastAuthorize, nextAuthorizeDate, totalMoneyAuthorize, lastAuthDaysValidFor,
            diffDayFromLastAuthorizeInsurance, nextAuthorizeDateInsurance, lastAuthDaysValidForInsurance,
            diffDayFromLastAuthorizeRoadFee, nextAuthorizeDateRoadFee, lastAuthDaysValidForRoadFee}
            = AppUtils.getInfoCarAuthorizeDate(currentVehicle.authorizeCarList)

        let {arrGasSpend, arrOilSpend, arrAuthSpend, arrExpenseSpend, arrServiceSpend, arrTotalMoneySpend}
            = AppUtils.getInfoMoneySpendByTime(currentVehicle);

        let {totalGasSpend, totalOilSpend, totalAuthSpend, totalExpenseSpend, totalServiceSpend}
            = AppUtils.getInfoMoneySpend(currentVehicle);
        
        let {arrExpenseTypeSpend, arrExpenseTypeByTime} = AppUtils.getInfoMoneySpendInExpense(currentVehicle.expenseList);

        let result = {
            gasReport: {averageKmPerLiter, averageMoneyPerLiter, averageMoneyPerDay, averageKmPerDay, averageMoneyPerKmPerDay, lastDate, lastKm,
                arrMoneyPerWeek, arrKmPerWeek, totalMoneyGas, arrTotalKmMonthly, arrTotalMoneyMonthly, arrTotalMoneyPerKmMonthly,
                avgKmMonthly, avgMoneyMonthly, avgMoneyPerKmMonthly},
            oilReport: {lastKmOil, lastDateOil, totalMoneyOil, passedKmFromPreviousOil, nextEstimateDateForOil},
            authReport: {diffDayFromLastAuthorize, nextAuthorizeDate, totalMoneyAuthorize},
            moneyReport: {arrGasSpend, arrOilSpend, arrAuthSpend, arrExpenseSpend, arrServiceSpend,arrTotalMoneySpend,
                totalGasSpend, totalOilSpend, totalAuthSpend, totalExpenseSpend, totalServiceSpend},
            expenseReport: {arrExpenseTypeSpend, arrExpenseTypeByTime}
        }
        resolve(result)
    });
}
export const actTempCalculateCarReport = (currentVehicle, options, prevTempData) => (dispatch) => {
    // If Report of this Vehicle already Exist, and Is not FOrce, no need to Re-calculate
    if (!prevTempData.carReports[currentVehicle.id] || 
            AppConstants.BUFFER_NEED_RECALCULATE_VEHICLE_ID.indexOf(currentVehicle.id) >= 0) {
        AppUtils.CONSOLE_LOG(">>>actTempCalculateCarReport Team:")
        let theIdx = AppConstants.BUFFER_NEED_RECALCULATE_VEHICLE_ID.indexOf(currentVehicle.id);
        actTempCalculateCarReportAsync(currentVehicle, options)
        .then (result => {
            AppUtils.CONSOLE_LOG("<<<actTempCalculateCarReport FINISH")
            AppConstants.BUFFER_NEED_RECALCULATE_VEHICLE_ID.splice(theIdx, 1);
            dispatch({
                type: TEMP_CALCULATE_CARREPORT,
                payload: {id: currentVehicle.id, data: result}
            })
        })
        .catch (error => {
            AppUtils.CONSOLE_LOG(error)
        })
    }
}

export const actTempCalculateTeamCarReport = (currentVehicle, dispatch) => {
    // If Report of this Vehicle already Exist, and Is not FOrce, no need to Re-calculate
    AppUtils.CONSOLE_LOG("actTempCalculateTeamCarReport cALEED WITH:" + currentVehicle.id)
    actTempCalculateCarReportAsync(currentVehicle)
    .then (result => {
        dispatch({
            type: TEMP_CALCULATE_TEAMCARREPORT,
            payload: {id: currentVehicle.id, data: result}
        })
    })
    .catch (error => {
        AppUtils.CONSOLE_LOG(error)
    })

}

export const actTempSetTeamCarList = (list, dispatch) =>  {
    // If Report of this Vehicle already Exist, and Is not FOrce, no need to Re-calculate
    AppUtils.CONSOLE_LOG("actTempSetTeamCarListcalled with---------------")
    dispatch({
        type: TEMP_CAR_LIST,
        payload: list
    })

}

// Note, in this Reducer, cannot Access state.user
export default function(state = initialState, action) {
    switch (action.type) {
    case TEMP_CALCULATE_CARREPORT:

        let newState = {
            ...state,
        };
        newState.carReports[""+action.payload.id] = action.payload.data

        return newState;
    case TEMP_CALCULATE_TEAMCARREPORT:
        let newStateTeam = {
            ...state,
        };
        newStateTeam.teamCarReports[""+action.payload.id] = action.payload.data

        return newStateTeam;
    case TEMP_CAR_LIST:
        return {
            ...state,
            teamCarList: action.payload
        }
    default:
        return state;
    }
}
