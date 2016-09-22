var _marked = [watchForInactivity, authorize].map(regeneratorRuntime.mark);

/**
 * Main saga and supporting sagas for authentication
 *
 * 
 */

import { take, call, race, put, fork } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import TokenUtils from './TokenUtils';
import AuthUtils from './AuthUtils';
import * as Constants from './constants';
import { authSuccess, authFailure, signOut } from './actions';

// Token Services
export var defaultOptions = {
  getAuthToken: TokenUtils.getAuthToken,
  setAuthToken: TokenUtils.setAuthToken,
  removeAuthToken: TokenUtils.removeAuthToken,
  getToken: AuthUtils.getToken,
  refreshToken: AuthUtils.refreshToken,
  inactivitySignoutSec: 10
};

var getTokenAuthorizationCall = function getTokenAuthorizationCall(options, credentialsOrToken) {
  if (TokenUtils.toToken(credentialsOrToken)) return call(options.refreshToken, credentialsOrToken);else if (credentialsOrToken.username && credentialsOrToken.password) return call(options.getToken, credentialsOrToken.username, credentialsOrToken.password);

  throw new Error('Programming error...expected Credentials, or Token');
};

var lastActivity = new Date();
function watchForInactivity(options) {
  var raceResponse;
  return regeneratorRuntime.wrap(function watchForInactivity$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!true) {
            _context.next = 12;
            break;
          }

          _context.next = 3;
          return race({
            expired: delay(options.inactivitySignoutSec * 1000, true),
            activity: take('*')
          });

        case 3:
          raceResponse = _context.sent;

          if (!(raceResponse && raceResponse.activity)) {
            _context.next = 8;
            break;
          }

          lastActivity = new Date();
          _context.next = 10;
          break;

        case 8:
          _context.next = 10;
          return put(signOut());

        case 10:
          _context.next = 0;
          break;

        case 12:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked[0], this);
}

export function authorize(options, credentialsOrToken) {
  var authFailureConstant, raceResponse, token;
  return regeneratorRuntime.wrap(function authorize$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          authFailureConstant = TokenUtils.toToken(credentialsOrToken) ? Constants.REFRESH_TOKEN : Constants.GET_TOKEN;
          _context2.prev = 1;
          _context2.next = 4;
          return race({
            token: getTokenAuthorizationCall(options, credentialsOrToken),
            signout: take(Constants.SIGN_OUT)
          });

        case 4:
          raceResponse = _context2.sent;

          if (!(raceResponse && raceResponse.token)) {
            _context2.next = 15;
            break;
          }

          token = TokenUtils.toToken(raceResponse.token);

          if (!token) {
            _context2.next = 13;
            break;
          }

          _context2.next = 10;
          return call(options.setAuthToken, token);

        case 10:
          _context2.next = 12;
          return put(authSuccess(token));

        case 12:
          return _context2.abrupt('return', token);

        case 13:
          _context2.next = 17;
          break;

        case 15:
          if (!(raceResponse && raceResponse.signout)) {
            _context2.next = 17;
            break;
          }

          return _context2.abrupt('return', null);

        case 17:
          _context2.next = 24;
          break;

        case 19:
          _context2.prev = 19;
          _context2.t0 = _context2['catch'](1);
          _context2.next = 23;
          return put(authFailure(_context2.t0, authFailureConstant));

        case 23:
          return _context2.abrupt('return', null);

        case 24:
          _context2.next = 26;
          return put(authFailure(Constants.INVALID_TOKEN_ERR, authFailureConstant));

        case 26:
          return _context2.abrupt('return', null);

        case 27:
        case 'end':
          return _context2.stop();
      }
    }
  }, _marked[1], this, [[1, 19]]);
}

export function authenticationSaga(opts) {
  return regeneratorRuntime.mark(function saga() {
    var options, inactivityWatcher, token, loginAction, _username, _password, raceResponse;

    return regeneratorRuntime.wrap(function saga$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            // Get the variables from options or defaults
            options = Object.assign({}, defaultOptions, opts);
            inactivityWatcher = void 0;

            // Get the existing token - if any

            _context3.next = 4;
            return call(options.getAuthToken);

          case 4:
            token = _context3.sent;

          case 5:
            if (!true) {
              _context3.next = 36;
              break;
            }

            if (!token) {
              _context3.next = 10;
              break;
            }

            _context3.next = 9;
            return call(authorize, options, token);

          case 9:
            token = _context3.sent;

          case 10:
            if (token) {
              _context3.next = 21;
              break;
            }

            _context3.next = 13;
            return take(Constants.LOG_IN);

          case 13:
            loginAction = _context3.sent;

            if (!(loginAction === undefined)) {
              _context3.next = 16;
              break;
            }

            throw new Error('Login Action must contain username / password');

          case 16:
            _username = loginAction.username;
            _password = loginAction.password;
            _context3.next = 20;
            return call(authorize, options, { username: _username, password: _password });

          case 20:
            token = _context3.sent;

          case 21:
            if (!token) {
              _context3.next = 34;
              break;
            }

            if (inactivityWatcher) {
              _context3.next = 26;
              break;
            }

            _context3.next = 25;
            return fork(watchForInactivity, options);

          case 25:
            inactivityWatcher = _context3.sent;

          case 26:
            _context3.next = 28;
            return race({
              expired: delay(token.expires_in * 1000, true), // TODO: Go XXXX seconds early?
              signout: take(Constants.SIGN_OUT)
            });

          case 28:
            raceResponse = _context3.sent;

            if (!(raceResponse && raceResponse.signout)) {
              _context3.next = 34;
              break;
            }

            // Stop the inactivity watcher, as we've signed out
            if (inactivityWatcher) {
              inactivityWatcher.cancel();
              inactivityWatcher = null;
            }

            // Remove the token from the stored
            _context3.next = 33;
            return call(options.removeAuthToken);

          case 33:

            token = null;

          case 34:
            _context3.next = 5;
            break;

          case 36:
          case 'end':
            return _context3.stop();
        }
      }
    }, saga, this);
  });
}

export default [authenticationSaga];