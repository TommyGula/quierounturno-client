import React, { useState } from "react";
import UserContext from "./UserContext";
import { get } from "../utils/axios";

const GlobalState = ({children}) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
    const [businesses, setBusinesses] = useState(JSON.parse(localStorage.getItem("businesses")) || []);
    const [appointment, setAppointment] = useState(JSON.parse(localStorage.getItem("appointment")) || {});
    const [isAppointmentSet, setIsAppointmentSet] = useState(localStorage.getItem("isAppointmentSet"));
    const colorPrimary = "#00C4B4";

    const login = (user, token, cb) => {
        if (Object.keys(user).includes("password")) {
            user.password = "private";
        };
        localStorage.setItem('token', token);
        setToken(token);
/*         if (user.googleId) {
            user._id = user.googleId;
        }; */
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        getBusinesses(user._id, token);
        if (cb) {
            cb();
        };
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const initAppointment = (companyId) => {
        setAppointment({companyId:companyId, expiry:new Date().getTime() + 60, employees:[]});
        setIsAppointmentSet(true);

        localStorage.setItem("appointment", JSON.stringify({companyId:companyId, expiry:new Date().getTime() + 60}));
        localStorage.setItem("isAppointmentSet", JSON.stringify({value:true, expiry:new Date().getTime() + 60}));
    };

    const buildAppointment = (name, value, cb) => {
        setAppointment({...appointment, [name]:value});
        localStorage.setItem("appointment", JSON.stringify({...appointment, [name]:value}));
        if (cb) {
            cb();
        };
    }

    const setAppointmentData = (data, cb) => {
        setAppointment({...appointment, ...data});
        localStorage.setItem("appointment", JSON.stringify({...appointment, ...data}));
        if (cb) {
            cb();
        };
    }

    const getBusinesses = (userId, token) => {
        get("businesses?createdBy=" + userId, token, (response) => {
            localStorage.setItem("businesses", response.length);
            setBusinesses(response);
        })
    };

    return(
        <UserContext.Provider value={{
            login,
            logout,
            token,
            user,
            colorPrimary,
            businesses,
            appointment,
            isAppointmentSet,
            initAppointment,
            buildAppointment,
            setAppointmentData
        }}>
            {children}
        </UserContext.Provider>
    )
};

export default GlobalState;