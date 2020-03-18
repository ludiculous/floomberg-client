import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { Provider } from "react-redux";
import ReduxThunk from "redux-thunk";
import reducers from "./reducers";
import { routerMiddleware } from "react-router-redux";
import createHistory from "history/createBrowserHistory";
import { HashRouter, Route, Switch } from "react-router-dom";
import App from "./containers/App";
import { AUTH_USER } from "./actions/types";
import "./assets/styles/app.css";
import "react-tabs/style/react-tabs.css";
import "react-toastify/dist/ReactToastify.css";

const history = createHistory();
const middleware = [ReduxThunk, routerMiddleware(history)];
const store = createStore(
  reducers,
  {},
  composeWithDevTools(applyMiddleware(...middleware))
);
//const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));
const token = localStorage.getItem("floomtoken");
if (token) {
  console.log("user is pre authorized");
  // store.dispatch({type: AUTH_USER});
}

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <Switch>
        <Route path="/" name="Home" component={App} />
      </Switch>
    </HashRouter>
  </Provider>,

  document.getElementById("root")
);
