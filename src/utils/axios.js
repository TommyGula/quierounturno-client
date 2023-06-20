import axios from 'axios';

let api = "http://localhost:3001/";
let headers = {'Content-Type': 'application/json'}

export function get(query, token=null, callback) {
    if (token) {
        headers["Authorization"] = "Bearer " + token;
    };
    axios.get(api + query, {headers:headers}).then(response=>callback(response.data)).catch(err=>callback(err));
};

export function post(query, token=null, body, callback) {
    axios.post(api + query, body, {headers:headers}).then(response=>callback(response.data));
};