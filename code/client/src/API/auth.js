const signin = async (user) => {
  try {
    let response = await fetch('http://localhost:5000/auth/signin/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(user),
    });
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

const signout = async () => {
  try {
    let response = await fetch('http://localhost:5000/auth/signout/', {
      method: 'GET',
    });
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

const emailVerification = async (body) => {
  try {
    let response = await fetch('http://localhost:5000/emailVerification', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

export { signin, signout, emailVerification };
