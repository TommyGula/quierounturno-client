import React, { useContext, useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from 'react-google-login';
import { gapi } from 'gapi-script';
import UserContext from '../context/UserContext';
import {get, post, put} from "../utils/axios";

const GoogleLoginComponent = (props) => {
    const context = useContext(UserContext);
    const clientId = '244124534986-6jucq2osb9b97qck6f2e0bht5afc3sss.apps.googleusercontent.com';
    const navigate = useNavigate();

    const initClient = () => {
        gapi.auth2.init({
            clientId: clientId,
            scope: ''
        }).then(() => {
            props.onLoad();
        });
    };

    gapi.load('client:auth2', initClient);

    const onSuccess = (res) => {
        get("users/google/" + res.Ca, res.tokenId, (user) => {
            if (!user.length) {
                post("users/", null, {
                    firstName:res.profileObj.givenName,
                    lastName:res.profileObj.familyName,
                    googleId:res.Ca,
                    document:res.Ca,
                    email:res.profileObj.email,
                    profileImg:res.profileObj.imageUrl,
                }, (newUser) => {
                    console.log(newUser)
                    context.login(newUser, res.tokenId);
                    props.onSuccess("Inicio de sesión exitoso", "¡Bienvenido " + newUser.firstName + "!")        
                })
            } else {
                user = user[0];
                context.login(user, res.tokenId);
                props.onSuccess("Inicio de sesión exitoso", "¡Bienvenido " + user.firstName + "!")        
            }
        });      
    };
    const onFailure = (err) => {
        console.log('failed:', err);
        props.onError("Error al iniciar sesión con Google", err);
    };
    return (
        <div className="GoogleLogin">
            <GoogleLogin
                className='btn-social btn-google mb-5 d-flex justify-content-center align-items-center'
                clientId={clientId}
                buttonText={props.field}
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
                isSignedIn={false}
            /> 
        </div>
    );
};

export default GoogleLoginComponent;