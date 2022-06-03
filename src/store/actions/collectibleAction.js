import ACTION from '../actionTypes';

export const setCollectibleData = (collectible) => {
  return {
    type: ACTION.SET_BUY_COLLECTIBLE_DATA,
    payload: {...collectible}
  };
};
