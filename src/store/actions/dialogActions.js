import ACTION from '../actionTypes';

export const openCollectibleBuyDialog = () => {
  return {
    type: ACTION.OPEN_BUY_COLLECTIBLE_DIALOG
  };
};

export const closeCollectibleBuyDialog = () => {
  return {
    type: ACTION.CLOSE_BUY_COLLECTIBLE_DIALOG
  };
};

