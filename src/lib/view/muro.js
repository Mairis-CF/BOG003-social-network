import { savePost, getPosts, editPost, logOutUser } from '../index.js';

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
    postContainer.setAttribute('data-id', doc.id); 

    const postBy = document.createElement('p');
    postBy.setAttribute('class', 'post-by');

    const postContent = document.createElement('p');
    postContent.setAttribute('class', 'post-content');

    const buttons = document.createElement('div');

    const spanLike = document.createElement('span');
    spanLike.setAttribute('data-id', doc.id); 
    const likeButton = `
      <button class="like-button" id="likeBtn">
        <img src="images/like.png" alt="me gusta">
      </button>  
    `;
    spanLike.innerHTML = likeButton;

    const spanEdit = document.createElement('span');
    spanEdit.setAttribute('data-id', doc.id); 
    const editButton = `
      <button class="edit-button" id="editBtn">
         <img src="images/pencil.png" alt="editar">
      </button>
    `;
    spanEdit.innerHTML = editButton;
    spanEdit.className = 'spanEdit';

    const spanDelete = document.createElement('span');
    spanDelete.setAttribute('class', doc.id); 
    const deleteButton = `
      <button class="delete-button" id="deleteBtn">
        <img src="images/bin.png" alt="eliminar">
      </button>
    `;
    spanDelete.innerHTML = deleteButton;
    spanDelete.className = 'spanDelete';
    /* Agregar el texto del nombre y la publicación a los elementos */
    postBy.textContent = `Publicado por ${doc.data().user}`;
    postContent.textContent = doc.data().userPost;

    /* Agregar el nombre y texto al container y luego a la sección del DOM */
    postContainer.appendChild(postBy);
    postContainer.appendChild(postContent);
    buttons.append(spanLike, spanEdit, spanDelete);
    postContainer.appendChild(buttons);
    postSection.appendChild(postContainer);

    const currentUserId = firebase.auth().currentUser.uid;
    const userIdPost = doc.data().userId;

    if (currentUserId === userIdPost) {
      spanEdit.style.display = 'block';
      spanDelete.style.display = 'block';
    }
  };

  /* Obtener los post de la base de datos y mostrarlos en el dom */
  getPosts((snapshot) => {
    postSection.innerHTML = '';
    snapshot.docs.forEach((doc) => {
      showPost(doc);
    });
  });

  // setTimeout(() => {
  //   const editBtn = postSection.querySelectorAll('.spanEdit');
  //   console.log(editBtn);
  //   editBtn.forEach((btn) => {
  //     btn.addEventListener('click',() => {
        
  //   })
 
  //   })
  
  // },1500)
  setTimeout(() => {
    const deleteBtn = timeLineSection.querySelectorAll('.spanDelete');
    console.log(deleteBtn);
    deleteBtn.forEach((btn) => {
      btn.addEventListener('click', (e) =>{
      console.log(e.target)
      })
    })
  },2000)
 

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
