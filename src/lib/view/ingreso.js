import { signInUser, signInWithGoogle } from "../index.js";

export const createLogInView = () => {
  const loginSection = document.createElement("section");
  loginSection.setAttribute('class', 'login-section');
  const loginView = `
  <div class="brand">
    <div class="young-guy">
      <img src="images/niño.png" alt="Logo for mobile">
    </div>
    <div class="logo-long">
      <img src="images/logo_long.png" alt="Behind Code">
    </div>
    <div class="old-man">
      <img src="images/señor.png" alt="Logo for desktop">
    </div>
  </div>
  <div class="log-in">
    <h1>Ingresa a tu cuenta</h1>
    <form method="post">
      <input type="email" name="email" id="emailSignIn" placeholder="Correo" required>
      <input type="password" name="password" id="passwordSignIn" placeholder="Contraseña" required>
      <p id="message"></p>
      <button type="submit" id="btnSignIn">Ingresar</button>
    </form>
    <p class="or">o</p>
    <p>Ingresa con tu cuenta de Google</p>
    <button type="button" class="Google-login">
        <img src="images/google.png" alt="Log in with Google">
    </button>
    <p>¿No tienes una cuenta?</p>
    <div class="new-account">
      <a href="#/registro">Crea una cuenta AQUI</a>
    </div>
  </div>`;
  loginSection.innerHTML = loginView;

  const emailSignIn = loginSection.querySelector("#emailSignIn");
  const passwordSignIn = loginSection.querySelector("#passwordSignIn");
  const btnSignIn = loginSection.querySelector("#btnSignIn");
  const messageContainer = loginSection.querySelector('#message');

  btnSignIn.addEventListener("click", (e) => {
    e.preventDefault();
    const email = emailSignIn.value;
    const password = passwordSignIn.value;

    signInUser(email, password)
      .then(() => {
        window.location.hash = "#/muro";
      })
      .catch((error) => {
        /* validaciones de firebase */
        var errorCode = error.code;
        switch (errorCode) {
          case "auth/user-not-found":
            messageContainer.setAttribute("class", "error");
            messageContainer.innerHTML = "❌ Usuario no registrado";
            break;

          case "auth/wrong-password":
            messageContainer.setAttribute("class", "error");
            messageContainer.innerHTML = "❌ Contraseña incorrecta";
            break;

          case "auth/invalid-email":
            messageContainer.setAttribute("class", "error");
            messageContainer.innerHTML = "❌ Correo inválido";
            break;
        }
      });
  });

  /* Quitar el mensaje de error cuando el usuario escriba */
  const clearErrorMessage = (e) => {
    if (e.target.tagName === "INPUT") {
    messageContainer.innerHTML = "";
    }
  };

  const form = loginSection.querySelector("form");
  form.addEventListener("keyup", clearErrorMessage); 

  const btnGoogle = loginSection.querySelector(".Google-login");

  btnGoogle.addEventListener("click",(e) => {
    e.preventDefault();
    signInWithGoogle()
    .then(() => {
      window.location.hash = "#/muro";
    }).catch ((error) => {
      console.log(error.message);
    })
  })
  return loginSection;
};

