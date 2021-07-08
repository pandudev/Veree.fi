import React, { useState } from 'react'
import AuthForm from '../../components/AuthForm';
import { emailRegister } from '../../services';
import { NotificationContainer, NotificationManager } from 'react-notifications';

const Register = () => {

    const [load, setLoad] = useState(false);

    const authType = 'register';
    const onRegister = (user) => {
        setLoad(true);
        emailRegister(user).then((res) => {
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
            <p className="auth__title">Register</p>

            <AuthForm authType={authType} isLoad={load} formAction={onRegister} />
        </div>
    )
}

export default Register
