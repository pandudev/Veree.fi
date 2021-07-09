import e from 'cors';
import React, { useEffect, useState } from 'react';
import Spinner from '../../../../shared/components/Spinner';
import { updatePassword } from '../../../Auth/services';
import { updateUsername } from '../../services';
import './Setting.scss';
import { NotificationContainer, NotificationManager } from 'react-notifications';

const Setting = ({ user, profile, uid }) => {

    const [username, setUsername] = useState(user?.username);
    const [showSpinner, setShowSpinner] = useState(false);
    const [canSubmit, setCanSubmit] = useState(false);
    const [canUpdatePassword, setCanUpdatePassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [password, setPassword] = useState('')
    const [formError, setFormError] = useState(null);

    const handleFocus = (e) => {
        console.log(e);
        e.target.select()
    }

    const checkPasswordSubmit = () => {
        const reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
        if (newPassword !== confirmPassword) {
            setFormError(`Your password doesn't match!`);
            setCanUpdatePassword(false);
        } else if (!reg.test(newPassword)) {
            setCanUpdatePassword(false);
            setFormError(`Your password must be at least 8 characters in length, contain 1 capital letter, 1 number, and 1 special character.`);
        } else {
            setFormError(null);
            setCanUpdatePassword(true);
        }
    }

    const handleNewPasswordChange = (e) => {
        setNewPassword(e.target.value);
    }

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const handleUsernameChange = (e) => {
        checkCanSubmit(e.target.value);
        setUsername(e.target.value);
    }

    const handleSubmit = (e, type) => {
        e.preventDefault();
        setShowSpinner(true);
        if (type === 'username') {
            var unsubscribe = updateUsername(uid, username).onSnapshot(res => {
                setShowSpinner(false);
                NotificationManager.success('Your username has been updated.');
                unsubscribe();
            }, (err) => {
                var errorCode = err.code;
                var errorMessage = err.message;

                NotificationManager.error(errorMessage, errorCode);

                setShowSpinner(false);

            })
        } else {
            setCanUpdatePassword(false);
            updatePassword(password, newPassword).then(res => {
                setShowSpinner(false);
                setCanUpdatePassword(false);
                setPassword('');
                setConfirmPassword('');
                setNewPassword('');
                NotificationManager.success('Your password has been updated.');
            }).catch((err) => {
                var errorCode = err.code;
                var errorMessage = err.message;

                setTimeout(() => {
                    NotificationManager.error(errorMessage, errorCode);
                    setCanUpdatePassword(true);
                    setShowSpinner(false);

                }, 3000);
            })


        }
    }

    const checkCanSubmit = (val) => {
        val === user.username || !val.length ?
            setCanSubmit(false) : setCanSubmit(true);
    }

    useEffect(() => {
        let mounted = true;
        if (mounted) {
            checkPasswordSubmit();
            checkCanSubmit(username);
        }


        return () => {
            mounted = false
        }
    }, [newPassword, confirmPassword])

    return (
        <div className="setting">
            {
                showSpinner ? (<Spinner />) : null
            }
            <form className="setting__form">
                <div className="setting__form__group">
                    <label htmlFor="username">Username</label>
                    <div className="setting__form__group__caption">This link contains your username and never expires.</div>
                    <input className="setting__form__input--with-prefix" type="text" placeholder="username" name="username" value={username} onFocus={handleFocus} onChange={handleUsernameChange} />
                    <div className="setting__form__input__prefix">http://veree.fi/</div>
                </div>
                <button onClick={event => handleSubmit(event, 'username')} className="setting__form__submit" type="submit" disabled={!canSubmit}>Save</button>
            </form>

            {
                user?.provider === 'password' ? (
                    <form className="setting__form">
                        <div className="setting__form__group">
                            <label>Update Your Password</label>
                        </div>
                        <div className="setting__form__group">
                            <input className="setting__form__input" type="password" placeholder="current password" value={password} onChange={handlePasswordChange} />
                        </div>
                        <div className="setting__form__group">
                            <input className="setting__form__input" type="password" placeholder="new password" value={newPassword} onChange={handleNewPasswordChange} />
                        </div>
                        <div className="setting__form__group">
                            <input className="setting__form__input" type="password" placeholder="confirm new password" value={confirmPassword} onChange={handleConfirmPasswordChange} />
                        </div>
                        {
                            !canUpdatePassword && newPassword !== '' && confirmPassword !== '' ? (
                                <div className="setting__form__group">
                                    <div className="setting__form__group__caption setting__form__group__caption--error">{formError}</div>
                                </div>
                            ) : null
                        }

                        <button className="setting__form__submit" onClick={event => handleSubmit(event, 'password')} type="submit" disabled={!canUpdatePassword}>Update Password</button>
                    </form>
                ) : null
            }

        </div>
    )
}

export default Setting
