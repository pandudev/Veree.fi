import React, { Fragment, useEffect, useState } from 'react'
import { Switch, Route, useRouteMatch, Redirect, useHistory } from 'react-router-dom';
import Navbar from '../../shared/components/Navbar';
import firebase from './../../config/firebase'
import Background from './containers/Background';
import Profile from './containers/Profile';
import Setting from './containers/Setting';
import './Dashboard.scss';
import { logout, addNewUser } from './../Auth/services'
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Spinner from './../../shared/components/Spinner'
import { getProfile } from './services';



const Dashboard = () => {
    let { path, url } = useRouteMatch();

    const NavItems = ['profile', 'background', 'setting'];

    const [user, setUser] = useState(null);
    const [uid, setuid] = useState(null)
    const [profile, setProfile] = useState(null)

    let history = useHistory();


    const handleLogout = () => {
        setUser(null);

        setTimeout(() => {
            logout();
        }, 1000);
    }

    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            firebase.auth().onAuthStateChanged((res) => {
                if (!res) {
                    history.push("/auth");
                } else {
                    addNewUser(res).onSnapshot((snap) => {
                        setuid(snap.id);
                        setUser(snap.data());
                    })
                    getProfile(res.uid).onSnapshot((snap) => {
                        setProfile(snap.data());
                    })
                }
            });


        }

        return () => {
            isMounted = false;
        };
    }, [])

    return (
        <Fragment>
            <NotificationContainer />


            {
                user ? (

                    <Fragment>
                        <Navbar url={url} navItems={NavItems} user={user} logout={handleLogout} />

                        <div className="page-wrapper container">
                            <Switch>
                                <Route path={`${path}/profile`} component={() => <Profile user={user} uid={uid} profile={profile} />} />
                                <Route path={`${path}/background`} component={() => <Background  user={user} uid={uid} profile={profile}/>} />
                                <Route path={`${path}/setting`} component={() => <Setting user={user} uid={uid} profile={profile}/>} />
                                <Redirect from='*' to={`${path}/profile`} />
                            </Switch>
                        </div>
                    </Fragment>
                ) :
                    (
                        <Spinner />
                    )
            }

        </Fragment >
    )
}

export default Dashboard
