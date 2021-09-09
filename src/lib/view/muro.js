import { logOutUser } from "../index.js";

export const createTimeLineView = () => {
  const timeLineSection = document.createElement("section");
  const timeLineView = `  
      <h1> Bienvenido al Muro </h1>
      <button type="button" id ='logOut'> <img src="images/log-out1.png" alt="Log Out" /></button>
      <div id="prueba"></div>
  `;
  timeLineSection.innerHTML = timeLineView;
  const logOut = timeLineSection.querySelector("#logOut");

  const user = firebase.auth().currentUser;
  console.log(user);

  const pruebaName = timeLineSection.querySelector("#prueba");
  pruebaName.innerHTML = `Hola ${user.displayName}`;

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
