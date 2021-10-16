export const initialState = {
  project: {},
  user: {},
  allUsers: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SIGN_IN':
      return {
        ...state,
        user: action.user,
      };
    case 'SELECTED_PROJECT':
      return {
        ...state,
        project: action.project,
      };
    case 'UPDATE_ALL_USERS':
      return {
        ...state,
        allUsers: action.allUsers,
      };
    default:
      return state;
  }
};

export default reducer;
