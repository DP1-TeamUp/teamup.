const create = async (credentials, task) => {
  try {
    let response = await fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + credentials.t,
      },
      body: JSON.stringify(task),
    });
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

const listTasksByProjectId = async (credentials, projectId) => {
  try {
    let response = await fetch(`http://localhost:5000/api/tasks/${projectId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + credentials.t,
      },
    });
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

const getMyTask = async (userId) => {
  try {
    let response = await fetch(
      `http://localhost:5000/api/tasks/users/${userId}`,
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

const updateTask = async (credentials, body) => {
  try {
    let response = await fetch(
      `http://localhost:5000/api/tasks/${body.taskId}`,
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
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

const updateTaskFromKanban = async (body) => {
  try {
    let response = await fetch(
      `http://localhost:5000/api/tasks/kanban/${body.taskId}`,
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
  } catch (error) {
    console.log(error);
  }
};

const deleteTask = async (credentials, taskId) => {
  try {
    let response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + credentials.t,
      },
    });
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

const getSuggestions = async (body) => {
  try {
    let response = await fetch(
      `http://localhost:5000/api/tasks/suggestions/assignment`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

export {
  create,
  listTasksByProjectId,
  getMyTask,
  updateTask,
  updateTaskFromKanban,
  deleteTask,
  getSuggestions,
};
