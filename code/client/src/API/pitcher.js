const createTextPitcher = async (body) => {
  try {
    let response = await fetch('http://localhost:5000/api/pitchers/text', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return response.json();
  } catch (error) {
    console.log(error);
  }
};

const createImagePitcher = async (form) => {
  try {
    let response = await fetch('http://localhost:5000/api/pitchers/image', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: form,
    });
    return response.json();
  } catch (error) {
    console.log(error);
  }
};

const getPitchers = async (projectId) => {
  try {
    let response = await fetch(
      `http://localhost:5000/api/pitchers/${projectId}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

const update = async (body) => {
  try {
    let response = await fetch('http://localhost:5000/api/pitchers', {
      method: 'PUT',
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

const deletePitchers = async (body) => {
  try {
    let response = await fetch('http://localhost:5000/api/pitchers', {
      method: 'DELETE',
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

const deleteAllPitchers = async (projectId) => {
  try {
    let response = await fetch(
      `http://localhost:5000/api/pitchers/${projectId}`,
      {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

export {
  createTextPitcher,
  getPitchers,
  update,
  createImagePitcher,
  deletePitchers,
  deleteAllPitchers,
};
