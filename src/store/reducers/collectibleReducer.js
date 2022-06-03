import ACTION from '../actionTypes';

const initialState = {
};

export default function collectibleReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case ACTION.SET_BUY_COLLECTIBLE_DATA:
      const id = payload.id;
      return {
        ...state,
        [id]: {...payload}
      };

    default:
      return state;
  }
};

