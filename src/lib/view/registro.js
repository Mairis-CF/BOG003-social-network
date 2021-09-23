import { createUser } from '../index.js';
import { signInWithGoogle } from '../index.js';

export const createRegisterView = () => {
  const registerSection = document.createElement('section');
  registerSection.setAttribute('class', 'register-section');
  const registerView = `
  <div class="brand">
      <div class="logo-long">
        <img src="images/logo_long.png" alt="Behind Code">
      </div>
      <div class="old-man">
        <img src="images/señor.png" alt="Logo for desktop">
      </div>
    </div>
    <div class="log-in">
      <h1>Formulario de Registro</h1>
      <form method="post">
        <input id="userName" type="text" name="name" placeholder="Nombre" min-length="2"required>
        <input id="lastName" type="text" name="lastName" placeholder="Apellido" min-length="2" required>
        <input id="email" type="email" name="email" placeholder="Correo" required>
        <input id="password" type="password" name="password" placeholder="Contraseña" required>
        <input id="passwordTwo" type="password" name="passwordTwo" placeholder="Confirma tu contraseña" required>
        <p id="message"></p>
        <button id="register" type = "submit">Regístrate</button>
      </form>
      <div class="new-account">
        <a href="#/ingreso">¿Ya tienes una cuenta?</a>
      </div>
      <p class ="o">or</p>
      <p>Ingresa con </p>
      <button type="button" class="Google-login">
          <img src="images/google.png" alt="Log in with Google">
      </button>    
  </div>`;
  registerSection.innerHTML = registerView;

  const btnRegister = registerSection.querySelector('#register');
  const nameInput = registerSection.querySelector('#userName');
  const lastNameInput = registerSection.querySelector('#lastName');
  const emailInput = registerSection.querySelector('#email');
  const passwordInput = registerSection.querySelector('#password');
  const passwordInputConfirm = registerSection.querySelector('#passwordTwo');
  const messageContainer = registerSection.querySelector('#message');

  /* Evento para enviar el formulario */
  btnRegister.addEventListener('click', (e) => {
    e.preventDefault();
    const userName = nameInput.value;
    const lastName = lastNameInput.value;
    const fullName = userName + ' ' + lastName;
    const email = emailInput.value;
    const password = passwordInput.value;
    const passwordConfirm = passwordInputConfirm.value;

    /* validaciones de campos */
    if(userName === ''|| lastName === '' || email === '' || password === '' || passwordConfirm === ''){
      messageContainer.setAttribute('class', 'error');
      messageContainer.innerHTML = "❌ Hay campos vacíos";
    } else if(userName.length < 2|| lastName.length < 2){
      messageContainer.setAttribute('class', 'error');
      messageContainer.innerHTML = "❌ Tu nombre y apellido deben tener mínimo 2 caracteres";
    } else if(password !== passwordConfirm){
      messageContainer.setAttribute('class', 'error');
      messageContainer.innerHTML = "❌ Tu contraseña no coincide";
    }
    else {
      createUser(email, password, fullName)
      .then(()=>{
        messageContainer.removeAttribute('class', 'error');
        messageContainer.innerHTML = "✅ Gracias por registrarte";
        setTimeout(()=>{window.location.hash = '#/muro'; }, 2000);
      }).catch((error) => {
        /* validaciones de firebase */
        var errorCode = error.code;
        switch (errorCode) {
          case "auth/invalid-email":
            messageContainer.setAttribute('class', 'error');
            messageContainer.innerHTML = "❌ Ingrese un correo válido";
            break;
          
          case "auth/weak-password":
            messageContainer.setAttribute('class', 'error');
            messageContainer.innerHTML = "❌ La contraseña debe tener mínimo 6 caracteres";
            break;

          case "auth/email-already-in-use":
            messageContainer.setAttribute('class', 'error');
            messageContainer.innerHTML = "❌ El correo ya está registrado";
            break;
        }
      });
    }
  })
  
  /* Quitar el mensaje de error cuando el usuario escriba */
  const clearErrorMessage = (e) => {
    if(e.target.tagName === 'INPUT'){
      messageContainer.innerHTML = '';
    }
  }
  
  const form = registerSection.querySelector('form');
  form.addEventListener('keyup', clearErrorMessage); 

  const btnGoogle = registerSection.querySelector(".Google-login");

  btnGoogle.addEventListener("click",(e) => {
    e.preventDefault();
    signInWithGoogle()
    .then(() => {
      window.location.hash = "#/muro";
    }).catch ((error) => {
      console.log(error.message);
    })
  })

  return registerSection;
};

