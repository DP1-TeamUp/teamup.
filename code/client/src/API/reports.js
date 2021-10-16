const getAllReports = async (projectId) => {
  try {
    let response = await fetch(
      `http://localhost:5000/api/reports/${projectId}`,
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

export { getAllReports };
