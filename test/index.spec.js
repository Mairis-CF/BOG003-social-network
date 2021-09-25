import { signInUser, logOutUser, signInWithGoogle } from '../src/lib/index.js';

const firebasemock = require('firebase-mock');

const mockauth = new firebasemock.MockAuthentication();
const mocksdk = new firebasemock.MockFirebaseSdk(
  () => null,
  () => mockauth,
);
global.firebase = mocksdk;
mocksdk.auth().autoFlush();

describe('signInUser', () => {
  it('deberia permitir iniciar sesión con correo y contraseña', () => signInUser('karenp@gmail.com', '1234567')
    .then((user) => {
      expect(user.email).toBe('karenp@gmail.com');
    }));
});

describe('logOutUser', () => {
  it('Deberia cerrar sesión', () => logOutUser()
    .then((user) => {
      expect(user).toBe(undefined);
    }));
});

describe('signInWithGoogle', () => {
  it('Deberia iniciar sesion con cuenta de Google', () => signInWithGoogle()
    .then((result) => {
      expect(typeof result).toBe('object');
    }));
});
