import React, { Component } from 'react'
import { connect } from 'react-redux';
import {
  loginUser,
  logoutUser
} from '../../actions';
import { withRouter } from "react-router-dom";

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      loginError: '',
      inputError: false,
      loginStatus: false
    }
    this.handleUsername = this.handleUsername.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(newProps) {
    console.log(newProps);

    if(newProps.authentication.error.hasOwnProperty("response")) {
      if(newProps.authentication.error.response.status == 500) {
        this.setState({
          loginError: true
        }, ()=>console.log("setting login error"));
      }
    }
  }

  handleUsername(e) {
    this.setState({username: e.target.value})
  }

  handlePassword(e) {
    this.setState({password: e.target.value})
  }

  handleSubmit(event) {
    console.log(this.state)
    event.preventDefault();
    let data = {
      username: this.state.username,
      password: this.state.password
    }
    if(data.username.length && data.password.length) {
      this.props.loginUser(data, this.props.history)
      this.setState({
        inputError: false,
        loginError: false
      });
    } else {
      this.setState({inputError:true});
    }
  }

  handleLogout(e) {
    e.preventDefault();
    this.props.logoutUser();
  }

  renderLoginError() {
    return (
      <div className="login-error-wrapper">
        <p className="login-error">
          There was an error with login credentials
        </p>
      </div>
    )
  }

  renderInputError() {
    return (
      <div className="login-error-wrapper">
        <p className="login-error">
          Username and password are both required
        </p>
      </div>
    )
  }

  render () {
    return (
      <div className="login-container">
        <h1>Login</h1>
        <form className="login-form">
          <label>UserName:</label>
          <input type="text" name="username" onChange={this.handleUsername}/>
          <label>Password:</label>
          <input type="password" name="password" onChange={this.handlePassword} />
            {this.state.inputError && this.renderInputError()}
            {this.state.loginError && this.renderLoginError()}
          <input type="submit" value="Submit" className="btn-submit" onClick={this.handleSubmit}/>
          <button type="" value="Log Out" className="btn-logout" onClick={this.handleLogout}>Log Out</button>
      </form>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  authentication: state.auth,
});

export default withRouter(connect(mapStateToProps, {
  loginUser,
  logoutUser
})(Login));