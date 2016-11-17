/**
 * Sample Login container.
 * NOTE: Expects the containers above it to have 100% height / width.
 *
 * @flow
 */
/* eslint-disable jsx-a11y/href-no-hash */
import React from 'react';
import { connect } from 'react-redux';
import { login as loginAction } from '../../actions';
import { changeUsername as changeUsernameAction, changePassword as changePasswordAction } from './actions';
import HoverStyle from '../../components/HoverStyle';

type PropTypes = {
  username: string;
  password: string;
  authFailure: boolean;
  login: (username : string, password : string) => void;
  changeUsername: (e : SyntheticEvent) => void;
  changePassword: (e : SyntheticEvent) => void;
};

const Login = ({ username, password, authFailure, login, changeUsername, changePassword } : PropTypes) => {
  const AuthFailureMessage = authFailure ? (<div>Invalid username and password.</div>) : null;

  return (
    <div style={styles.loginScreen}>
      <div style={styles.loginPage}>
        <div style={styles.form}>
          {AuthFailureMessage}
          <div className="login-form">
            <input style={styles.input} type="text" placeholder="Username" id="username" name="username" value={username} onChange={changeUsername} />
            <input style={styles.input} type="password" placeholder="Password" id="password" name="password" value={password} onChange={changePassword} />
            <HoverStyle style={styles.loginButton} hoverStyle={styles.loginButtonHover} onClick={() => login(username, password)}><button>login</button></HoverStyle>
            <p style={styles.message}>Not registered? <a style={styles.messageLink} href="#">Create an account</a></p>
            <p style={styles.message}><a style={styles.messageLink} href="#">Forgot Password?</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  loginScreen: {
    height: '100%',
    width: '100%',
    background: 'linear-gradient(to left, #01AEEF, #0155B8)',
    fontFamily: '"Roboto", sans-serif',
  },
  loginPage: {
    width: '360px',
    padding: '8% 0 0',
    margin: 'auto',
  },
  form: {
    position: 'relative',
    zIndex: 1,
    background: '#FFFFFF',
    maxWidth: '360px',
    margin: '0 auto 100px',
    padding: '45px',
    textAlign: 'center',
    boxShadow: '0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24)',
  },
  input: {
    fontFamily: '"Roboto", sans-serif',
    outline: 0,
    background: '#f2f2f2',
    width: '100%',
    border: 0,
    margin: '0 0 15px',
    padding: '15px',
    boxSizing: 'border-box',
    fontSize: '14px',
  },
  loginButton: {
    fontFamily: '"Roboto", sans-serif',
    textTransform: 'uppercase',
    outline: 0,
    background: '#01AEEF',
    width: '100%',
    border: 0,
    padding: ' 15px',
    color: '#FFFFFF',
    fontSize: '14px',
    transition: 'all 0.3 ease',
    cursor: 'pointer',
  },
  loginButtonHover: {
    fontFamily: '"Roboto", sans-serif',
    textTransform: 'uppercase',
    outline: 0,
    background: '#0155B8',
    width: '100%',
    border: 0,
    padding: ' 15px',
    color: '#FFFFFF',
    fontSize: '14px',
    transition: 'all 0.3 ease',
    cursor: 'pointer',
  },
  message: {
    margin: '15px 0 0',
    color: '#b3b3b3',
    fontSize: '12px',
  },
  messageLink: {
    color: '#01AEEF',
    textDecoration: 'none',
  },
  alertError: {

  },
};

// TODO: How do we know this was regiestered w/ 'login'????
const mapStateToProps = state => ({
  username: state.getIn(['login', 'username']),
  password: state.getIn(['login', 'password']),
  authFailure: state.getIn(['login', 'authFailure']),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    login: (username, password) => dispatch(loginAction(username, password)),
    changeUsername: e => dispatch(changeUsernameAction(e.target.value)),
    changePassword: e => dispatch(changePasswordAction(e.target.value)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
