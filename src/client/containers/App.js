import React, { Component } from "react";
import Routes from "./routes";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { authenticate, getUser } from "../actions";
import { connect } from "react-redux";
import { withRouter } from "react-router";

class App extends Component {
  componentDidMount() {}

  render() {
    return (
      <div id="AppContainer">
        <Header location={this.props.location} />
        <div className="AppContent">
          <Routes
            authentication={this.props.authentication}
            authenticate={this.props.authenticate}
          />
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authentication: state.auth
});

export default withRouter(
  connect(
    mapStateToProps,
    { authenticate, getUser }
  )(App)
);
