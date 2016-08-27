/**
 * Sample Login container
 *
 * @flow
 */
import React from 'react';
import { connect } from 'react-redux';
import { login } from '../actions';

class Login extends React.Component {   // eslint-disable-line

  constructor() {
    super();

    this.state = {
      username: '',
      password: '',
    };

    const self : any = this;
    self.setUsername = this.setUsername.bind(this);
    self.setPassword = this.setPassword.bind(this);
  }

  state: {
    username: string;
    password: string;
  }

  setUsername(event) {
    this.setState({
      username: event.target.value,
    });
  }

  setPassword(event) {
    this.setState({
      password: event.target.value,
    });
  }

  render() {
    return (
      <div className="login-screen">
        <div className="login-page">
          <div className="form">
            <div className="login-form">
              <input type="text" placeholder="Email" id="username" name="username" value={this.state.username} onChange={this.setUsername} />
              <input type="password" placeholder="Password" id="password" name="password" value={this.state.password} onChange={this.setPassword} />
              <button onClick={() => this.props.login(this.state.username, this.state.password)}>login</button>
              <p className="message">Not registered? <a href="#">Create an account</a></p>
              <p className="message"><a href="#">Forgot Password?</a></p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    login: (username, password) => dispatch(login(username, password)),
  };
}

export default connect(null, mapDispatchToProps)(Login);
