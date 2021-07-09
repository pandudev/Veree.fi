
import React, { useEffect, useState } from 'react'
import { BackgroundTypes } from '../../constants/background'
import './Background.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faSave } from '@fortawesome/free-solid-svg-icons';
import { selectBackground } from '../../services';
import Spinner from '../../../../shared/components/Spinner';
import { NotificationContainer, NotificationManager } from 'react-notifications';

const Background = ({ user, profile, uid }) => {
    const bgItems = BackgroundTypes;

    const [userProfile, setUserProfile] = useState(profile);
    const [showSpinner, setShowSpinner] = useState(false);

    const onSelectBackground = (id) => {
        // setShowSpinner(true);
        if (window.confirm('Are you sure to use this background?')) {
            var unsubscribe = selectBackground(uid, id).onSnapshot(snap => {
                NotificationManager.success('Background has been set');
                unsubscribe();
            });
        }
    }

    useEffect(() => {
        let mounted = true;

        mounted && setUserProfile(profile);

        return () => {
            mounted = false;
        }
    }, [])

    return (
        <div className="background">
             {
                showSpinner ? (<Spinner />) : null
            }
            {
                bgItems.map(bg =>
                (
                    <div className={`background__item ${userProfile?.backgroundId === bg.id ? 'active' : null}`} key={bg.id}>
                        <div className="background__item__pattern" style={{ backgroundImage: bg.background }}>
                            <div className="background__item__pattern__action">
                                {
                                    userProfile?.backgroundId === bg.id ?
                                        (
                                            <button disabled><FontAwesomeIcon icon={faCheck} /></button>
                                        ) : (
                                            <button onClick={() => onSelectBackground(bg.id)}>
                                                <FontAwesomeIcon icon={faSave} />
                                            </button>
                                        )
                                }

                            </div>
                        </div>
                        <p className="background__item__title">{bg.name}</p>
                    </div>
                )
                )
            }
        </div>
    )
}

export default Background
