import axios from 'axios';
import {
  FETCH_EXPIRATION_LIST,
  FETCH_FCATEGORY_LIST,
  FETCH_CONTRACT,
  FETCH_SUMMATION,
  FETCH_AGGREGATION,
  FETCH_ERROR
} from './types';

import {loadingReq} from './browserApi.js'

const base_url = 'api/getFutureFlow';

export const getFuturesExpList = (data) => {
  let token = localStorage.getItem('floomtoken') || null;
  let qs = `${base_url}`;
  qs += '/getContracts';
  qs += `?category=${data}`
 console.log(data)
  return dispatch => {
    dispatch(loadingReq(true));
    axios({
      method: 'get',
      url: qs,
      headers: {Authorization: `Bearer ${token}`}
    }).then(res => {
      console.log(res.data)
      dispatch({
        type: FETCH_EXPIRATION_LIST,
        payload: res.data
      })
      dispatch(loadingReq(false));
    }).catch(err=>{
      console.log(err);
      dispatch(loadingReq(false))
      dispatch(futuresError(err));
    })
  }
}

export const getFuturesCatList = (data) => {
  let token = localStorage.getItem('floomtoken') || null;
  let qs = `${base_url}`;
  qs += '/categoryList'

  return dispatch => {
    dispatch(loadingReq(true))
    axios({
      method: 'get',
      url: qs,
      headers: {Authorization: `Bearer ${token}`}
    }).then(res => {
      dispatch({
        type: FETCH_FCATEGORY_LIST,
        payload: res.data
      })
      dispatch(loadingReq(false));
    }).catch(err=>{
      console.log(err);
      dispatch(loadingReq(false))
      dispatch(futuresError(err));
    })
  }
}

export const getFuturesContract = (data) => {
  let token = localStorage.getItem('floomtoken') || null;
  let qs = `${base_url}`;
  qs += '/contract?';
  qs += `category=contract&`;

  data.category.length > 0 ? qs += `name=${data.category}&` : ``;
  data.fromDate.length > 0 ? qs += `from_date=${data.fromDate}&` : ``;
  data.toDate.length > 0 ? qs += `to_date=${data.toDate}&` : ``;
  data.expirationDate.length > 0 ? qs += data.expirationDate.map(contract => `&contracts[]=${contract}`).join('') : ``;

  console.log(qs)
  return dispatch => {
    dispatch(loadingReq(true))
    axios({
      method: 'get',
      url: qs,
      headers: {Authorization: `Bearer ${token}`}
    }).then(res => {
      console.log(res)
      dispatch({
        type: FETCH_CONTRACT,
        payload: res.data
      })
      dispatch(loadingReq(false));
    }).catch(err=>{
      console.log(err);
      dispatch(loadingReq(false))
      dispatch(futuresError(err));
    })
  }
}

export const getFuturesAggregation = (data) => {
  let token = localStorage.getItem('floomtoken') || null;
  let qs = `${base_url}`;
  qs += '/aggregation?';

  data.fromDate.length > 0 ? qs += `from_date=${data.fromDate}&` : ``
  data.toDate.length > 0 ? qs += `to_date=${data.toDate}&` : ``
  data.aggregation.length > 0 ? qs += data.aggregation.map(agg => `&aggregations[]=${agg}`).join('') : ``;

  return dispatch => {
    dispatch(loadingReq(true))
    axios({
      method: 'get',
      url: qs,
      headers: {Authorization: `Bearer ${token}`}
    }).then(res => {
      console.log(res.data)
      dispatch({
        type: FETCH_AGGREGATION,
        payload: res.data
      })
      dispatch(loadingReq(false));
    }).catch(err=>{
      console.log(err);
      dispatch(loadingReq(false))
      dispatch(futuresError(err));
    })
  }
}

export const getFuturesSummation = (data) => {
  let token = localStorage.getItem('floomtoken') || null;
  let qs = `${base_url}`;
  qs += '/summation?';

  data.fromDate.length > 0 ? qs += `from_date=${data.fromDate}&` : ``
  data.toDate.length > 0 ? qs += `to_date=${data.toDate}&` : ``
  data.category.length > 0 ? qs += data.category.map(c => `&categories[]=${c}`).join('') : ``;

  return dispatch => {
    dispatch(loadingReq(true))
    axios({
      method: 'get',
      url: qs,
      headers: {Authorization: `Bearer ${token}`}
    }).then(res => {
      console.log(res.data)
      dispatch({
        type: FETCH_SUMMATION,
        payload: res.data
      })
      dispatch(loadingReq(false))
    }).catch(err=>{
      console.log(err);
      dispatch(loadingReq(false))
      dispatch(futuresError(err));
    })
  }
}

export function futuresError(err) {
  return {
      type: FETCH_ERROR,
      payload: err
  }
}