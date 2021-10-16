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

const update = async (params, credentials, user) => {
  try {
    let response = await fetch(
      'http://localhost:5000/api/users/' + params.userId,
      {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + credentials.t,
        },
        body: user,
      }
    );
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const remove = async () => {};

const forgetPassword = async (body) => {
  try {
    let response = await fetch('http://localhost:5000/forget-password', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const resetPassword = async (body) => {
  try {
    let response = await fetch(
      `http://localhost:5000/reset-password/${body.resetToken}`,
      {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const addSkill = async (body) => {
  try {
    let response = await fetch(`http://localhost:5000/api/skills/users`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const deleteSkill = async (body) => {
  try {
    let response = await fetch(`http://localhost:5000/api/skills/users`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const getNotifications = async (uid) => {
  try {
    let response = await fetch(
      `http://localhost:5000/api/notifications/${uid}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const deleteNotifications = async (uid) => {
  try {
    let response = await fetch(
      `http://localhost:5000/api/notifications/${uid}`,
      {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

export {
  create,
  list,
  read,
  update,
  remove,
  forgetPassword,
  resetPassword,
  addSkill,
  deleteSkill,
  getNotifications,
  deleteNotifications,
};
