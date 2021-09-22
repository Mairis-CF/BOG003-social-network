import {
  savePost, getPosts, deletePost, logOutUser, addLike, removeLike,
} from '../index.js';

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
    <div id="modalDiv" class="modal-confirm">
        <p>¿Seguro que quieres eliminar esta publicación?</p>
        <button class="delete-confirm">Eliminar</button>
        <button class="cancel-delete">Cancelar</button>
    </div>
    <form id="postForm">
      <textarea id="postBox" name="post" placeholder="Comparte tu experiencia..."></textarea>
      <button type="submit" id="btnPost" disabled>Publicar</button>
      <button id="btnSave">Guardar</button>
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
  const postBox = timeLineSection.querySelector('#postBox');
  const btnPost = timeLineSection.querySelector('#btnPost');
  
  postBox.addEventListener('keyup', () => {
    btnPost.removeAttribute('disabled')
  }) 

  postForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const userName = firebase.auth().currentUser.displayName;
    const postText = postForm.post.value;
    const userId = firebase.auth().currentUser.uid;
    
          
    savePost(userName, postText, userId);
    postForm.reset();
    btnPost.setAttribute('disabled', 'disabled');
  });
  
  /* Crear e insertar los elementos de un post en el DOM */
  const postSection = timeLineSection.querySelector('#postSection');
  const btnSave = timeLineSection.querySelector('#btnSave');
  btnSave.setAttribute('class', 'hideBtn');
  
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
    likeCount.textContent = doc.data().likes.length;

    /* Agregar los elementos al container de la publicación individual y luego
    a la sección de publicaciones del DOM */
    postContainer.appendChild(postBy);
    postContainer.appendChild(postContent);
    btnsContainer.append(likeBtn, likeCount, editBtn, deleteBtn);
    postContainer.appendChild(btnsContainer);
    postSection.append(postContainer);

    /* Mostrar los botones de editar y borrar solo al usuario logueado */
    const currentUserId = firebase.auth().currentUser.uid;
    const userIdPost = doc.data().userId;

    /* cuando el usuario logueado realice una publicación, podrá ver los elementos de editar
    y eliminar */
    if (currentUserId === userIdPost) {
      editBtn.style.display = 'block';
      deleteBtn.style.display = 'block';
    }

    /* Función para el conteo de los likes (uno por persona) */
    likeBtn.addEventListener('click', (e) => {
      const likedPost = e.target.dataset.id;
      const likesByPost = doc.data().likes;

      if (likesByPost.includes(currentUserId)) {
        removeLike(currentUserId, likedPost)
          .catch((error) => console.log(error));
      } else {
        addLike(currentUserId, likedPost)
          .catch((error) => console.log(error));
      }
    });

    // Mostrar el conteo de like sólo cuando tenga más de un like
    if (doc.data().likes.length == 0) {
      likeCount.style.display = 'none';
    } else {
      likeCount.style.display = 'block';
    }

    const hideBtn = (btn) => btn.setAttribute('class', 'hideBtn');
    const showBtn = (btn) => btn.removeAttribute('class', 'hideBtn');

    // editar una publicación
    editBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // mostrar botón de guardar y ocultar de publicar
      showBtn(btnSave);
      hideBtn(btnPost);
      const idPost = e.target.dataset.id;
      const userPost = doc.data().userPost;
      postBox.value = userPost;

      // ejecutando boton guardar post editado
      btnSave.addEventListener('click', (e) => {
        e.preventDefault();
        const newText = postBox.value;
        updatePost(idPost, newText)
        postContent.textContent = doc.data().userPost;
        
        /* postBox.value = ''; */
        showBtn(btnPost);
        hideBtn(btnSave);
      });
    });

    /* Mostrar ventana modal de confirmación borrar*/
    deleteBtn.addEventListener('click', (e) => {
      const idPost = e.target.parentElement.getAttribute('data-id');
      modalDiv.style.display = 'block';
      modalDiv.setAttribute('data-id', idPost);
    });
    
    /* Fin de la función show post */
  }; 

  /* Eliminar publicación */
  const modalDiv = timeLineSection.querySelector('#modalDiv');
  const confirmDelete = (e) => {
    if(e.target.className === 'delete-confirm'){
      const idPost = e.target.parentElement.getAttribute('data-id');
      deletePost(idPost);
      modalDiv.removeAttribute('data-id');
      modalDiv.style.display = 'none';
    }else if(e.target.className === 'cancel-delete'){
      modalDiv.removeAttribute('data-id');
      modalDiv.style.display = 'none';
    }
  };
  modalDiv.addEventListener('click', confirmDelete);  
  
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