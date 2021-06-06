const create = async (user) => {
    try {
      let response = await fetch('http://localhost:5000/api/users/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      return await response.json();
    } catch (error) {
      console.log(error);
    }
  };
  
  const list = async (signal) => {
    try {
      let response = await fetch('http://localhost:5000/api/users/', {
        method: 'GET',
        signal: signal,
      });
      return await response.json();
    } catch (error) {
      console.log(error);
    }
  };
  
  const read = async () => {};
  
  const update = async () => {};
  
  const remove = async () => {};
  
  export { create, list, read, update, remove };