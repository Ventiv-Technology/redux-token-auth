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
import { authenticating, authSuccess, authFailure, signOut } from './actions';

// Token Services
export var defaultOptions = {
  getAuthToken: TokenUtils.getAuthToken,
  setAuthToken: TokenUtils.setAuthToken,
  removeAuthToken: TokenUtils.removeAuthToken,
  getToken: AuthUtils.getToken,
  refreshToken: AuthUtils.refreshToken,
  inactivitySignoutSec: 3500,
  oauthClientId: 'acme',
  oauthClientSecret: 'acmesecret'
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
          _context2.next = 2;
          return put(authenticating(true));

        case 2:
          authFailureConstant = TokenUtils.toToken(credentialsOrToken) ? Constants.REFRESH_TOKEN : Constants.GET_TOKEN;
          _context2.prev = 3;
          _context2.next = 6;
          return race({
            token: getTokenAuthorizationCall(options, credentialsOrToken),
            signout: take(Constants.SIGN_OUT)
          });

        case 6:
          raceResponse = _context2.sent;

          if (!(raceResponse && raceResponse.token)) {
            _context2.next = 17;
            break;
          }

          token = TokenUtils.toToken(raceResponse.token);

          if (!token) {
            _context2.next = 15;
            break;
          }

          _context2.next = 12;
          return call(options.setAuthToken, token);

        case 12:
          _context2.next = 14;
          return put(authSuccess(token));

        case 14:
          return _context2.abrupt('return', token);

        case 15:
          _context2.next = 19;
          break;

        case 17:
          if (!(raceResponse && raceResponse.signout)) {
            _context2.next = 19;
            break;
          }

          return _context2.abrupt('return', null);

        case 19:
          _context2.next = 26;
          break;

        case 21:
          _context2.prev = 21;
          _context2.t0 = _context2['catch'](3);
          _context2.next = 25;
          return put(authFailure(_context2.t0, authFailureConstant));

        case 25:
          return _context2.abrupt('return', null);

        case 26:
          _context2.prev = 26;
          _context2.next = 29;
          return put(authenticating(false));

        case 29:
          return _context2.finish(26);

        case 30:
          _context2.next = 32;
          return put(authFailure(Constants.INVALID_TOKEN_ERR, authFailureConstant));

        case 32:
          return _context2.abrupt('return', null);

        case 33:
        case 'end':
          return _context2.stop();
      }
    }
  }, _marked[1], this, [[3, 21, 26, 30]]);
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

            // Push variables into AuthUtils

            AuthUtils.setClientId(options.clientId);
            AuthUtils.setClientSecret(options.clientSecret);

            // Get the existing token - if any
            _context3.next = 6;
            return call(options.getAuthToken);

          case 6:
            token = _context3.sent;

          case 7:
            if (!true) {
              _context3.next = 37;
              break;
            }

            if (!token) {
              _context3.next = 12;
              break;
            }

            _context3.next = 11;
            return call(authorize, options, token);

          case 11:
            token = _context3.sent;

          case 12:
            if (token) {
              _context3.next = 22;
              break;
            }

            _context3.next = 15;
            return take(Constants.LOG_IN);

          case 15:
            loginAction = _context3.sent;

            if (!(loginAction === undefined)) {
              _context3.next = 18;
              break;
            }

            throw new Error('Login Action must contain username / password');

          case 18:
            _username = loginAction.username, _password = loginAction.password;
            _context3.next = 21;
            return call(authorize, options, { username: _username, password: _password });

          case 21:
            token = _context3.sent;

          case 22:
            if (!token) {
              _context3.next = 35;
              break;
            }

            if (inactivityWatcher) {
              _context3.next = 27;
              break;
            }

            _context3.next = 26;
            return fork(watchForInactivity, options);

          case 26:
            inactivityWatcher = _context3.sent;

          case 27:
            _context3.next = 29;
            return race({
              expired: delay(token.expires_in * 1000, true), // TODO: Go XXXX seconds early?
              signout: take(Constants.SIGN_OUT)
            });

          case 29:
            raceResponse = _context3.sent;

            if (!(raceResponse && raceResponse.signout)) {
              _context3.next = 35;
              break;
            }

            // Stop the inactivity watcher, as we've signed out
            if (inactivityWatcher) {
              inactivityWatcher.cancel();
              inactivityWatcher = null;
            }

            // Remove the token from the stored
            _context3.next = 34;
            return call(options.removeAuthToken);

          case 34:

            token = null;

          case 35:
            _context3.next = 7;
            break;

          case 37:
          case 'end':
            return _context3.stop();
        }
      }
    }, saga, this);
  });
}

export default [authenticationSaga];