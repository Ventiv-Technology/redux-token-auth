import expect from 'expect';

import { authenticationSaga, defaultOptions, authorize } from '../sagas';
import { LOG_IN, AUTH_SUCCESS, AUTH_FAILURE, SIGN_OUT, REFRESH_TOKEN, INVALID_TOKEN_ERR } from '../constants';
import { login, signOut } from '../actions';

var mockValidToken = { access_token: '370592fd-b9f8-452d-816a-4fd5c6b4b8a6', token_type: 'bearer', expires_in: 10, scope: 'read write', refresh_token: '0ed8ffc6-f013-43a3-96bd-5a9565d63152' };

describe('authenticationSaga saga', function () {
  it('should take in options and return generator', function () {
    var saga = authenticationSaga();
    expect(saga).toBeA(Function);

    var sagaWithOpts = authenticationSaga({
      getAuthToken: function getAuthToken() {
        return 'Authentication Token';
      }
    });
    expect(sagaWithOpts).toBeA(Function);
  });

  describe('with built in defaults', function () {
    var generator = void 0;

    beforeEach(function () {
      var saga = authenticationSaga();
      generator = saga();
    });

    describe('starts up with a refreshable token', function () {
      beforeEach(function () {
        var callGetToken = generator.next().value;
        expect(callGetToken.CALL.fn).toBe(defaultOptions.getAuthToken);

        // After getting the valid token, we should attempt to yield a call to the refresh saga
        var authorizeRefreshableToken = generator.next(mockValidToken).value;
        expect(authorizeRefreshableToken.CALL.fn).toBeA(Function);

        var forkActivityWatcher = generator.next(mockValidToken).value;
        expect(forkActivityWatcher.FORK.fn.name).toBe('watchForInactivity');
      });

      it('successfully refreshes the token - and waits for the token to expire', function () {
        var waitForExpiredRace = generator.next().value;
        // Verify it's the race for Token Expired or Signout
        expect(waitForExpiredRace.RACE.expired).toExist();
        expect(waitForExpiredRace.RACE.signout.TAKE.pattern).toBe(SIGN_OUT);

        // Returns the expiry
        var callToRefresh = generator.next({ expired: true }).value;
        expect(callToRefresh.CALL.fn).toBeA(Function);
        expect(callToRefresh.CALL.fn.name).toBe('authorize');
        expect(callToRefresh.CALL.args[1]).toBe(mockValidToken);
      });

      it('successfully refreshes the token - and signs out before expiration', function () {
        // Get to the race...verfied earler
        var waitForExpiredRace = generator.next().value;

        // Should revoke the token from local storage
        var callRemoveAuthToken = generator.next({ signout: { type: SIGN_OUT } }).value;
        expect(callRemoveAuthToken.CALL.fn.name).toBe('removeAuthToken');

        // Returns the logout
        var takeLogin = generator.next().value;
        expect(takeLogin.TAKE.pattern).toBe(LOG_IN);
      });
    });

    describe('starts up with a token that cannot be refreshed', function () {
      beforeEach(function () {
        var callGetToken = generator.next().value;
        expect(callGetToken.CALL.fn).toBe(defaultOptions.getAuthToken);

        // After getting the valid token, we should attempt to yield a call to the refresh saga
        var takeLogin = generator.next(null).value;
        expect(takeLogin.TAKE.pattern).toBe(LOG_IN);

        // Return's a LOG_IN action w/ username / password
        var callToAuthorize = generator.next({ type: LOG_IN, username: 'jcrygier', password: 'Password12' }).value;
        expect(callToAuthorize.CALL.fn.name).toBe('authorize');
        expect(callToAuthorize.CALL.args[1]).toEqual({ username: 'jcrygier', password: 'Password12' });
      });

      it('successful call to authorize user/password', function () {
        var forkActivityWatcher = generator.next(mockValidToken).value;
        expect(forkActivityWatcher.FORK.fn.name).toBe('watchForInactivity');

        var waitForExpiredRace = generator.next().value;
        expect(waitForExpiredRace.RACE.expired).toExist();
        expect(waitForExpiredRace.RACE.signout.TAKE.pattern).toBe(SIGN_OUT);

        // Rest of flow is tested above
      });

      it('failed call to authorize user/password', function () {
        var takeLogin = generator.next(null).value;
        expect(takeLogin.TAKE.pattern).toBe(LOG_IN);
      });
    });

    it('starts up with no token', function () {
      var callGetToken = generator.next().value;
      expect(callGetToken.CALL.fn).toBe(defaultOptions.getAuthToken);

      // After getting the valid token, we should attempt to yield a call to the refresh saga
      var takeLogin = generator.next().value;
      expect(takeLogin.TAKE.pattern).toBe(LOG_IN);

      // Rest of the flow has been covered above
    });
  });
});

describe('authorize saga', function () {
  var generator = void 0;

  describe('refresh token flow', function () {
    beforeEach(function () {
      generator = authorize(defaultOptions, mockValidToken);

      var raceForRefreshOrSignout = generator.next().value;
      expect(raceForRefreshOrSignout.RACE.signout.TAKE.pattern).toBe(SIGN_OUT);
      expect(raceForRefreshOrSignout.RACE.token.CALL.fn.name).toBe('refreshToken');
      expect(raceForRefreshOrSignout.RACE.token.CALL.args[0]).toBe(mockValidToken);
    });

    it('successfully refreshes the token', function () {
      // Should proceed to save the token
      var callSetToken = generator.next({ token: mockValidToken }).value;
      expect(callSetToken.CALL.fn.name).toBe('setAuthToken');
      expect(callSetToken.CALL.args[0]).toBe(mockValidToken);

      // Should tell the stores of the successful token
      var putAuthSuccess = generator.next().value;
      expect(putAuthSuccess.PUT.action.type).toBe(AUTH_SUCCESS);
      expect(putAuthSuccess.PUT.action.token).toBe(mockValidToken);

      // Annnnnd....we're done
      var finished = generator.next();
      expect(finished.done).toExist();
      expect(finished.value).toBe(mockValidToken);
    });

    it('returns a null response from the refresh call', function () {
      var putAuthFailure = generator.next({ token: null }).value;
      expect(putAuthFailure.PUT.action.type).toBe(AUTH_FAILURE);
      expect(putAuthFailure.PUT.action.error).toBe(INVALID_TOKEN_ERR);
      expect(putAuthFailure.PUT.action.authProcess).toBe(REFRESH_TOKEN);

      // Annnnnd....we're done
      var finished = generator.next();
      expect(finished.done).toExist();
      expect(finished.value).toBe(null);
    });

    it('throws an exception from the refresh call', function () {
      var err = new Error('Test Error');

      var putAuthFailure = generator.throw(err).value;
      expect(putAuthFailure.PUT.action.type).toBe(AUTH_FAILURE);
      expect(putAuthFailure.PUT.action.error).toBe(err);
      expect(putAuthFailure.PUT.action.authProcess).toBe(REFRESH_TOKEN);

      // Annnnnd....we're done
      var finished = generator.next();
      expect(finished.done).toExist();
      expect(finished.value).toBe(null);
    });

    it('signs out before the refresh can occur', function () {
      var finished = generator.next({ signout: true });
      expect(finished.done).toExist();
      expect(finished.value).toBe(null);
    });
  });
});