'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _actions = require('../../actions');

var _actions2 = require('./actions');

var _HoverStyle = require('../../components/HoverStyle');

var _HoverStyle2 = _interopRequireDefault(_HoverStyle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Login = function Login(_ref) {
  var username = _ref.username,
      password = _ref.password,
      authFailure = _ref.authFailure,
      login = _ref.login,
      changeUsername = _ref.changeUsername,
      changePassword = _ref.changePassword;

  var AuthFailureMessage = authFailure ? _react2.default.createElement(
    'div',
    null,
    'Invalid username and password.'
  ) : null;

  return _react2.default.createElement(
    'div',
    { style: styles.loginScreen },
    _react2.default.createElement(
      'div',
      { style: styles.loginPage },
      _react2.default.createElement(
        'div',
        { style: styles.form },
        AuthFailureMessage,
        _react2.default.createElement(
          'div',
          { className: 'login-form' },
          _react2.default.createElement('input', { style: styles.input, type: 'text', placeholder: 'Username', id: 'username', name: 'username', value: username, onChange: changeUsername }),
          _react2.default.createElement('input', { style: styles.input, type: 'password', placeholder: 'Password', id: 'password', name: 'password', value: password, onChange: changePassword }),
          _react2.default.createElement(
            _HoverStyle2.default,
            { style: styles.loginButton, hoverStyle: styles.loginButtonHover, onClick: function onClick() {
                return login(username, password);
              } },
            _react2.default.createElement(
              'button',
              null,
              'login'
            )
          ),
          _react2.default.createElement(
            'p',
            { style: styles.message },
            'Not registered? ',
            _react2.default.createElement(
              'a',
              { style: styles.messageLink, href: '#' },
              'Create an account'
            )
          ),
          _react2.default.createElement(
            'p',
            { style: styles.message },
            _react2.default.createElement(
              'a',
              { style: styles.messageLink, href: '#' },
              'Forgot Password?'
            )
          )
        )
      )
    )
  );
}; /**
    * Sample Login container.
    * NOTE: Expects the containers above it to have 100% height / width.
    *
    * 
    */
/* eslint-disable jsx-a11y/href-no-hash */


var styles = {
  loginScreen: {
    height: '100%',
    width: '100%',
    background: 'linear-gradient(to left, #01AEEF, #0155B8)',
    fontFamily: '"Roboto", sans-serif'
  },
  loginPage: {
    width: '360px',
    padding: '8% 0 0',
    margin: 'auto'
  },
  form: {
    position: 'relative',
    zIndex: 1,
    background: '#FFFFFF',
    maxWidth: '360px',
    margin: '0 auto 100px',
    padding: '45px',
    textAlign: 'center',
    boxShadow: '0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24)'
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
    fontSize: '14px'
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
    cursor: 'pointer'
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
    cursor: 'pointer'
  },
  message: {
    margin: '15px 0 0',
    color: '#b3b3b3',
    fontSize: '12px'
  },
  messageLink: {
    color: '#01AEEF',
    textDecoration: 'none'
  },
  alertError: {}
};

// TODO: How do we know this was regiestered w/ 'login'????
var mapStateToProps = function mapStateToProps(state) {
  return {
    username: state.getIn(['login', 'username']),
    password: state.getIn(['login', 'password']),
    authFailure: state.getIn(['login', 'authFailure'])
  };
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch: dispatch,
    login: function login(username, password) {
      return dispatch((0, _actions.login)(username, password));
    },
    changeUsername: function changeUsername(e) {
      return dispatch((0, _actions2.changeUsername)(e.target.value));
    },
    changePassword: function changePassword(e) {
      return dispatch((0, _actions2.changePassword)(e.target.value));
    }
  };
}

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(Login);