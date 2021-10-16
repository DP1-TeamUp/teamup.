const getOnline = async (body) => {
  try {
    let response = await fetch('http://localhost:5000/api/actives', {
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

const getOffline = async (body) => {
  try {
    let response = await fetch('http://localhost:5000/api/actives', {
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

const getActives = async (projectId) => {
  try {
    let response = await fetch(
      `http://localhost:5000/api/actives/${projectId}`,
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

export { getActives, getOffline, getOnline };
