import axios from 'axios';
import {
  EXPORT_DATA,
  UPLOAD_DATA,
  FETCH_ERROR,
  DOWNLOAD_EXCEL,
  HIDE_DL,
  HIDE_UP
} from './types';

import {loadingReq} from './browserApi.js'
const base_url = 'api/'

export const exportData = (data, category) => {
  console.log(data);
  let token = localStorage.getItem('floomtoken') || null;
  let qs = `${base_url}/exportJSON?eType=${category}`

  return dispatch => {
    // send api request status
    dispatch(loadingReq(true));
    axios({
      method: 'post',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      url: qs,
      data: JSON.stringify(data)
    }).then((res)=>{
      console.log(res)
      dispatch({
        type: EXPORT_DATA,
        payload: res.data
      })
      dispatch(loadingReq(false));
      //downloadExcel(dispatch, filename)
    }).catch(err=>{
      console.log(err);
      dispatch(loadingReq(false))
      dispatch(fileError(err));
    })
  }
}

export const uploadData = (data, formData) => {
  let token = localStorage.getItem('floomtoken') || null;
  let qs = `${base_url}/uploadExcel?`
  console.log(formData)
  data.csvCategory.length ? qs += `category=${data.csvCategory}&` : '';
  data.upType.length ? qs += `upType=${data.upType}` : '';

  return dispatch => {
    dispatch(loadingReq(true));
    axios({
      method: 'post',
      data: formData,
      config: { headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
        }
      },
      url: qs
    }).then((res)=>{
      console.log(res)
      // saves url
      dispatch({
        type: UPLOAD_DATA,
        payload: res.data
      })
      // opens link

      dispatch(loadingReq(false));
    }).catch(err=>{
      console.log(err);
      dispatch(loadingReq(false))
      dispatch(fileError(err));
    })
  }
}

export const hideDL = () => {
  return {
    type: HIDE_DL,
    payload: false
  }
}

export const hideUP = () => {
  return {
    type: HIDE_UP,
    payload: false
  }
}

export const fileError = (err) => {
  return {
    type: FETCH_ERROR,
    payload: err
  }
}