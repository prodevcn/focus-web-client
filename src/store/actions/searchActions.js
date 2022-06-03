import ACTION from '../actionTypes';

export const setSearchWord = (searchWord) => {
  return {
    type: ACTION.SET_SEARCH_WORD,
    payload: { searchWord }
  }
};
