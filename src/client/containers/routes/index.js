import { Route, Switch, Redirect, location } from "react-router-dom";
import React, { Component } from "react";
import EtfPage from "../../views/ETF";
import IntEtfPage from "../../views/IntETF";
import LoginPage from "../../views/Login";
import RegisterPage from "../../views/Register";
import ExcelPage from "../../views/ExcelUpload";
import AdminPage from "../../views/Admin";

const Auth = {
  isAuthenticated: false
};

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        Auth.isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
};

class Routes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      in: false
    };
  }

  componentDidMount() {
    Auth.isAuthenticated = this.props.authentication.authenticated;
    // check user type
  }

  componentWillReceiveProps(newProps) {
    Auth.isAuthenticated = newProps.authentication.authenticated;
  }

  authenticate(cb) {
    // this.props.authenticate();
    // Auth.isAuthenticated = this.props.authentication.authenticated;
    // console.log('running auth', this.props.authentication.authenticated)
  }

  signout(cb) {
    // Auth.isAuthenticated = false;
  }

  toggleEnterState() {
    console.log("toggling in state");
    this.setState({ in: true });
  }

  render() {
    return (
      <Switch>
        <Route exact path="/" component={LoginPage} />
        <Route exact path="/etf" component={EtfPage} />
        <Route exact path="/intetf" component={IntEtfPage} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/register" component={RegisterPage} />
        <Route exact path="/admin" component={AdminPage} />
        <Route exact path="/excel" component={ExcelPage} />
        <PrivateRoute exact path="/protected" component={ExcelPage} />
      </Switch>
    );
  }
}

export default Routes;
