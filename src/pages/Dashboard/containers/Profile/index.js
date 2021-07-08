import React, { Fragment, useEffect, useState } from 'react';
import './Profile.scss';
import ReactLetterAvatar from 'react-letter-avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Socials } from '../../constants/socials';
import { faCheck, faPencilAlt, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { connectFacebook, connectInstagram, updateAvatar, updatePhotoURL, updateProfileDisplayName } from '../../services';
import firebase from './../../../../config/firebase';
import Spinner from '../../../../shared/components/Spinner';
import Resizer from "react-image-file-resizer";

const Profile = ({ user, profile, uid }) => {

    const [socialLinks, setSocialLinks] = useState(profile?.socials);
    const [availableSocialLinks, setAvailableSocialLinks] = useState([]);
    const [showSpinner, setShowSpinner] = useState(false);
    const [displayName, setDisplayName] = useState(profile?.displayName);
    const [userProfile, setUserProfile] = useState(profile)
    const [isEditName, setisEditName] = useState(false);

    const onConnect = (type) => {

        switch (type) {
            case 'facebook':
                connectFacebook(uid);
                break;

            case 'instagram':
                connectInstagram(uid);
                break;

            default:
                break;
        }

    }

    const onDisplayNameChange = (name) => {
        setDisplayName(name);
    }

    const onEditName = () => {
        setisEditName(true);
    }

    const onCancelSaveName = () => {
        setDisplayName(profile?.displayName);
        setisEditName(false);
    }

    const onSaveName = () => {
        setShowSpinner(true);
        updateProfileDisplayName(uid, displayName).onSnapshot(res => {
            setTimeout(() => {
                setisEditName(false);
                setShowSpinner(false);
            }, 2000);
        });
    }

    const uploadAvatar = async (e) => {
        var fileInput = false;
        if (e.target.files[0]) {
            fileInput = true;
        }
        if (fileInput) {
            try {
                Resizer.imageFileResizer(
                    e.target.files[0],
                    300, 300, "JPEG", 100, 0,
                    (uri) => {
                        const uploadTask = updateAvatar(uri, uid);

                        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
                            (snapshot) => {
                                var progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes)) * 100;

                                if (progress < 100) {
                                    setShowSpinner(true);
                                } else {
                                    setShowSpinner(false);
                                }

                            }, (error) => {
                                setShowSpinner(false);
                                throw error
                            });

                        uploadTask.snapshot.ref.getDownloadURL().then(url => {
                            updatePhotoURL(uid, url)
                        })
                    },
                    "base64", 200, 200
                );
            } catch (err) {
                console.log(err);
            }
        }


    }

    useEffect(() => {
        setSocialLinks(profile?.socials);
        setUserProfile(profile);

        let u;

        if (socialLinks?.length) {
            u = Socials.filter((sc) => {
                return !profile?.socials?.some(s => {
                    return s.type === sc.type
                })
            });


        } else {
            u = Socials;
        }

        setAvailableSocialLinks(u);

        console.log(userProfile);
    }, [])

    return (
        <div className="profile">
            {
                showSpinner ? (<Spinner />) : null
            }
            <div className="profile__user">
                <input id="avatarInput" type="file" accept=".png, .jpg, .jpeg" className="profile__user__avatar__input" hidden onChange={uploadAvatar} />
                {
                    userProfile?.photoURL ? (
                        <figure className="profile__user__avatar">
                            <img src={userProfile?.photoURL} alt="" />
                        </figure>
                    ) : (
                        <ReactLetterAvatar className="profile__user__avatar"
                            name={userProfile?.displayName}
                            size={120}
                            radius={60}
                        />
                    )
                }

                <button className="profile__user__avatar__edit" onClick={() => document.querySelector('#avatarInput').click()}>
                    <FontAwesomeIcon icon={faPencilAlt} />
                </button>
                <div className="profile__user__username">
                    {
                        isEditName ? (
                            <Fragment>
                                <input type="text" className="profile__user__username__input" value={displayName} onChange={e => onDisplayNameChange(e.target.value)} />
                                <button onClick={() => onSaveName()} className="profile__user__username__edit">
                                    <FontAwesomeIcon icon={faSave} />
                                </button>
                                <button onClick={() => onCancelSaveName()} className="profile__user__username__cancel">
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </Fragment>
                        ) : (
                            <Fragment>
                                <p>{userProfile?.displayName}</p>
                                <button onClick={() => onEditName()} className="profile__user__username__edit">
                                    <FontAwesomeIcon icon={faPencilAlt} />
                                </button>
                            </Fragment>
                        )
                    }
                </div>

            </div>

            <div className="profile__link">
                {
                    socialLinks?.length ? profile?.socials?.map((social, i) => (
                        <Fragment key={i}>
                            <p className="profile__link__title">Social Links</p>
                            <div className="profile__link__existing">
                                <div className="profile__link__existing__wrapper" key={i}>
                                    <FontAwesomeIcon className="profile__link__existing__icon" icon={Socials.find(s => s.type === social?.type).icon} />
                                    <a href={social.link} target="_blank" className="profile__link__existing__url">{social.name}</a>
                                    {
                                        social.isVerified ? (<FontAwesomeIcon className="profile__link__existing__url--verified" icon={faCheck} />) : null
                                    }
                                </div>
                            </div>
                        </Fragment>
                    )) : null
                }

                <div className="profile__link__connect">
                    <p className="profile__link__connect__title">Please click below button to add your profile</p>
                    <div className="profile__link__connect__wrapper">
                        {availableSocialLinks.map((s, i) => (
                            <button key={i} onClick={() => onConnect(s.type)} className="profile__link__connect__btn">
                                <FontAwesomeIcon icon={s.icon} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
