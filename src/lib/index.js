/* eslint-disable no-undef */
/* eslint-disable max-len */

// crear usuario con email y password
export const createUser = (email, password, userName) => {
  const createUserFirebase = firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      userCredential.user.updateProfile({ // se captura el nombre de usuario que luego será desplegado en la interfaz
        displayName: userName,
      });
    });
  return createUserFirebase;
};

// realizando el logout del usuario
export const logOutUser = () => firebase.auth().signOut();

// iniciando la sesión del usuario
export const signInUser = (email, password) => firebase.auth().signInWithEmailAndPassword(email, password);

// usando la API de google para loguear al usuario
export const signInWithGoogle = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  return firebase.auth().signInWithPopup(provider);
};

// crear y guardar post en la colección de firestore
export const savePost = (userName, postText, uId) => {
  db.collection('posts').add({
    user: userName,
    userPost: postText,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    userId: uId,
    likes: [],
  });
};

// toma los post ordenados descendentemente
export const getPosts = (callback) => {
  db.collection('posts')
    .orderBy('createdAt', 'desc')
    .onSnapshot(callback);
};

// elimina posts
export const deletePost = (postId) => {
  db.collection('posts').doc(postId).delete();
};

/* export const getPost = (postId) => {
  db.collection('posts').doc(postId).get();
}; */
// agregando likes en la colección
export const addLike = (uId, postId) => db.collection('posts').doc(postId).update({
  likes: firebase.firestore.FieldValue.arrayUnion(uId),
});

// remueve likes de la colección
export const removeLike = (uId, postId) => db.collection('posts').doc(postId).update({
  likes: firebase.firestore.FieldValue.arrayRemove(uId),
});

// actualización de los posts en tiempo real
export const updatePost = (postId, postText) => db.collection('posts').doc(postId).update({ userPost: postText });
