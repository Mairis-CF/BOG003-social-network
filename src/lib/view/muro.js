import { savePost, getPosts, deletePost, logOutUser, liking, unLike } from '../index.js';

export const createTimeLineView = () => {
  const timeLineSection = document.createElement('section');
  timeLineSection.setAttribute('class', 'muro-section');
  const timeLineView = `    
    <header class="header-muro">
      <p class="user-name" id="userName"></p>
      <div class="logo-short">
        <img src="images/logo_short.png" alt="Behind Code">
      </div>
      <div class="logo-long">
        <img src="images/logo_long.png" alt="Behind Code">
      </div>
      <button type="button" id ="logOut" class="log-out"> 
        <img src="images/log-out1.png" alt="Log Out">
      </button>
    </header>

    <form id="postForm">
      <textarea id="postBox" name="post" placeholder="Comparte tu experiencia..."></textarea>
      <button type="submit" id="btnPost">Publicar</button>
    </form>

    <section class="post-section" id="postSection"></section>
  `;
  timeLineSection.innerHTML = timeLineView;

  /* Mostrar el nombre del usuario en el header */
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const userName = timeLineSection.querySelector('#userName');
      userName.textContent = user.displayName;
    }
  });

  /* Guardar el post en la base de datos */
  const postForm = timeLineSection.querySelector('#postForm');

  postForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const userName = firebase.auth().currentUser.displayName;
    const postText = postForm.post.value;
    const userId = firebase.auth().currentUser.uid;
    savePost(userName, postText, userId);
    postForm.reset();
  });

  /* Crear e insertar los elementos de un post en el DOM */
  const postSection = timeLineSection.querySelector('#postSection');

  const showPost = (doc) => {
    /* Crear los elementos de la publicación y agregar clase para estilos */
    const postContainer = document.createElement('div');
    postContainer.setAttribute('class', 'post-container');

    const postBy = document.createElement('p');
    postBy.setAttribute('class', 'post-by');

    const postContent = document.createElement('p');
    postContent.setAttribute('class', 'post-content');

    const btnsContainer = document.createElement('div');
    btnsContainer.setAttribute('class', 'buttons-container');
    btnsContainer.setAttribute('data-id', doc.id);

    const likeBtn = document.createElement('img');
    likeBtn.setAttribute('class', 'like-button');
    likeBtn.setAttribute('src', 'images/like.png');
    likeBtn.setAttribute('data-id', doc.id);

    const editBtn = document.createElement('img');
    editBtn.setAttribute('class', 'edit-button');
    editBtn.setAttribute('src', 'images/pencil.png');

    const deleteBtn = document.createElement('img');
    deleteBtn.setAttribute('class', 'delete-button');
    deleteBtn.setAttribute('src', 'images/bin.png');

    const likeCount = document.createElement('p');
    likeCount.setAttribute('class', 'likesCounter');

    /* Agregar el texto del nombre y la publicación a los elementos */
    postBy.textContent = `Publicado por ${doc.data().user}`;
    postContent.textContent = doc.data().userPost;
    likeCount.textContent = `Likes:${doc.data().likes.length}`;

    /* Agregar los elementos al container de la publicación individual y luego
     a la sección de publicaciones del DOM */
    postContainer.appendChild(postBy);
    postContainer.appendChild(postContent);
    btnsContainer.append(likeBtn, editBtn, deleteBtn);
    postContainer.appendChild(btnsContainer);
    postContainer.appendChild(likeCount);
    postSection.appendChild(postContainer);

    /* Mostrar los botones de editar y borrar solo al usuario logueado */
    const currentUserId = firebase.auth().currentUser.uid;
    const userIdPost = doc.data().userId;

    const likesPost = doc.data().likes;
    // console.log(likesPost);

    /* cuando el usuario logueado realice una publicación, podrá ver los elementos de editar
   y eliminar */
    if (currentUserId === userIdPost) {
      editBtn.style.display = 'block';
      deleteBtn.style.display = 'block';
    }

    /* si la acción de like coincide con la credencial del usuario, se mostrará el mismo elemento
    de like al usuario */
/*
      const likedPost = e.target.parentElement.getAttribute('data-id');
      const likesByPost = doc(likedPost).data().likes;

      if (likesByPost.includes(currentUserId)) {
        unLike(currentUserId, e.target.dataset.id);
      } else {
        liking(currentUserId, e.target.dataset.id);
      }
 */

    likeBtn.addEventListener('click', (e) => {
      console.log('hola');
      const likedPost = e.target.dataset.id;
      liking(currentUserId, likedPost)
      .then(res => console.log(res.data()));
    });
    /* Eliminar una publicación */
    deleteBtn.addEventListener('click', (e) => {
      const idPost = e.target.parentElement.getAttribute('data-id');
      deletePost(idPost);
    });
    /* Fin de la función show post */
  };

  /* Obtener los post de la base de datos y mostrarlos en el dom */
  getPosts((snapshot) => {
    postSection.innerHTML = '';
    snapshot.docs.forEach((doc) => {
      showPost(doc);
    });
  });

  /* Botón para que el usuario cierre sesión */
  const logOut = timeLineSection.querySelector('#logOut');
  logOut.addEventListener('click', (e) => {
    e.preventDefault();
    logOutUser()
      .then(() => {
        window.location.hash = '#/ingreso';
      })
      .catch((error) => {
        console.log(error);
      });
  });

  return timeLineSection;
};
