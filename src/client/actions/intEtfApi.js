import axios from "axios";
import {
  FETCH_INTETF_TICKER,
  FETCH_INTETF_TICKER_LIST,
  FETCH_INTETF_CATEGORY,
  FETCH_DOMICILES_LIST,
  FETCH_GEO_LIST,
  FETCH_MKT_CAP_LIST,
  FETCH_INTETF_ASSET_LIST,
  FETCH_STRATEGY_LIST,
  FETCH_ERROR
} from "./types";

import { loadingReq } from "./browserApi.js";
const base_url = "api/getIntEtfFlow";

export const getIntEtfTickerList = data => {
  let token = localStorage.getItem("floomtoken") || null;
  let qs = `${base_url}`;
  qs += "/tickerList";
  console.log("token from inttETF", token);
  return dispatch => {
    return new Promise(resolve => {
      dispatch(loadingReq(true));
      axios({
        method: "get",
        url: qs,
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          console.log(res.data);
          dispatch({
            type: FETCH_INTETF_TICKER_LIST,
            payload: res.data
          });
          dispatch(loadingReq(false));
          resolve(res.data);
        })
        .catch(err => {
          console.log(err);
          dispatch(loadingReq(false));
          dispatch(intEtfError(err));
        });
    });
  };
};

export const getIntEtfCatList = data => {
  let token = localStorage.getItem("floomtoken") || null;
  let qs = `${base_url}`;
  qs += "/categoryList";
  qs += `?catType=${data.catType}`;

  let type = getListType(data);
  console.log();
  //FETCH_INTETF_CATLIST

  return dispatch => {
    dispatch(loadingReq(true));
    axios({
      method: "get",
      url: qs,
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        dispatch({
          type: type,
          payload: res.data
        });
        dispatch(loadingReq(false));
      })
      .catch(err => {
        console.log(err);
        dispatch(loadingReq(false));
        dispatch(intEtfError(err));
      });
  };
};

export const getIntEtfFlow = data => {
  let token = localStorage.getItem("floomtoken") || null;
  let qs = `${base_url}`;
  let type = "";
  console.log(data);
  if (data.intetfCategory === "Ticker") {
    type = FETCH_INTETF_TICKER;
    qs += "/ticker?";
    data.fromDate.length > 0 ? (qs += `from_date=${data.fromDate}&`) : "";
    data.toDate.length > 0 ? (qs += `to_date=${data.toDate}&`) : "";
    data.cats.length > 0
      ? (qs += data.cats[0].value
          .map(symbol => `&symbols[]=${symbol}`)
          .join(""))
      : "";
    console.log(qs);
  } else {
    type = FETCH_INTETF_CATEGORY;
    console.log(data);
    qs += "/intCategory?";
    data.fromDate.length > 0 ? (qs += `from_date=${data.fromDate}&`) : "";
    data.toDate.length > 0 ? (qs += `to_date=${data.toDate}&`) : "";
    data.cats.length > 0
      ? (qs += data.cats
          .map(cat => {
            console.log(cat);
            //let catValues = cat.value.map((value)=>`$${value}`).join('')
            return `&intCategory[]=${cat.category}$${cat.value}`;
          })
          .join(""))
      : "";
    console.log(qs);
  }

  return dispatch => {
    dispatch(loadingReq(true));
    axios({
      method: "get",
      url: qs,
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        console.log(res.data);
        dispatch({
          type: type,
          payload: res.data
        });
        dispatch(loadingReq(false));
      })
      .catch(err => {
        console.log(err);
        dispatch(loadingReq(false));
        dispatch(intEtfError(err));
      });
  };
};

export function intEtfError(err) {
  return {
    type: FETCH_ERROR,
    payload: err
  };
}

function getListType(data) {
  let result = "";

  switch (data.catType) {
    case "asset_class":
      result = FETCH_INTETF_ASSET_LIST;
      break;

    case "domicile":
      result = FETCH_DOMICILES_LIST;
      break;

    case "fund_strategy":
      result = FETCH_STRATEGY_LIST;

    case "geo_focus":
      result = FETCH_GEO_LIST;
      break;

    case "mkt_cap_focus":
      result = FETCH_MKT_CAP_LIST;
  }
  return result;
}
