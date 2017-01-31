'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.login = login;
exports.authSuccess = authSuccess;
exports.authFailure = authFailure;
exports.signOut = signOut;
exports.authenticating = authenticating;

var _constants = require('./constants');

var Constants = _interopRequireWildcard(_constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function login(username, password) {
  return {
    type: Constants.LOG_IN,
    username: username,
    password: password
  };
} /**
   * Actions for Logging In
   *
   * 
   */
function authSuccess(token) {
  return {
    type: Constants.AUTH_SUCCESS,
    token: token
  };
}

function authFailure(error, authProcess) {
  return {
    type: Constants.AUTH_FAILURE,
    error: error,
    authProcess: authProcess
  };
}

function signOut() {
  return {
    type: Constants.SIGN_OUT
  };
}

function authenticating(isAuthenticating) {
  return {
    type: Constants.AUTHENTICATING,
    isAuthenticating: isAuthenticating
  };
}