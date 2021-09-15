export const createUser = (email, password, userName) => {
  const createUserFirebase = firebase.auth().createUserWithEmailAndPassword(email, password)
  .then((userCredential) => {
    userCredential.user.updateProfile({ 
     displayName: userName,
    })
  }) 
  return createUserFirebase;
};

export const logOutUser = () => {
 return firebase.auth().signOut()
};

export const signInUser = (email, password) => {
 return firebase.auth().signInWithEmailAndPassword(email, password)
};

export const signInWithGoogle = () => {
 var provider = new firebase.auth.GoogleAuthProvider();
 return firebase.auth().signInWithPopup(provider)
};

export const savePost = (userName, postText) => {
  db.collection('posts').add({
    user: userName,
    userPost: postText
  })
};

export const getPost = () => {
  return db.collection('posts').get()
};

export const onGetPost = (callback) => {
return db.collection('posts').onSnapshot(callback)
}