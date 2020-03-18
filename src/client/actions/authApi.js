import { AUTH_USER, UNAUTH_USER, AUTH_ERROR, GET_USER } from "./types";
import { loadingReq } from "./browserApi.js";
import axios from "axios";
const base_url = "api/getEtfFlow";

let token = localStorage.getItem("floomtoken") || null;

function unsetUser() {
  localStorage.removeItem("floomtoken");
}

export function authenticate() {
  console.log("authenticating");

  let authenticated = false;
  if (
    localStorage.hasOwnProperty("floomtoken") &&
    localStorage.getItem("floomtoken" !== "undefined")
  ) {
    authenticated = true;
    console.log("switching auth to:", authenticated);
  }

  return {
    type: AUTH_USER,
    payload: authenticated
  };
}

export function loginUser(data, history) {
  console.log(data);
  let basicAuth = {
    username: data.username,
    password: data.password
  };

  console.log("logging in user");
  let qs = "/api/auth/login";

  let postOpt = {
    method: "post",
    url: qs,
    headers: {}
  };

  if (!token || token == "undefined") {
    console.log("token does not exist");
    postOpt.auth = basicAuth;
    postOpt.headers = {
      Authorization: basicAuth
    };
    postOpt.url = qs += "/cred";
    console.log(postOpt);
  } else {
    let bearerToken = `Bearer ${token}`;
    postOpt.headers = { Authorization: bearerToken };
    console.log(bearerToken);
  }

  console.log(qs);
  console.log(postOpt);
  return dispatch => {
    dispatch(loadingReq(true));

    axios(postOpt)
      .then(res => {
        console.log(res);
        const { token, userType } = res.data;
        console.log(token);
        console.log(userType);
        localStorage.setItem("floomtoken", token);
        // dispatch event
        dispatch(loadingReq(false));
        dispatch(authenticate());
        dispatch({
          type: GET_USER,
          user: userType
        });
        let location = {
          pathname: "/etf",
          state: { login_msg: "Logged in successfully!" }
        };
        history.replace(location);
        //redirect
      })
      .catch(err => {
        console.log(err);
        dispatch(loadingReq(false));
        dispatch(authError(err));
      });
  };
}

export function logoutUser() {
  console.log("logging out");
  unsetUser();

  return dispatch => ({
    type: UNAUTH_USER,
    payload: false
  });
}

export function getUser(username) {
  let qs = `${base_url}`;
  username.length > 0 ? (qs += `?username=${username}`) : "";

  return dispatch => {
    dispatch(loadingReq(true));
    axios
      .get({
        method: "get",
        url: qs,
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        return {
          type: GET_USER,
          payload: res.data
        };
      });
  };
}

export function authError(err) {
  return {
    type: AUTH_ERROR,
    payload: err
  };
}
