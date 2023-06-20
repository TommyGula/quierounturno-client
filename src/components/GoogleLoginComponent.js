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

    var googleObj = {
        "Ca": "113081622638109441801",
        "xc": {
                "token_type": "Bearer",
                "access_token": "ya29.a0Ael9sCMZVREHFM8jzgnR-QU4-1PlRoauyFEbEdonaZZ0-FFKdpKSjwz95gL9xaaZvJd-TSECkwIvUh6mS_LwVoq6EaR2oZKEGS8MZ9wqlcOJHGI6H5wrpiovgJkOReyYchGKKM9z-M_TQn0MJoAJQWxwIL0CyeYaCgYKAZ8SARESFQF4udJh2iPBmmj7DNXw83b5h_MWcg0166",
                "scope": "email profile https://www.googleapis.com/auth/userinfo.email openid https://www.googleapis.com/auth/userinfo.profile",
                "login_hint": "AJDLj6JUa8yxXrhHdWRHIV0S13cA8Gh-Z28gwIcvjFCOjKzxcq2fLTYoTO3r5_MM0o2yHDIDKT4bTxQvK5Ql671l2AXzJM88xQ",
                "expires_in": 3599,
                "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg2OTY5YWVjMzdhNzc4MGYxODgwNzg3NzU5M2JiYmY4Y2Y1ZGU1Y2UiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMjQ0MTI0NTM0OTg2LTZqdWNxMm9zYjliOTdxY2s2ZjJlMGJodDVhZmMzc3NzLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMjQ0MTI0NTM0OTg2LTZqdWNxMm9zYjliOTdxY2s2ZjJlMGJodDVhZmMzc3NzLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTEzMDgxNjIyNjM4MTA5NDQxODAxIiwiZW1haWwiOiJ0b21hc2d1bGEuM2ZAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJEVWhxMG5TR0dERHpBU2VMcGVYU1p3IiwibmFtZSI6IlRvbWFzIEd1bGEiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUdObXl4WkJQRWlyTDJHQkdJYkVXa1p3a2V1TDJIeG5QTHNoQnd2cV9uTG09czk2LWMiLCJnaXZlbl9uYW1lIjoiVG9tYXMiLCJmYW1pbHlfbmFtZSI6Ikd1bGEiLCJsb2NhbGUiOiJlcy00MTkiLCJpYXQiOjE2ODIzNTc1NTUsImV4cCI6MTY4MjM2MTE1NSwianRpIjoiNGQ3NTRjODg3ZjU0NWZmNzJiMWQ3MWI0ZTA1ZjQ3YmI3N2EwZjcwNCJ9.XvprXP5HiM3ZV9MDSSYH002_iL1e5iNrVa_hbmzz93X_ksqlHMuhWrE8gpULeoy_ZnlmV8ZhYP8elJbtDsA_1Y0O7y_P2T1wKtlkPpL-KlEs9it0Pgcuttp9DBxvpiv8bWvhEJObNbH6tjPqDpIUTrCuo_bP3MisR1ER5qsKvFwz7ixwkxySESCm2dvsraSTFQaeyQ_U2a0AdVgpklJLMHk9l7HWm18z7STkQ3qx33QoI73o10r6lMGqckzxid8LiAxoEuvzzD32Z_whq6dctfQfV0OYgADTOIqMOmiFDg_7gHucwQpJNA9J-QZTT2l-q8CZflbhEdgS-FQfKU-j4A",
                "session_state": {
                        "extraQueryParams": {
                                "authuser": "0"
                        }
                },
                "first_issued_at": 1682357553888,
                "expires_at": 1682361152888,
                "idpId": "google"
        },
        "wt": {
                "NT": "113081622638109441801",
                "Ad": "Tomas Gula",
                "rV": "Tomas",
                "uT": "Gula",
                "hK": "https://lh3.googleusercontent.com/a/AGNmyxZBPEirL2GBGIbEWkZwkeuL2HxnPLshBwvq_nLm=s96-c",
                "cu": "tomasgula.3f@gmail.com"
        },
        "googleId": "113081622638109441801",
        "tokenObj": {
                "token_type": "Bearer",
                "access_token": "ya29.a0Ael9sCMZVREHFM8jzgnR-QU4-1PlRoauyFEbEdonaZZ0-FFKdpKSjwz95gL9xaaZvJd-TSECkwIvUh6mS_LwVoq6EaR2oZKEGS8MZ9wqlcOJHGI6H5wrpiovgJkOReyYchGKKM9z-M_TQn0MJoAJQWxwIL0CyeYaCgYKAZ8SARESFQF4udJh2iPBmmj7DNXw83b5h_MWcg0166",
                "scope": "email profile https://www.googleapis.com/auth/userinfo.email openid https://www.googleapis.com/auth/userinfo.profile",
                "login_hint": "AJDLj6JUa8yxXrhHdWRHIV0S13cA8Gh-Z28gwIcvjFCOjKzxcq2fLTYoTO3r5_MM0o2yHDIDKT4bTxQvK5Ql671l2AXzJM88xQ",
                "expires_in": 3599,
                "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg2OTY5YWVjMzdhNzc4MGYxODgwNzg3NzU5M2JiYmY4Y2Y1ZGU1Y2UiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMjQ0MTI0NTM0OTg2LTZqdWNxMm9zYjliOTdxY2s2ZjJlMGJodDVhZmMzc3NzLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMjQ0MTI0NTM0OTg2LTZqdWNxMm9zYjliOTdxY2s2ZjJlMGJodDVhZmMzc3NzLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTEzMDgxNjIyNjM4MTA5NDQxODAxIiwiZW1haWwiOiJ0b21hc2d1bGEuM2ZAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJEVWhxMG5TR0dERHpBU2VMcGVYU1p3IiwibmFtZSI6IlRvbWFzIEd1bGEiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUdObXl4WkJQRWlyTDJHQkdJYkVXa1p3a2V1TDJIeG5QTHNoQnd2cV9uTG09czk2LWMiLCJnaXZlbl9uYW1lIjoiVG9tYXMiLCJmYW1pbHlfbmFtZSI6Ikd1bGEiLCJsb2NhbGUiOiJlcy00MTkiLCJpYXQiOjE2ODIzNTc1NTUsImV4cCI6MTY4MjM2MTE1NSwianRpIjoiNGQ3NTRjODg3ZjU0NWZmNzJiMWQ3MWI0ZTA1ZjQ3YmI3N2EwZjcwNCJ9.XvprXP5HiM3ZV9MDSSYH002_iL1e5iNrVa_hbmzz93X_ksqlHMuhWrE8gpULeoy_ZnlmV8ZhYP8elJbtDsA_1Y0O7y_P2T1wKtlkPpL-KlEs9it0Pgcuttp9DBxvpiv8bWvhEJObNbH6tjPqDpIUTrCuo_bP3MisR1ER5qsKvFwz7ixwkxySESCm2dvsraSTFQaeyQ_U2a0AdVgpklJLMHk9l7HWm18z7STkQ3qx33QoI73o10r6lMGqckzxid8LiAxoEuvzzD32Z_whq6dctfQfV0OYgADTOIqMOmiFDg_7gHucwQpJNA9J-QZTT2l-q8CZflbhEdgS-FQfKU-j4A",
                "session_state": {
                        "extraQueryParams": {
                                "authuser": "0"
                        }
                },
                "first_issued_at": 1682357553888,
                "expires_at": 1682361152888,
                "idpId": "google"
        },
        "tokenId": "eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg2OTY5YWVjMzdhNzc4MGYxODgwNzg3NzU5M2JiYmY4Y2Y1ZGU1Y2UiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMjQ0MTI0NTM0OTg2LTZqdWNxMm9zYjliOTdxY2s2ZjJlMGJodDVhZmMzc3NzLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMjQ0MTI0NTM0OTg2LTZqdWNxMm9zYjliOTdxY2s2ZjJlMGJodDVhZmMzc3NzLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTEzMDgxNjIyNjM4MTA5NDQxODAxIiwiZW1haWwiOiJ0b21hc2d1bGEuM2ZAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJEVWhxMG5TR0dERHpBU2VMcGVYU1p3IiwibmFtZSI6IlRvbWFzIEd1bGEiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUdObXl4WkJQRWlyTDJHQkdJYkVXa1p3a2V1TDJIeG5QTHNoQnd2cV9uTG09czk2LWMiLCJnaXZlbl9uYW1lIjoiVG9tYXMiLCJmYW1pbHlfbmFtZSI6Ikd1bGEiLCJsb2NhbGUiOiJlcy00MTkiLCJpYXQiOjE2ODIzNTc1NTUsImV4cCI6MTY4MjM2MTE1NSwianRpIjoiNGQ3NTRjODg3ZjU0NWZmNzJiMWQ3MWI0ZTA1ZjQ3YmI3N2EwZjcwNCJ9.XvprXP5HiM3ZV9MDSSYH002_iL1e5iNrVa_hbmzz93X_ksqlHMuhWrE8gpULeoy_ZnlmV8ZhYP8elJbtDsA_1Y0O7y_P2T1wKtlkPpL-KlEs9it0Pgcuttp9DBxvpiv8bWvhEJObNbH6tjPqDpIUTrCuo_bP3MisR1ER5qsKvFwz7ixwkxySESCm2dvsraSTFQaeyQ_U2a0AdVgpklJLMHk9l7HWm18z7STkQ3qx33QoI73o10r6lMGqckzxid8LiAxoEuvzzD32Z_whq6dctfQfV0OYgADTOIqMOmiFDg_7gHucwQpJNA9J-QZTT2l-q8CZflbhEdgS-FQfKU-j4A",
        "accessToken": "ya29.a0Ael9sCMZVREHFM8jzgnR-QU4-1PlRoauyFEbEdonaZZ0-FFKdpKSjwz95gL9xaaZvJd-TSECkwIvUh6mS_LwVoq6EaR2oZKEGS8MZ9wqlcOJHGI6H5wrpiovgJkOReyYchGKKM9z-M_TQn0MJoAJQWxwIL0CyeYaCgYKAZ8SARESFQF4udJh2iPBmmj7DNXw83b5h_MWcg0166",
        "profileObj": {
                "googleId": "113081622638109441801",
                "imageUrl": "https://lh3.googleusercontent.com/a/AGNmyxZBPEirL2GBGIbEWkZwkeuL2HxnPLshBwvq_nLm=s96-c",
                "email": "tomasgula.3f@gmail.com",
                "name": "Tomas Gula",
                "givenName": "Tomas",
                "familyName": "Gula",
                "_id": "113081622638109441801"
        }
}

    const onSuccess = (res) => {
        get("users/google/" + res.Ca, res.tokenId, (user) => {
            if (!user.length) {
                post("users/", null, {
                    firstName:res.profileObj.givenName,
                    lastName:res.profileObj.familyName,
                    googleId:res.Ca,
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