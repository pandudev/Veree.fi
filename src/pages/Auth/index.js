import React, { Fragment, useEffect, useState } from 'react'
import { Redirect, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import Navbar from '../../shared/components/Navbar';
import Register from './containers/Register';
import Login from './containers/Login';
import firebase from './../../config/firebase'
import './Auth.scss';

const Auth = () => {
    let { path, url } = useRouteMatch();

    const NavItems = ['register', 'login'];

    
    const history = useHistory();

    useEffect(() => {
        let mounted = true;

        if (mounted) {
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    history.push("/");
                }
            });
        }

        return () => {
            mounted = false;
        };
    }, [])

    return (
        <Fragment>
            
            <Navbar url={url} navItems={NavItems} isLoggedIn={false} />

            <div className="page-wrapper container">
                <Switch>
                    <Route path={`${path}/register`} component={Register} />
                    <Route path={`${path}/login`} component={Login} />
                    <Redirect from='*' to={`${path}/login`} />
                </Switch>
            </div>


        </Fragment >
    )
}

export default Auth
