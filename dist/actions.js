/**
 * Actions for Logging In
 *
 * 
 */
import * as Constants from './constants';

export function login(username, password) {
  return {
    type: Constants.LOG_IN,
    username: username,
    password: password
  };
}

export function authSuccess(token) {
  return {
    type: Constants.AUTH_SUCCESS,
    token: token
  };
}

export function authFailure(error, authProcess) {
  return {
    type: Constants.AUTH_FAILURE,
    error: error,
    authProcess: authProcess
  };
}

export function signOut() {
  return {
    type: Constants.SIGN_OUT
  };
}

export function authenticating(isAuthenticating) {
  return {
    type: Constants.AUTHENTICATING,
    isAuthenticating: isAuthenticating
  };
}