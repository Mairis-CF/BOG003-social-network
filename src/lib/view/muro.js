import { savePost, getPost, logOutUser } from "../index.js";

export const createTimeLineView = () => {
  const timeLineSection = document.createElement("section");
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
      const userName = timeLineSection.querySelector("#userName");
      userName.textContent = user.displayName;
    }
  });

  /* Guardar el post en la base de datos*/
  const postForm = timeLineSection.querySelector("#postForm");  
    
  postForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const userName = firebase.auth().currentUser.displayName;
    const postText = postForm.post.value;
    savePost(userName, postText);
    postForm.reset();
  });

  /* Crear e insertar los elementos de un post en el DOM */
  const postSection = timeLineSection.querySelector("#postSection");
  
  const showPost = (doc) => {
    /* Crear los elementos de la publicación y agregar clase para estilos*/
    const postContainer = document.createElement('div');
    postContainer.setAttribute('class', 'post-container');
    postContainer.setAttribute('data-id', doc.id);

    const postBy = document.createElement('p');
    postBy.setAttribute('class', 'post-by');

    const postContent = document.createElement('p');
    postContent.setAttribute('class', 'post-content');

    /* Agregar el texto del nombre y la publicación a los elementos */
    postBy.textContent = `Publicado por ${doc.data().user}`;
    postContent.textContent = doc.data().userPost;

    /* Agregar el nombre y texto al container y luego a la sección del DOM */
    postContainer.appendChild(postBy);
    postContainer.appendChild(postContent);

    postSection.appendChild(postContainer);
  };
  
  /* Obtener los post de la base de datos y mostrarlos en el dom*/
  getPost().then((snapshot) => {
    snapshot.docs.forEach(doc => {
      showPost(doc);
    });
  })

  /* Botón para que el usuario cierre sesión */
  const logOut = timeLineSection.querySelector("#logOut");
  logOut.addEventListener("click", (e) => {
    e.preventDefault();
    logOutUser()
      .then(() => {
        window.location.hash = "#/ingreso";
      })
      .catch((error) => {
        console.log(error);
      });
  });

  return timeLineSection;
};

/* posts = [
    { "sdjsahdsaklhdsa" : ¨{
      user: "string",
      post: "string2"
      }
    },
    { "sdjsahdsaklhdsa" : ¨[
      user: "string",
      post: "string2"
      ]
    },
    { "sdjsahdsaklhdsa" : ¨[
      user: "string",
      post: "string2"
      ]
    }
  ] */

/* const btnPost = timeLineSection.querySelector("#btnPost");

btnPost.addEventListener("click", () => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log("Estoy logueado");
      const userNameContainer = timeLineSection.querySelector(".post-by");
      userNameContainer.innerHTML = `publicado por ${user.displayName}`;
    }
  });
});

const postForm = timeLineSection.querySelector("#post");
const postText = timeLineSection.querySelector(".post-text");

const savePost = (inputPost) => {
  db.collection("posts").doc().set({
    inputPost: inputPost,
  });
};


postForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const inputPost = postForm["postInput"];

  await savePost(inputPost.value);

  postForm.reset();
}); */
