import {
  FETCH_CONTRACT,
  FETCH_SUMMATION,
  FETCH_AGGREGATION,
  FETCH_EXPIRATION_LIST,
  FETCH_FCATEGORY_LIST,
  FETCH_ERROR
} from '../../actions/types';

const Inital_State = {
  futureData: [],
  futureCategoryList: [],
  futureExpirationList: [],
  futureErr: {}
}

export default (state = Inital_State, action) => {
  console.log(action.type)
  switch (action.type) {
    case FETCH_CONTRACT:
      console.log("fetching future contract in reducer")
      return {...state, futureData: action.payload}
    break;

    case FETCH_SUMMATION:
      return {...state, futureData: action.payload}
    break;

    case FETCH_AGGREGATION:
      console.log("fetching future agg in reducer")
      return {...state, futureData: action.payload}
    break;
    // same as getting contract list
    case FETCH_EXPIRATION_LIST:
      console.log("fetching future expiration in reducer")
      return {...state, futureExpirationList: action.payload}
    break;

    case FETCH_FCATEGORY_LIST:
      console.log("fetching fcategory in reducer")
      return {...state, futureCategoryList: action.payload}

    case FETCH_ERROR:
      return {...state, futureErr: action.payload}
    break;

    default:
      console.log('defaulting on auth')
      return state;
  }
}