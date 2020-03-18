import {
  FETCH_INTETF_CATEGORY,
  FETCH_INTETF_TICKER,
  FETCH_INTETF_TICKER_LIST,
  FETCH_INTETF_CAT_LIST,
  FETCH_ERROR
} from '../../actions/types';

const Inital_State = {
  intEtfData: [],
  intEtfTickerList: [],
  intEtfCatList: [],
  intEtfErr: {}
}

export default (state = Inital_State, action) => {
  console.log(action.type)
  switch (action.type) {
    case FETCH_INTETF_CATEGORY:
      console.log("fetching intetf category in reducer")
      return {...state, intEtfData: action.payload}

    case FETCH_INTETF_TICKER:
      console.log("fetching intetf category in reducer", action.type)
      console.log(action.payload)
      return Object.assign({}, state, {intEtfData: action.payload})
      //return {...state, intEtfData: action.payload}

    case FETCH_INTETF_TICKER_LIST:
      console.log("fetching intetf ticker list in reducer")
      return {...state, intEtfTickerList: action.payload}

    case FETCH_INTETF_CAT_LIST:
      console.log("fetching intetf catList in reducer")
      return {...state, intEtfCatList: action.payload}

    case FETCH_ERROR:
      console.log("fetching intetf ticker list in reducer")
      return {...state, intEtfErr: action.payload}

    default:
      console.log('defaulting on intETF')
      return state;
  }
}