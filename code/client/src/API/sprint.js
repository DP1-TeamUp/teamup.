const create = async (body) => {
  try {
    let response = await fetch('http://localhost:5000/api/sprints', {
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

const getSprints = async (credentials, projectId) => {
  try {
    let response = await fetch(
      `http://localhost:5000/api/sprints/${projectId}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + credentials.t,
        },
      }
    );
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

const getSprintDetails = async (body) => {
  try {
    let response = await fetch(
      `http://localhost:5000/api/sprints/info/${body.sprintId}`,
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

const deleteSprint = async (sprintId) => {
  try {
    let response = await fetch(
      `http://localhost:5000/api/sprints/${sprintId}`,
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

const getCurrentSprint = async (credentials, projectId) => {
  try {
    let response = await fetch(
      `http://localhost:5000/api/currentSprint/${projectId}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + credentials.t,
        },
      }
    );
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

export { create, getSprints, getSprintDetails, deleteSprint, getCurrentSprint };
