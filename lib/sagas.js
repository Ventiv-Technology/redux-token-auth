/**
 * Main saga and supporting sagas for authentication
 *
 * @flow
 */

import { take, call, race, put } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import TokenUtils from './TokenUtils';
import AuthUtils from './AuthUtils';
import * as Constants from './constants';
import { authSuccess, refreshSuccess, authFailure } from './actions';

// Token Services
export const defaultOptions : Options = {
  getAuthToken: TokenUtils.getAuthToken,
  setAuthToken: TokenUtils.setAuthToken,
  removeAuthToken: TokenUtils.removeAuthToken,
  getToken: AuthUtils.getToken,
  refreshToken: AuthUtils.refreshToken,
};

function* authorize(options : Options, username : string, password : string) {
  try {
    const raceResponse = yield race({
      token: call(options.getToken, username, password),
      signout: take(Constants.SIGN_OUT),
    });

    // server responded (with Success) before user signed out
    if (raceResponse && raceResponse.token) {
      const token = TokenUtils.toToken(raceResponse.token);
      if (token) {
        yield call(options.setAuthToken, token);   // save token according to Options
        yield put(authSuccess(token));             // Tell redux that we've successfully logged in
        return token;
      }
    } else if (raceResponse && raceResponse.signout) {
      return null;
    }
  } catch (e) {
    yield put(authFailure(e, Constants.GET_TOKEN));                                // Tell redux about the authentication failure
    return null;
  }

  // Server must have responded with something that is not a token
  yield put(authFailure(Constants.INVALID_TOKEN_ERR, Constants.GET_TOKEN));
  return null;
}

function* refresh(options : Options, tokenToRefresh : Token) {
  try {
    const raceResponse = yield race({
      token: call(options.refreshToken, tokenToRefresh),
      signout: take(Constants.SIGN_OUT),
    });

    // server responded (with Success) before user signed out
    if (raceResponse && raceResponse.token) {
      const token = TokenUtils.toToken(raceResponse.token);
      if (token) {
        yield call(options.setAuthToken, token);   // save token according to Options
        yield put(authSuccess(token));             // Tell redux that we've successfully logged in
        return token;
      }
    } else if (raceResponse && raceResponse.signout) {
      return null;
    }
  } catch (e) {
    yield put(authFailure(e, Constants.REFRESH_TOKEN));                                // Tell redux about the authentication failure
    return null;
  }

  // Server must have responded with something that is not a token
  yield put(authFailure(Constants.INVALID_TOKEN_ERR, Constants.REFRESH_TOKEN));
  return null;
}

export function authenticationSaga(opts : Options) : () => Generator<*, *, *> {
  return function* saga() : Generator<*, *, *> {
    // Get the variables from options or defaults
    const options : Options = Object.assign({}, defaultOptions, opts);

    // Get the existing token - if any
    let token : ?Token = yield call(options.getAuthToken);

    while (true) {      // eslint-disable-line
      // If the token is found, attempt to refresh it - trusting the server to reject if it's not allowed to be refreshed
      if (token) {
        token = yield call(refresh, options, token);
      }

      // Either we have a valid token (token != null) or we don't have a stored token (token = null) or the refresh failed (token = null).
      // Either way, if token is populated, move on, if it's not...we need to wait for the user to request a LOG_IN action.
      if (!token) {
        const loginAction = yield take(Constants.LOG_IN);
        if (loginAction === undefined)
          throw new Error('Login Action must contain username / password');

        const { username, password } = loginAction;
        token = yield call(authorize, options, username, password);
      }

      // By now, we have a valid token (or an error was thrown)
      if (token) {
        const raceResponse = yield race({
          expired: delay(token.expires_in * 1000, true),   // TODO: Go XXXX seconds early?
          signout: take(Constants.SIGN_OUT),
        });

        // TODO: Check if there has been any activity in XXXX seconds.  Treat as a SIGN_OUT, even if we hit the wait in this condition

        // If the token has hit the expiry time before they signed out, simply continue the infinite loop
        // If they did a sign out, then don't attempt to refresh the token by nulling it out
        if (raceResponse && raceResponse.signout) {
          token = null;
        }
      }
    }
  };
}

export default [
  authenticationSaga,
];
