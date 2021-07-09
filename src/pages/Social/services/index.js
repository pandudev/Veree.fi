import firebase from './../../../config/firebase';

export const getUserByUsername = (username) => {
    const userRef = firebase.firestore().collection('users');
    const query = userRef.where('username', '==', username).get();
    return query;
}
