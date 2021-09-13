import { logOutUser } from "../index.js";

export const createTimeLineView = () => {
  const timeLineSection = document.createElement("section");
  const timeLineView = `  
      <h1> Bienvenido al Muro </h1>
      <button type="button" id ='logOut'> <img src="images/log-out1.png" alt="Log Out" /></button>
      <form id="post">
      <textarea id="postInput" name="post" placeholder="Comparte tu experiencia..."></textarea>
      <button type="submit" id="btnPost">Publicar</button>
    </form>

  `;
  timeLineSection.innerHTML = timeLineView;
  const logOut = timeLineSection.querySelector("#logOut");
  const btnPost = timeLineSection.querySelector("#btnPost");

  // const user = firebase.auth().currentUser;
  // console.log(user);
  btnPost.addEventListener("click", () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log("Estoy logueado");
        const userNameContainer = timeLineSection.querySelector(".post-by");
        userNameContainer.innerHTML = `publicado por ${user.displayName}`;
      } else {
        console.log("User is signed out");
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
  });

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


