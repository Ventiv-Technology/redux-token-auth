'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _sagas = require('../sagas');

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mockValidToken = {
  access_token: '370592fd-b9f8-452d-816a-4fd5c6b4b8a6',
  token_type: 'bearer',
  expires_in: 10,
  scope: 'read write',
  refresh_token: '0ed8ffc6-f013-43a3-96bd-5a9565d63152'
};

describe('authenticationSaga saga', function () {
  it('should take in options and return generator', function () {
    var saga = (0, _sagas.authenticationSaga)();
    (0, _expect2.default)(saga).toBeA(Function);

    var sagaWithOpts = (0, _sagas.authenticationSaga)({
      getAuthToken: function getAuthToken() {
        return 'Authentication Token';
      }
    });
    (0, _expect2.default)(sagaWithOpts).toBeA(Function);
  });

  describe('with built in defaults', function () {
    var generator = void 0;

    beforeEach(function () {
      var saga = (0, _sagas.authenticationSaga)();
      generator = saga();
    });

    describe('starts up with a refreshable token', function () {
      beforeEach(function () {
        var callGetToken = generator.next().value;
        (0, _expect2.default)(callGetToken.CALL.fn).toBe(_sagas.defaultOptions.getAuthToken);

        // After getting the valid token, we should attempt to yield a call to the refresh saga
        var authorizeRefreshableToken = generator.next(mockValidToken).value;
        (0, _expect2.default)(authorizeRefreshableToken.CALL.fn).toBeA(Function);

        var forkActivityWatcher = generator.next(mockValidToken).value;
        (0, _expect2.default)(forkActivityWatcher.FORK.fn.name).toBe('watchForInactivity');
      });

      it('successfully refreshes the token - and waits for the token to expire', function () {
        var waitForExpiredRace = generator.next().value;
        // Verify it's the race for Token Expired or Signout
        (0, _expect2.default)(waitForExpiredRace.RACE.expired).toExist();
        (0, _expect2.default)(waitForExpiredRace.RACE.signout.TAKE.pattern).toBe(_constants.SIGN_OUT);

        // Returns the expiry
        var callToRefresh = generator.next({ expired: true }).value;
        (0, _expect2.default)(callToRefresh.CALL.fn).toBeA(Function);
        (0, _expect2.default)(callToRefresh.CALL.fn.name).toBe('authorize');
        (0, _expect2.default)(callToRefresh.CALL.args[1]).toBe(mockValidToken);
      });

      it('successfully refreshes the token - and signs out before expiration', function () {
        // Get to the race...verfied earler
        var waitForExpiredRace = generator.next().value;

        // Should revoke the token from local storage
        var callRemoveAuthToken = generator.next({
          signout: { type: _constants.SIGN_OUT }
        }).value;
        (0, _expect2.default)(callRemoveAuthToken.CALL.fn.name).toBe('removeAuthToken');

        // Returns the logout
        var takeLogin = generator.next().value;
        (0, _expect2.default)(takeLogin.TAKE.pattern).toBe(_constants.LOG_IN);
      });
    });

    describe('starts up with a token that cannot be refreshed', function () {
      beforeEach(function () {
        var callGetToken = generator.next().value;
        (0, _expect2.default)(callGetToken.CALL.fn).toBe(_sagas.defaultOptions.getAuthToken);

        // After getting the valid token, we should attempt to yield a call to the refresh saga
        var takeLogin = generator.next(null).value;
        (0, _expect2.default)(takeLogin.TAKE.pattern).toBe(_constants.LOG_IN);

        // Return's a LOG_IN action w/ username / password
        var callToAuthorize = generator.next({
          type: _constants.LOG_IN,
          username: 'jcrygier',
          password: 'Password12'
        }).value;
        (0, _expect2.default)(callToAuthorize.CALL.fn.name).toBe('authorize');
        (0, _expect2.default)(callToAuthorize.CALL.args[1]).toEqual({
          username: 'jcrygier',
          password: 'Password12'
        });
      });

      it('successful call to authorize user/password', function () {
        var forkActivityWatcher = generator.next(mockValidToken).value;
        (0, _expect2.default)(forkActivityWatcher.FORK.fn.name).toBe('watchForInactivity');

        var waitForExpiredRace = generator.next().value;
        (0, _expect2.default)(waitForExpiredRace.RACE.expired).toExist();
        (0, _expect2.default)(waitForExpiredRace.RACE.signout.TAKE.pattern).toBe(_constants.SIGN_OUT);

        // Rest of flow is tested above
      });

      it('failed call to authorize user/password', function () {
        var takeLogin = generator.next(null).value;
        (0, _expect2.default)(takeLogin.TAKE.pattern).toBe(_constants.LOG_IN);
      });
    });

    it('starts up with no token', function () {
      var callGetToken = generator.next().value;
      (0, _expect2.default)(callGetToken.CALL.fn).toBe(_sagas.defaultOptions.getAuthToken);

      // After getting the valid token, we should attempt to yield a call to the refresh saga
      var takeLogin = generator.next().value;
      (0, _expect2.default)(takeLogin.TAKE.pattern).toBe(_constants.LOG_IN);

      // Rest of the flow has been covered above
    });
  });
});

describe('authorize saga', function () {
  var generator = void 0;

  describe('refresh token flow', function () {
    beforeEach(function () {
      generator = (0, _sagas.authorize)(_sagas.defaultOptions, mockValidToken);

      generator.next(); // authenticating start
      var raceForRefreshOrSignout = generator.next().value; // race
      (0, _expect2.default)(raceForRefreshOrSignout.RACE.signout.TAKE.pattern).toBe(_constants.SIGN_OUT);
      (0, _expect2.default)(raceForRefreshOrSignout.RACE.token.CALL.fn.name).toBe('refreshToken');
      (0, _expect2.default)(raceForRefreshOrSignout.RACE.token.CALL.args[0]).toBe(mockValidToken);
    });

    it('successfully refreshes the token', function () {
      // Should proceed to save the token
      var callSetToken = generator.next({ token: mockValidToken }).value;
      (0, _expect2.default)(callSetToken.CALL.fn.name).toBe('setAuthToken');
      (0, _expect2.default)(callSetToken.CALL.args[0]).toBe(mockValidToken);

      // Should tell the stores of the successful token
      var putAuthSuccess = generator.next().value;
      (0, _expect2.default)(putAuthSuccess.PUT.action.type).toBe(_constants.AUTH_SUCCESS);
      (0, _expect2.default)(putAuthSuccess.PUT.action.token).toBe(mockValidToken);

      // Annnnnd....we're done
      generator.next(); // authentication done
      var finished = generator.next();
      (0, _expect2.default)(finished.done).toExist();
      (0, _expect2.default)(finished.value).toBe(mockValidToken);
    });

    it('returns a null response from the refresh call', function () {
      var auth = generator.next({ token: null }).value;
      (0, _expect2.default)(auth.PUT.action.type).toBe(_constants.AUTHENTICATING);
      var putAuthFailure = generator.next().value;
      (0, _expect2.default)(putAuthFailure.PUT.action.type).toBe(_constants.AUTH_FAILURE);
      (0, _expect2.default)(putAuthFailure.PUT.action.error).toBe(_constants.INVALID_TOKEN_ERR);
      (0, _expect2.default)(putAuthFailure.PUT.action.authProcess).toBe(_constants.REFRESH_TOKEN);

      // Annnnnd....we're done
      var finished = generator.next();
      (0, _expect2.default)(finished.done).toExist();
      (0, _expect2.default)(finished.value).toBe(null);
    });

    it('throws an exception from the refresh call', function () {
      var err = new Error('Test Error');

      var putAuthFailure = generator.throw(err).value;
      (0, _expect2.default)(putAuthFailure.PUT.action.type).toBe(_constants.AUTH_FAILURE);
      (0, _expect2.default)(putAuthFailure.PUT.action.error).toBe(err);
      (0, _expect2.default)(putAuthFailure.PUT.action.authProcess).toBe(_constants.REFRESH_TOKEN);

      // Annnnnd....we're done
      generator.next(); // authentication done
      var finished = generator.next();
      (0, _expect2.default)(finished.done).toExist();
      (0, _expect2.default)(finished.value).toBe(null);
    });

    it('signs out before the refresh can occur', function () {
      generator.next({ signout: true }); // authentication done
      var finished = generator.next();
      (0, _expect2.default)(finished.done).toExist();
      (0, _expect2.default)(finished.value).toBe(null);
    });
  });
});