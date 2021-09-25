import { createLogInView } from './view/ingreso.js';
import { createRegisterView } from './view/registro.js';
import { createTimeLineView } from './view/muro.js';

export const changeRoute = (hash) => {
  const mainSection = document.getElementById('main-section');
  mainSection.innerHTML = '';

  switch (hash) {
    case '':
      mainSection.appendChild(createLogInView());
      break;
    case '#/ingreso':
      mainSection.appendChild(createLogInView());
      break;
    case '#/registro':
      mainSection.appendChild(createRegisterView());
      break;
    case '#/muro':
      mainSection.appendChild(createTimeLineView());
      break;
    default:
      mainSection.innerHTML = '<h2 class = "error404" >No Existe</h2>';
  }
};
