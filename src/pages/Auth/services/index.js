import firebase from './../../../config/firebase';
import { addNewProfile } from './../../Dashboard/services/index';

export const socialMediaAuth = (provider) => {
    return firebase.auth().signInWithPopup(provider);
}

export const emailAuth = (user) => {
    const { email, password } = user;
    return firebase.auth().signInWithEmailAndPassword(email, password);
}

export const emailRegister = (user) => {
    const { email, password } = user;
    return firebase.auth().createUserWithEmailAndPassword(email, password);
}

export const addNewUser = (user) => {

    const { uid, email } = user;
    const userRef = firebase.firestore().doc(`users/${uid}`);
    userRef.get().then((doc) => {
        if (!doc.exists) {
            userRef.set({
                email,
                provider: user.providerData[0].providerId,
                username: uid.slice(0, 10)
            }, (error) => {
                if (error) {
                    console.log(error);
                }
            });

            addNewProfile(user);
        }

    }).catch((err) => {
        console.log(err)
    }
    );

    return userRef;
}

export const logout = () => {
    firebase.auth().signOut();
}
