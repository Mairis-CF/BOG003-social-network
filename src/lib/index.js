export const createUser = (email, password, userName) => {
  const createUserFirebase = firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      userCredential.user.updateProfile({
        displayName: userName,
      });
    });
  return createUserFirebase;
};

export const logOutUser = () => firebase.auth().signOut();

export const signInUser = (email, password) => firebase.auth().signInWithEmailAndPassword(email, password);

export const signInWithGoogle = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  return firebase.auth().signInWithPopup(provider);
};

export const savePost = (userName, postText, uId) => {
  db.collection('posts').add({
    user: userName,
    userPost: postText,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    userId: uId,
    likes: [],
  });
};

export const getPosts = (callback) => {
  db.collection('posts')
    .orderBy('createdAt', 'desc')
    .onSnapshot(callback);
};

export const deletePost = (postId) => {
  db.collection('posts').doc(postId).delete();
};

export const getPost = (postId) => {
  db.collection('posts').doc(postId).get();
};

export const liking = (uId, postId) => 
 return db.collection('posts').doc(postId).update(({
    likes: db.FieldValue.arrayUnion(uId),
  }));


export const unLike = (uId, postId) => {
  db.collection('posts').doc(postId).update(({
    likes: db.FieldValue.arrayRemove(uId),
  }));
};

/* export const editPost = (postId, newPost) => {
  db.collection('posts').doc(postId).update(newPost);
}; */
