const create = async (board) => {
  try {
    let response = await fetch('http://localhost:5000/api/boards/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(board),
    });
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

const listTaskBoards = async (projectId) => {
  try {
    let response = await fetch(
      `http://localhost:5000/api/boards/${projectId}`,
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

const deleteBoard = async (boardId) => {
  try {
    let response = await fetch(`http://localhost:5000/api/boards/${boardId}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

export { create, listTaskBoards, deleteBoard };
