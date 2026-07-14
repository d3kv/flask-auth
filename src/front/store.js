export const initialStore = () => {
  return {
    message: null,
    token: sessionStorage.getItem("token") || null,
    user: null
  }
}

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case 'set_hello':
      return {
        ...store,
        message: action.payload
      };

    case 'login':
      return {
        ...store,
        token: action.payload.token,
        user: action.payload.user
      };

    case 'logout':
      return {
        ...store,
        token: null,
        user: null
      };

    default:
      return store;
  }
}
