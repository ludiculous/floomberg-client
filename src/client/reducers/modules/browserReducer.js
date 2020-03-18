import {
  LOADING_REQUEST
} from '../../actions/types';

const Initial_State = {
  apiLoading: false,
  browserHeight: 0,
  browserWidth: 0
}

export default (state = Initial_State, action) => {
  switch(action.type) {
    case LOADING_REQUEST:
      console.log("loading api from reducer")
      return {...state, apiLoading: action.payload}

    default:
      return state;
  }
}