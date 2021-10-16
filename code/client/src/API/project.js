const user = JSON.parse(sessionStorage.getItem('jwt'));

const create = async (project) => {
  try {
    let response = await fetch('http://localhost:5000/api/projects/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

const changeMemberDesignation = async (body) => {
  try {
    let response = await fetch('http://localhost:5000/api/projects/', {
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

const findProjectByUserId = async (userId) => {
  const id = userId || user.user._id;
  try {
    let response = await fetch(
      `http://localhost:5000/api/projects/user/${id}/`,
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

const listAllMembers = async (projectId) => {
  try {
    let response = await fetch(
      `http://localhost:5000/api/projects/members/${projectId}/`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
    return response.json();
  } catch (error) {
    console.log(error);
  }
};

const addNewMember = async (credentials, body) => {
  try {
    let response = await fetch(
      `http://localhost:5000/api/projects/members/${body.projectId}/`,
      {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + credentials.t,
        },
        body: JSON.stringify(body),
      }
    );
    return response.json();
  } catch (error) {
    console.log(error);
  }
};

const removeMember = async (credentials, body) => {
  try {
    let response = await fetch(
      `http://localhost:5000/api/projects/members/${body.projectId}/`,
      {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + credentials.t,
        },
        body: JSON.stringify(body),
      }
    );
    return response.json();
  } catch (error) {
    console.log(error);
  }
};

const listAllSprints = async (body) => {
  try {
    let response = await fetch(
      `http://localhost:5000/api/projects/sprints/${body.projectId}/`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );
    return response.json();
  } catch (error) {
    console.log(error);
  }
};

const belongsToProject = async (credentials, projectId) => {
  try {
    let response = await fetch(
      `http://localhost:5000/auth/projects/${projectId}/`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + credentials.t,
        },
      }
    );
    return response.json();
  } catch (error) {
    console.log(error);
  }
};

export {
  create,
  findProjectByUserId,
  listAllMembers,
  addNewMember,
  removeMember,
  listAllSprints,
  changeMemberDesignation,
  belongsToProject,
};
