import React, { useEffect} from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import Facebook from "../assets/facebook.png";

const FacebookLoginComponent = (props) => {
    const appId = '1229608231185966';

    const responseFacebook = (response) => {
        console.log(response);
    }

    return (
      <FacebookLogin
        className='btn-social btn-facebook mb-5 d-flex justify-content-center align-items-center'
        appId={appId}
        autoLoad={false}
        buttonText="Sign in with Facebook"
        fields="name,email,picture"
        scope="public_profile,user_friends"
        callback={responseFacebook}
        render={renderProps => (
            <button onClick={renderProps.onClick} className="btn-social btn-facebook mb-3 d-flex justify-content-center align-items-center">
                <img src={Facebook} alt="Login with Facebook" height={20} width={20} className="mx-3"/>
                {props.field}
            </button>
        )}
        />
    );
};

export default FacebookLoginComponent;
