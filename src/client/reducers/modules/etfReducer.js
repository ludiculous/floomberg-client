import {
  FETCH_ETF_TICKER,
  FETCH_ETF_TICKER_LIST,
  FETCH_MSCATEGORY,
  FETCH_MSCATEGORY_LIST,
  FETCH_ASSET,
  FETCH_ASSET_LIST,
  FETCH_ERROR
} from '../../actions/types';

const Initial_State = {
  etfData:[],
  etfTickerList: [],
  etfMSCatList: [],
  etfAssetList: [],
  etfTickerData:[],
  etfErr: {}
};

export default (state = Initial_State, action) => {
  switch (action.type) {
    case FETCH_ETF_TICKER:
      console.log(action.payload);
      return {...state, etfData: action.payload}
    break;
      //return Object.assign({}, state, {tickerData:action.payload});
    case FETCH_MSCATEGORY:
      console.log('coming from ms category', action.payload)
      return {...state, etfData:action.payload};
    break;

    case FETCH_ASSET:
      return {...state, etfData:action.payload};
    break;

    case FETCH_ETF_TICKER_LIST:
      return {...state, etfTickerList: action.payload}
    break;

    case FETCH_ASSET_LIST:
      return {...state, etfAssetList: action.payload}
    break;

    case FETCH_MSCATEGORY_LIST:
      return {...state, etfMSCatList: action.payload}
    break;

    case FETCH_ERROR:
      return {...state, etfErr: action.payload}
    break;

    default:
    return state
  }
}