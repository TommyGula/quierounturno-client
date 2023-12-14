import axios from 'axios';

let api = process.env.REACT_APP_BACKEND_PATH;
let headers = {'Content-Type': 'application/json'}

export function get(query, token=null, callback) {
    if (token) {
        headers["Authorization"] = "Bearer " + token;
    };
    axios.get(api + query, {headers:headers}).then(response=>callback(response.data)).catch(err=>callback(err));
};

export function post(query, token=null, body, callback) {
    if (token) {
        headers["Authorization"] = "Bearer " + token;
    };
    axios.post(api + query, body, {headers:headers}).then(response=>callback(response.data)).catch(err=>callback(err));
};

export function put(query, token=null, body, callback) {
    if (token) {
        headers["Authorization"] = "Bearer " + token;
    };
    axios.put(api + query, body, {headers:headers}).then(response=>callback(response.data)).catch(err=>callback(err));
};

export function remove(query, token=null, callback) {
    if (token) {
        headers["Authorization"] = "Bearer " + token;
    };
    axios.delete(api + query, {headers:headers}).then(response=>callback(response.data)).catch(err=>callback(err));
}