export const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
    case 'LOAD_USER':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
        error: null
      };

    case 'LOGOUT':
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.type === 'AUTH_ERROR' ? action.payload?.error : null
      };

    case 'LOADING':
      return {
        ...state,
        loading: true,
        error: null
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload.error,
        loading: false
      };

    default:
      return state;
  }
};