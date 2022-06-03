import ACTION from '../actionTypes';

const initialState = {
  searchWord: ''
};

export default function searchReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case ACTION.SET_SEARCH_WORD:
      return {
        ...state,
        searchWord: payload.searchWord
      };

    default:
      return state;
  }
};

