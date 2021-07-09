import React, { Fragment, useEffect, useState } from 'react'
import { ReactLetterAvatar } from 'react-letter-avatar';
import NotificationContainer from 'react-notifications/lib/NotificationContainer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NotificationManager from 'react-notifications/lib/NotificationManager';
import Spinner from '../../shared/components/Spinner';
import { BackgroundTypes } from '../Dashboard/constants/background';
import { getProfile } from '../Dashboard/services';
import { getUserByUsername } from './services';
import './Social.scss';
import ScrollContainer from 'react-indiana-drag-scroll';
import { faFacebookF, faFacebookSquare, faInstagram, faLinkedin, faSpotify, faTiktok, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';

const NotFound = () => {
    return (
        <div>Not Found</div>
    )
}

const UserProfile = ({ profile }) => {
    const background = BackgroundTypes.find(b => b.id === profile.backgroundId) || 1;

    const getIcon = (type) => {
        switch (type) {
            case 'facebook':
                return faFacebookSquare
                break;

            default:
                break;
        }
    }

    const convert = (num) => {
        if (num < 1000) {
            return num;
        }
        var si = [
          {v: 1E3, s: "K"},
          {v: 1E6, s: "M"},
          {v: 1E9, s: "B"},
          {v: 1E12, s: "T"},
          {v: 1E15, s: "P"},
          {v: 1E18, s: "E"}
          ];
        var i;
        for (i = si.length - 1; i > 0; i--) {
            if (num >= si[i].v) {
                break;
            }
        }
        return (num / si[i].v).toFixed(1).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + si[i].s;
    }

    console.log(profile.socials)
    return (
        <div className="social" style={{ backgroundImage: background.background }}>
            <div className="social__profile">
                {
                    profile.photoURL ? (
                        <figure className="social__profile__avatar">
                            <img src={profile.photoURL} alt="" />
                        </figure>
                    ) : (
                        <ReactLetterAvatar className="social__profile__avatar"
                            name={profile.displayName}
                            size={120}
                            radius={60}
                        />
                    )
                }
                <div className="social__profile__name">
                    {profile.displayName}
                </div>
            </div>

            <ScrollContainer className='scroll_container'>
                <div className="social__links">
                    {
                        profile.socials.map((social, i) =>
                        (
                            <div className="social__links__item" key={i}>
                                <div className="social__links__item__user">
                                    <FontAwesomeIcon className="icon" icon={getIcon(social.type)} />
                                    <p>{social.name}</p>
                                </div>
                                <div className="social__links__item__followers">
                                    <p>
                                        {convert(social.friends)}
                                    </p>
                                    <label>Friends</label>
                                </div>
                            </div>
                        ))
                    }

                    <div className="social__links__item">
                        <div className="social__links__item__user">
                            <FontAwesomeIcon className="icon" icon={faInstagram} />
                            <p>Pandu Wijaya Saputra</p>
                        </div>
                        <div className="social__links__item__followers">
                            <p>
                                {convert(459)}
                            </p>
                            <label>Followers</label>
                        </div>
                    </div>

                    <div className="social__links__item">
                        <div className="social__links__item__user">
                            <FontAwesomeIcon className="icon" icon={faYoutube} />
                            <p>Pandu Wijaya Saputra</p>
                        </div>
                        <div className="social__links__item__followers">
                            <p>
                                {convert(1243374)}
                            </p>
                            <label>Subscribers</label>
                        </div>
                    </div>

                    <div className="social__links__item">
                        <div className="social__links__item__user">
                            <FontAwesomeIcon className="icon" icon={faTiktok} />
                            <p>Pandu Wijaya Saputra</p>
                        </div>
                        <div className="social__links__item__followers">
                            <p>
                                {convert(214000)}
                            </p>
                            <label>Followers</label>
                        </div>
                    </div>

                    <div className="social__links__item">
                        <div className="social__links__item__user">
                            <FontAwesomeIcon className="icon" icon={faSpotify} />
                            <p>Pandu Podcast</p>
                        </div>
                        <div className="social__links__item__followers">
                            <p>
                                {convert(56637)}
                            </p>
                            <label>Monthly Listeners</label>
                        </div>
                    </div>

                    <div className="social__links__item">
                        <div className="social__links__item__user">
                            <FontAwesomeIcon className="icon" icon={faTwitter} />
                            <p>Pandu Wijaya</p>
                        </div>
                        <div className="social__links__item__followers">
                            <p>
                                {convert(77546)}
                            </p>
                            <label>Followers</label>
                        </div>
                    </div>

                    <div className="social__links__item">
                        <div className="social__links__item__user">
                            <FontAwesomeIcon className="icon" icon={faLinkedin} />
                            <p>Pandu Wijaya</p>
                        </div>
                        <div className="social__links__item__followers">
                            <p>
                                {convert(77546)}
                            </p>
                            <label>Connections</label>
                        </div>
                    </div>


                </div>
            </ScrollContainer>
        </div>
    )
}

const Social = (props) => {

    const [profile, setProfile] = useState(null);
    const [showSpinner, setShowSpinner] = useState(false);
    const username = props.match.params.username;


    useEffect(() => {

        setShowSpinner(true);

        getUserByUsername(username).then(res => {

            if (res.docs.length) {
                var unsubscribe = getProfile(res.docs[0].id).onSnapshot(snap => {
                    setProfile(snap.data());
                    unsubscribe();
                }, (err) => {
                    var errorCode = err.code;
                    var errorMessage = err.message;

                    NotificationManager.error(errorMessage, errorCode);
                })
            } else {
                setProfile(null);
            }

            setShowSpinner(false);

        });
    }, [])
    return (
        <Fragment>
            <NotificationContainer />
            {showSpinner ? (<Spinner />) : null}
            {profile ? (<UserProfile profile={profile} />) :
                (<NotFound />)
            }
        </Fragment>
    )
}



export default Social
