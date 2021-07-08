import React, { Fragment } from 'react';
import { Capitalize } from '../../../../utils/capitalize';
import './AuthForm.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { Form, Input } from '../../../../shared/components/Form';

const AuthForm = ({ authType, loginWithGoogle, loginWithFacbook, isLogin = false, formAction, isLoad }) => {

    const onSubmit = (user) => {
        formAction(user)
    };


    return (
        <div className="auth-form">
            {
                isLogin ? (
                    <Fragment>
                        <button className="auth-form__cta auth-form__cta--google" onClick={() => loginWithGoogle()}>
                            <FontAwesomeIcon icon={faGoogle} className="btn-icon" /> {Capitalize(authType)} with Google
                        </button>
                        <button className="auth-form__cta auth-form__cta--facebook" onClick={() => loginWithFacbook()}>
                            <FontAwesomeIcon icon={faFacebookF} className="btn-icon" /> {Capitalize(authType)} with Facebook
                        </button>
                        <div className="auth-form__divider">OR</div>
                    </Fragment>
                ) : null
            }

            <Form onSubmit={onSubmit} formClass="auth-form__form">
                <Input className="auth-form__form__input" type="email" placeholder="email" name="email"/>
                <Input className="auth-form__form__input" type="password" placeholder="password" name="password"/>
                <button disabled={isLoad} className="auth-form__form__submit" type="submit">{isLoad ? 'Please Wait' : authType}</button>
            </Form>
        </div>
    )
}

export default AuthForm
