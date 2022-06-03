import ACTION from '../actionTypes';

const initialState = {
  buyCollectibleDialog: {
    show: false
  },
};

export default function dialogReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case ACTION.OPEN_BUY_COLLECTIBLE_DIALOG:
      return {
        ...state,
        buyCollectibleDialog: {
          ...state.buyCollectibleDialog,
          show: true
        }
      };

    case ACTION.CLOSE_BUY_COLLECTIBLE_DIALOG:
      return {
        ...state,
        buyCollectibleDialog: {
          ...state.buyCollectibleDialog,
          show: false
        }
      };

    default:
      return state;
  }
}
