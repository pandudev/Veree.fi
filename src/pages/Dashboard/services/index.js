import firebase from './../../../config/firebase';
import axios from 'axios';
import { instagramAppId } from '../../../config/auth';
import { NotificationContainer, NotificationManager } from 'react-notifications';

export const getProfile = (uid) => {

    const profileRef = firebase.firestore().doc(`profiles/${uid}`);
    return profileRef;
}

export const updateAvatar = (uri, uid) => {
    const storageRef = firebase.storage().ref();
    return storageRef.child(`avatar/${uid}`).putString(uri, 'data_url');
}

export const addNewProfile = (user) => {
    const { uid, displayName, email } = user;
    const profileRef = firebase.firestore().doc(`profiles/${uid}`);
    profileRef.get().then((doc) => {
        profileRef.set({
            socials: [],
            createdOn: new Date(),
            modifiedOn: new Date(),
            displayName: displayName ? displayName : email.split('@')[0],
            photoURL: null,
            backgroundId: 1
        })
    });

    return profileRef;
}

export const selectBackground = (uid, backgroundId) => {
    const profileRef = firebase.firestore().doc(`profiles/${uid}`);
    profileRef.get().then((doc) => {
        profileRef.update({
            backgroundId
        })
    });

    return profileRef;
}



export const updateProfileDisplayName = (uid, name) => {
    const profileRef = firebase.firestore().doc(`profiles/${uid}`);
    profileRef.get().then((doc) => {
        profileRef.update({
            displayName: name
        })
    });

    return profileRef;
}

export const updateUsername = (uid, username) => {
    const userRef = firebase.firestore().doc(`users/${uid}`);
    userRef.get().then((doc) => {
        userRef.update({
            username
        })
    });

    return userRef;
}

export const updatePhotoURL = (uid, url) => {
    const profileRef = firebase.firestore().doc(`profiles/${uid}`);
    profileRef.get().then((doc) => {
        profileRef.update({
            photoURL: url
        })
    })

    return profileRef;
}

export const connectFacebook = (uid) => {
    const FB = window.FB;

    FB.login(function (loginResponse) {
        if (loginResponse.authResponse) {
            FB.api('/me?fields=id,name,friends,link', function (response) {
                const social = {
                    userId: response.id,
                    name: response.name,
                    link: response.link,
                    token: loginResponse.authResponse.accessToken,
                    tokenExpire: loginResponse.authResponse.data_access_expiration_time,
                    type: 'facebook',
                    friends: response.friends.summary.total_count
                }

                updateSocial(uid, social);
            });
        } else {
            console.log('User cancelled login or did not fully authorize.');
        }
    }, { scope: 'user_friends,user_link' });
}

export const connectInstagram = (uid) => {
    axios({
        method: 'GET',
        withCredentials: true,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        url: `https://api.instagram.com/oauth/authorize?client_id=${instagramAppId}&redirect_uri=https://localhost:3000/dashboard/profile
        &scope=user_profile,user_media&response_type=code`,
    }).then(res => console.log(res))
}

export const updateSocial = (uid, social) => {
    const profileRef = firebase.firestore().doc(`profiles/${uid}`);
    profileRef.get().then((doc) => {
        profileRef.update({
            socials: firebase.firestore.FieldValue.arrayUnion(social)
        })
    });

    NotificationManager.success(`${social.type} added to your profile`);

    return profileRef;
}