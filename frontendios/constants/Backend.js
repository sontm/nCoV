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

    
    getLatestAppDataOn(onOK, onError) {
        axios.get("/ncov/lateston",
           // { headers: this.createHeader(), withCredentials: true})
            { headers: this.createHeader(),})
            .then((response) => {onOK(response);})
            .catch((error) => {onError(error);});
    }
    getLatestAppData(onOK, onError) {
        axios.get("/ncov/data",
           // { headers: this.createHeader(), withCredentials: true})
            { headers: this.createHeader(),})
            .then((response) => {onOK(response);})
            .catch((error) => {onError(error);});
    }
}

const backend = new Backend();
export default backend;