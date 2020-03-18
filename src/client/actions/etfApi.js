import axios from 'axios';

import {
  FETCH_ETF_TICKER,
  FETCH_ETF_TICKER_LIST,
  FETCH_MSCATEGORY,
  FETCH_ASSET,
  FETCH_ASSET_LIST,
  FETCH_MSCATEGORY_LIST,
  FETCH_ERROR,
  LOADING_REQUEST
} from './types';

import {loadingReq} from './browserApi.js'
const base_url = 'api/getEtfFlow'

export const getEtfFlowTicker = (data) => {
  console.log(data)
  let token = localStorage.getItem('floomtoken') || null;
  let qs = `${base_url}`
  qs += `/ticker?`;

  data.fromDate.length > 0 ? qs += `from_date=${data.fromDate}&` : '';
  data.toDate.length > 0 ? qs += `to_date=${data.toDate}&` : '';
  data.tickerSymbol.length > 0 ? qs += data.tickerSymbol.map((symbol)=>`&symbols[]=${symbol}`).join('') : '';
  console.log(token)
  console.log(qs)
  return dispatch => {
    // send api request status
    dispatch(loadingReq(true));
    axios({
      method: 'get',
      url: qs,
      headers: {Authorization: `Bearer ${token}`}
    }).then((res)=>{
      dispatch({
        type: FETCH_ETF_TICKER,
        payload: res.data
      })
      dispatch(loadingReq(false));
    }).catch(err=>{
      console.log(err);
      dispatch(loadingReq(false))
      dispatch(etfError(err));
    })
  }
}

export const getEtfFlowMScat = (data) => {
  let token = localStorage.getItem('floomtoken') || null;
  let qs = `${base_url}`
  qs += `/msCategory?`;
  console.log(data)
  data.fromDate.length > 0 ? qs += `?from=${data.fromDate}&` : '';
  data.toDate.length > 0 ? qs += `from${data.toDate}&` : '';
  data.msCategory.length > 0 ? qs += data.msCategory.map((msCat)=> `&msCats[]=${msCat}`).join('') : '';
  console.log(qs)
  return dispatch=>{
    dispatch(loadingReq(true));
    axios({
      method: 'get',
      url: qs,
      headers: {Authorization: `Bearer ${token}`}
    }).then((res)=>{
      console.log(res.data)
      dispatch({
        type: FETCH_MSCATEGORY,
        payload: res.data
      })
      dispatch(loadingReq(false));
    }).catch(err=>{
      console.log(err);
      dispatch(loadingReq(false))
      dispatch(etfError(err));
    })
  }
}

export const getEtfFlowAsset = (data) => {
  let token = localStorage.getItem('floomtoken') || null;
  let qs = `${base_url}`
  qs += `/assetCategory?`;

  data.fromDate.length > 0 ? qs += `?from=${data.fromDate}&` : '';
  data.toDate.length > 0 ? qs += `from${data.toDate}&` : '';
  data.assetCategory.length > 0 ? qs += data.assetCategory.map((assetCat)=>`&assetCats[]=${assetCat}`).join('') : '';
  console.log(data)
  console.log(qs)
  return dispatch=>{
    dispatch(loadingReq(true));
    axios({
      method: 'get',
      url: qs,
      headers: {Authorization: `Bearer ${token}`}
    }).then((res)=>{
      dispatch({
        type: FETCH_ASSET,
        payload: res.data
      })
      dispatch(loadingReq(false));
    }).catch(err=>{
      console.log(err);
      dispatch(loadingReq(false))
      dispatch(etfError(err));
    })
  }
}

export const getEtfTickerList = () => {
  let token = localStorage.getItem('floomtoken') || null;
  let qs = `${base_url}`
  qs += `/tickerList`;

  return dispatch => {
    return new Promise((resolve)=>{
      dispatch(loadingReq(true));
      axios({
        method: 'get',
        url: qs,
        headers: {Authorization: `Bearer ${token}`}
      }).then((res)=>{
        dispatch({
          type: FETCH_ETF_TICKER_LIST,
          payload: res.data
        })
        dispatch(loadingReq(false));
        resolve(res.data);
      }).catch(err=>{
        console.log(err);
        dispatch(loadingReq(false))
        dispatch(etfError(err));
      })
    })
  }
}

export const getEtfAssetList = () => {
  let qs = `${base_url}/assetList`;

  return dispatch => {
    dispatch(loadingReq(true));
    axios({
      method: 'get',
      url: qs,
      headers: {Authorization: `Bearer ${token}`}
    }).then((res)=>{
      dispatch({
        type: FETCH_ASSET_LIST,
        payload: res.data
      })
      dispatch(loadingReq(false));
    }).catch(err=>{
      console.log(err);
      dispatch(loadingReq(false))
      dispatch(etfError(err));
    })
  }

}

export const getEtfMsCatList = () => {
  let token = localStorage.getItem('floomtoken') || null;
  let qs = `${base_url}/msCatList`;
  return dispatch => {
    dispatch(loadingReq(true));
    axios({
      method: 'get',
      url: qs,
      headers: {Authorization: `Bearer ${token}`}
    }).then((res)=>{
      dispatch({
        type: FETCH_MSCATEGORY_LIST,
        payload: res.data
      })
      dispatch(loadingReq(false));
    }).catch(err=>{
      console.log(err);
      dispatch(loadingReq(false))
      dispatch(etfError(err));
    })
  }
}

export const etfError = (err) => {
  return {
    type: FETCH_ERROR,
    payload: err
  }
}