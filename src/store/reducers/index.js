import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import searchReducer from './searchReducer';
import authReducer from './authReducer';
import dialogReducer from './dialogReducer';
import collectibleReducer from './collectibleReducer';

export default (history) => combineReducers({
  router: connectRouter(history),
  search: searchReducer,
  auth: authReducer,
  dialogs: dialogReducer,
  collectible: collectibleReducer
});
