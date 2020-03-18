import { combineReducers } from 'redux';
import etfReducer from './modules/etfReducer';
import intEtfReducer from './modules/intEtfReducer';
import authReducer from './modules/authReducer';
import futureReducer from './modules/futureReducer';
import browserReducer from './modules/browserReducer';
import fileReducer from './modules/fileReducer';

export default combineReducers({
  browser: browserReducer,
  etfs: etfReducer,
  intetfs: intEtfReducer,
  futures: futureReducer,
  files: fileReducer,
  auth: authReducer
})