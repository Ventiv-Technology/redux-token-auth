/**
 * Actions for Logging In
 *
 * @flow
 */
import * as Constants from './constants';

export function login(username : string, password : string) {
  return {
    type: Constants.LOG_IN,
    username,
    password,
  };
}

export function authSuccess(token : Token) {
  return {
    type: Constants.AUTH_SUCCESS,
    token,
  };
}

export function authFailure(error : any, authProcess : string) {
  return {
    type: Constants.AUTH_FAILURE,
    error,
    authProcess,
  };
}

export function signOut() {
  return {
    type: Constants.SIGN_OUT,
  };
}
