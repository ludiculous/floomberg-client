import {
  LOADING_REQUEST
} from './types';


export const loadingReq = (status) => {
  return{
    type: LOADING_REQUEST,
    payload: status
  }
}
