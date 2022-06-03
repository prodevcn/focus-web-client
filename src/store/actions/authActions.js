import ACTION from "../actionTypes";

export const login = (user) => {
  return {
    type: ACTION.LOGIN,
    payload: { user },
  };
};

export const logout = () => {
  return {
    type: ACTION.LOGOUT,
  };
};

export const setSignature = (signature) => {
  return {
    type: ACTION.SET_SIGNATURE,
    payload: signature,
  };
};
