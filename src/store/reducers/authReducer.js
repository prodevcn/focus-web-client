import ACTION from "../actionTypes";

const initialState = {
  user: {
    picture: "/img/4.png",
    name: "",
  },
  signature: "",
};

export default function authReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case ACTION.LOGIN:
      return {
        ...state,
        user: payload.user,
      };
    case ACTION.LOGOUT:
      return {
        ...state,
        user: null,
      };
    case ACTION.SET_SIGNATURE:
      return {
        ...state,
        signature: payload,
      };
    default:
      return state;
  }
}
