import axios from 'axios';
import {AsyncStorage} from 'react-native';
import AppConstants from './AppConstants';
import { connect } from 'react-redux';

function BE_CONSOLE_LOG(text) {
    if (AppConstants.IS_DEBUG_MODE) {
        console.log(text)
    }
}

class Backend {
    constructor() {
    }
    createHeader(token) {
        if (token && token.length > 15) { // TODO carefull with this 15 length of token
            var headers = {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Credentials':true,
                            'APIKEY': 'S1E9C9R0E0T5K0E7Y-qlx',
                            'Authorization': 'Bearer ' + token
                        };
        } else {
            var headers = {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials':true,
                'APIKEY': 'S1E9C9R0E0T5K0E7Y-qlx',
            };
        }
        return headers;
    }

    postSomeDataToServer(data, token, onOK, onError) {
        BE_CONSOLE_LOG("Backend postSomeDataToServer:")
        BE_CONSOLE_LOG(data)
        axios.post("/users/sync/some",
            JSON.stringify(data),
            { headers: this.createHeader(token)})
            .then((response) => {onOK(response);})
            .catch((error) => {onError(error);});
    }

    // Gas, Oil, Auth, Expense, Service List
    // token is JWT token
    postFillItemList(data, token, type, onOK, onError) {
        BE_CONSOLE_LOG("Backend sync to Server:" + token)
        BE_CONSOLE_LOG(data)
        axios.post("/users/sync",
            JSON.stringify(data),
            { headers: this.createHeader(token)})
            .then((response) => {onOK(response);})
            .catch((error) => {onError(error);});
    }

    getAllItemList(token, onOK, onError) {
        axios.get("/users/sync",
            { headers: this.createHeader(token)})
            .then((response) => {onOK(response);})
            .catch((error) => {onError(error);});
    }

    // USER---------------------------------------
    login({email, password}, onOK, onError) {
        axios.post("/login",
            JSON.stringify({'email': email, 'password': password}),
           // { headers: this.createHeader(), withCredentials: true})
            { headers: this.createHeader(),})
            .then((response) => {onOK(response);})
            .catch((error) => {onError(error);});
    }
    registerUser(data, onOK, onError) {
        axios.post("/users",
            JSON.stringify(data),
           // { headers: this.createHeader(), withCredentials: true})
            { headers: this.createHeader(),})
            .then((response) => {onOK(response);})
            .catch((error) => {onError(error);});
    }
    updateUserProfile(data, token, onOK, onError) {
        axios.post("/users/update",
            JSON.stringify(data),
           // { headers: this.createHeader(), withCredentials: true})
            { headers: this.createHeader(token),})
            .then((response) => {onOK(response);})
            .catch((error) => {onError(error);});
    }

    loginGoogle(data, onOK, onError) {
        BE_CONSOLE_LOG("Backend, send data")
        BE_CONSOLE_LOG((data))
        axios.post("/login/google",
            JSON.stringify(data),
           // { headers: this.createHeader(), withCredentials: true})
            { headers: this.createHeader()})
            .then((response) => {onOK(response);})
            .catch((error) => {onError(error);});
    }
    loginFacebook(data, onOK, onError) {
        BE_CONSOLE_LOG("Backend, send data Facebook")
        BE_CONSOLE_LOG((data))
        axios.post("/login/facebook",
            JSON.stringify(data),
           // { headers: this.createHeader(), withCredentials: true})
            { headers: this.createHeader()})
            .then((response) => {onOK(response);})
            .catch((error) => {onError(error);});
    }
    requestResetPwd(data, onOK, onError) {
        axios.post("/app/recovermail",
            JSON.stringify(data),
           // { headers: this.createHeader(), withCredentials: true})
            { headers: this.createHeader(),})
            .then((response) => {onOK(response);})
            .catch((error) => {onError(error);});
    }
    // ------------------ data: {teamId}
    getAllUserOfTeam(data, token, onOK, onError) {
        axios.post("/team/users",
            JSON.stringify(data),
           // { headers: this.createHeader(), withCredentials: true})
            { headers: this.createHeader(token),})
            .then((response) => {onOK(response);})
            .catch((error) => {onError(error);});
    }

    createTeam(data, token, onOK, onError) {
        axios.post("/team",
            JSON.stringify(data),
           // { headers: this.createHeader(), withCredentials: true})
            { headers: this.createHeader(token),})
            .then((response) => {onOK(response);})
            .catch((error) => {onError(error);});
    }
    joinTeam(data, token, onOK, onError) {
        axios.post("/team/join",
            JSON.stringify(data),
           // { headers: this.createHeader(), withCredentials: true})
            { headers: this.createHeader(token),})
            .then((response) => {onOK(response);})
            .catch((error) => {onError(error);});
    }
    rejoinTeam(data, token, onOK, onError) {
        axios.post("/team/rejointeam",
            JSON.stringify(data),
           // { headers: this.createHeader(), withCredentials: true})
            { headers: this.createHeader(token),})
            .then((response) => {onOK(response);})
            .catch((error) => {onError(error);});
    }

    leaveTeam(token, onOK, onError) {
        axios.get("/team/leave",
           // { headers: this.createHeader(), withCredentials: true})
            { headers: this.createHeader(token),})
            .then((response) => {onOK(response);})
            .catch((error) => {onError(error);});
    }
    getTeamsCreatedByMe(token, onOK, onError) {
        axios.get("/team/createdbyme",
           // { headers: this.createHeader(), withCredentials: true})
            { headers: this.createHeader(token),})
            .then((response) => {onOK(response);})
            .catch((error) => {onError(error);});
    }
    // get join request to my team
    getAllJoinTeamRequest(token, onOK, onError) {
        axios.get("/team/join",
           // { headers: this.createHeader(), withCredentials: true})
            { headers: this.createHeader(token),})
            .then((response) => {onOK(response);})
            .catch((error) => {onError(error);});
    }
    getLatestTeamInfoOfMe(token, onOK, onError) {
        axios.get("/team/latest",
           // { headers: this.createHeader(), withCredentials: true})
            { headers: this.createHeader(token),})
            .then((response) => {onOK(response);})
            .catch((error) => {onError(error);});
    }
    // get my join request and status to other team
    // if id is not NULL,, set it
    getMyJoinRequest(token, id, onOK, onError) {
        let str = "/team/request/mine";
        if (id) {
            str+= "/"+id;
        }
        axios.get(str,
           // { headers: this.createHeader(), withCredentials: true})
            { headers: this.createHeader(token),})
            .then((response) => {onOK(response);})
            .catch((error) => {onError(error);});
    }
    // Cancel My Join Request
    cancelMyJoinRequest(token, onOK, onError) {
        axios.post("/team/request/cancel",null,
           // { headers: this.createHeader(), withCredentials: true})
            { headers: this.createHeader(token),})
            .then((response) => {onOK(response);})
            .catch((error) => {onError(error);});
    }

    approveOrRejectJoinRequest(data, token, onOK, onError) {
        axios.post("/team/join/action",
            JSON.stringify(data),
           // { headers: this.createHeader(), withCredentials: true})
            { headers: this.createHeader(token),})
            .then((response) => {onOK(response);})
            .catch((error) => {onError(error);});
    }

    // data: teamId, userId
    removeMemFromTeam(data, token, onOK, onError) {
        axios.post("/team/join/remove",
            JSON.stringify(data),
           // { headers: this.createHeader(), withCredentials: true})
            { headers: this.createHeader(token),})
            .then((response) => {onOK(response);})
            .catch((error) => {onError(error);});
    }

    sendCustomerVoice(data, onOK, onError) {
        axios.post("/app/customervoice",
            JSON.stringify(data),
           // { headers: this.createHeader(), withCredentials: true})
            { headers: this.createHeader(),})
            .then((response) => {onOK(response);})
            .catch((error) => {onError(error);});
    }

    // getUserProfile(onOK, onError) {
    //     axios.get("/users/profile",
    //         { headers: this.createHeader()})
    //         .then((response) => {onOK(response);})
    //         .catch((error) => {onError(error);});
    // }

    getLatestAppDataOn(onOK, onError) {
        axios.get("/app/lateston",
           // { headers: this.createHeader(), withCredentials: true})
            { headers: this.createHeader(),})
            .then((response) => {onOK(response);})
            .catch((error) => {onError(error);});
    }
    getLatestAppData(onOK, onError) {
        axios.get("/app/appdata",
           // { headers: this.createHeader(), withCredentials: true})
            { headers: this.createHeader(),})
            .then((response) => {onOK(response);})
            .catch((error) => {onError(error);});
    }
    getPromoteImageLink(onOK, onError) {
        axios.get("/app/prourl",
           // { headers: this.createHeader(), withCredentials: true})
            { headers: this.createHeader(),})
            .then((response) => {onOK(response);})
            .catch((error) => {onError(error);});
    }

    getAllNotification(lstExist, token, onOK, onError) {
        BE_CONSOLE_LOG("Backend getAllNotification:")
        axios.post("/app/notification/me",
            JSON.stringify(lstExist),
            { headers: this.createHeader(token)})
            .then((response) => {onOK(response);})
            .catch((error) => {onError(error);});
    }

    getAllNotificationGuest(lstExist, onOK, onError) {
        BE_CONSOLE_LOG("Backend getAllNotification Guest:")
        axios.post("/app/notification/guest",
            JSON.stringify(lstExist),
            { headers: this.createHeader()})
            .then((response) => {onOK(response);})
            .catch((error) => {onError(error);});
    }

}

const backend = new Backend();
export default backend;