import { signout } from './auth';

const authenticate = async (jwt) => {
  if (typeof window !== 'undefined') {
    await sessionStorage.setItem('jwt', JSON.stringify(jwt));
  }
};

const isAuthenticated = () => {
  if (typeof window == 'undefined') return false;
  if (sessionStorage.getItem('jwt'))
    return JSON.parse(sessionStorage.getItem('jwt'));
  else return false;
};

const clearJWT = (cb) => {
  if (typeof window !== 'undefined') sessionStorage.removeItem('jwt');
  cb();
  //optional
  signout().then((data) => {
    document.cookie = 't=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  });
};

export { authenticate, isAuthenticated, clearJWT };
