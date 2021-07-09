import React, { useState } from 'react';
import { googleProvider, facebookProvider } from '../../../../config/auth';
import AuthForm from '../../components/AuthForm';
import { emailAuth, socialMediaAuth } from '../../services';
import { NotificationContainer, NotificationManager } from 'react-notifications';

const Login = () => {
    const authType = 'login';
    const [load, setLoad] = useState(false);

    const handleOnLogin = async (provider) => {
        const res = await socialMediaAuth(provider);
    }

    const handleEmailLogin = (user) => {
        setLoad(true);
        emailAuth(user).then((res) => {
            setLoad(false);
         }).catch((err) => {
             var errorCode = err.code;
             var errorMessage = err.message;

             setTimeout(() => {
                 NotificationManager.error(errorMessage, errorCode);
                 setLoad(false);
             }, 3000);
         })
    }

    return (
        <div className="auth">
            <NotificationContainer/>
            <p className="auth__title">Login</p>

            <AuthForm authType={authType} loginWithGoogle={() => handleOnLogin(googleProvider)} loginWithFacbook={() => handleOnLogin(facebookProvider)} isLogin={true} isLoad={load} formAction={handleEmailLogin} />
        </div>
    )
}

export default Login
