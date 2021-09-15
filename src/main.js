import { createLogInView } from "./lib/view/ingreso.js";
import { changeRoute } from "./lib/router.js";


const init = () => {
  document.getElementById('main-section').appendChild(createLogInView());
  changeRoute(window.location.hash);
  window.addEventListener('hashchange', () => {
    changeRoute(window.location.hash);
  })
}

window.addEventListener('load', init);

