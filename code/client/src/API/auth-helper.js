  
const auth = {
    authenticate(jwt) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('jwt', JSON.stringify(jwt));
      }
    },
  };
  
  const authenticate = async (jwt) => {
    if (typeof window !== 'undefined') {
      await sessionStorage.setItem('jwt', JSON.stringify(jwt));
    }
  };
  
  export { authenticate };