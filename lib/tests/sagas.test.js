import expect from 'expect';

import { authenticationSaga, defaultOptions, authorize } from '../sagas';
import { LOG_IN, AUTH_SUCCESS, AUTH_FAILURE, SIGN_OUT, REFRESH_TOKEN, INVALID_TOKEN_ERR } from '../constants';
import { login, signOut } from '../actions';

const mockValidToken = { access_token: '370592fd-b9f8-452d-816a-4fd5c6b4b8a6', token_type: 'bearer', expires_in: 10, scope: 'read write', refresh_token: '0ed8ffc6-f013-43a3-96bd-5a9565d63152' };

describe('authenticationSaga saga', () => {
  it('should take in options and return generator', () => {
    const saga = authenticationSaga();
    expect(saga).toBeA(Function);

    const sagaWithOpts = authenticationSaga({
      getAuthToken: () => 'Authentication Token',
    });
    expect(sagaWithOpts).toBeA(Function);
  });

  describe('with built in defaults', () => {
    let generator;

    beforeEach(() => {
      const saga = authenticationSaga();
      generator = saga();

      const forkActivityWatcher = generator.next().value;
      expect(forkActivityWatcher.FORK.fn.name).toBe('watchForInactivity');
    });

    describe('starts up with a refreshable token', () => {
      beforeEach(() => {
        const callGetToken = generator.next().value;
        expect(callGetToken.CALL.fn).toBe(defaultOptions.getAuthToken);

        // After getting the valid token, we should attempt to yield a call to the refresh saga
        const afterToken = generator.next(mockValidToken).value;
        expect(afterToken.CALL.fn).toBeA(Function);
      });

      it('successfully refreshes the token - and waits for the token to expire', () => {
        const waitForExpiredRace = generator.next(mockValidToken).value;
        // Verify it's the race for Token Expired or Signout
        expect(waitForExpiredRace.RACE.expired).toExist();
        expect(waitForExpiredRace.RACE.signout.TAKE.pattern).toBe(SIGN_OUT);

        // Returns the expiry
        const callToRefresh = generator.next({ expired: true }).value;
        expect(callToRefresh.CALL.fn).toBeA(Function);
        expect(callToRefresh.CALL.fn.name).toBe('authorize');
        expect(callToRefresh.CALL.args[1]).toBe(mockValidToken);
      });

      it('successfully refreshes the token - and signs out before expiration', () => {
        // Get to the race...verfied earler
        const waitForExpiredRace = generator.next(mockValidToken).value;

        // Returns the logout
        const takeLogin = generator.next({ signout: { type: SIGN_OUT } }).value;
        expect(takeLogin.TAKE.pattern).toBe(LOG_IN);
      });
    });

    describe('starts up with a token that cannot be refreshed', () => {
      beforeEach(() => {
        const callGetToken = generator.next().value;
        expect(callGetToken.CALL.fn).toBe(defaultOptions.getAuthToken);

        // After getting the valid token, we should attempt to yield a call to the refresh saga
        const takeLogin = generator.next(null).value;
        expect(takeLogin.TAKE.pattern).toBe(LOG_IN);

        // Return's a LOG_IN action w/ username / password
        const callToAuthorize = generator.next({ type: LOG_IN, username: 'jcrygier', password: 'Password12' }).value;
        expect(callToAuthorize.CALL.fn.name).toBe('authorize');
        expect(callToAuthorize.CALL.args[1]).toEqual({ username: 'jcrygier', password: 'Password12' });
      });

      it('successful call to authorize user/password', () => {
        const waitForExpiredRace = generator.next(mockValidToken).value;
        expect(waitForExpiredRace.RACE.expired).toExist();
        expect(waitForExpiredRace.RACE.signout.TAKE.pattern).toBe(SIGN_OUT);
      });

      it('failed call to authorize user/password', () => {
        const takeLogin = generator.next(null).value;
        expect(takeLogin.TAKE.pattern).toBe(LOG_IN);
      });
    });

    it('starts up with no token', () => {
      const callGetToken = generator.next().value;
      expect(callGetToken.CALL.fn).toBe(defaultOptions.getAuthToken);

      // After getting the valid token, we should attempt to yield a call to the refresh saga
      const takeLogin = generator.next().value;
      expect(takeLogin.TAKE.pattern).toBe(LOG_IN);

      // Rest of the flow has been covered above
    });
  });
});

describe('authorize saga', () => {
  let generator;

  describe('refresh token flow', () => {
    beforeEach(() => {
      generator = authorize(defaultOptions, mockValidToken);

      const raceForRefreshOrSignout = generator.next().value;
      expect(raceForRefreshOrSignout.RACE.signout.TAKE.pattern).toBe(SIGN_OUT);
      expect(raceForRefreshOrSignout.RACE.token.CALL.fn.name).toBe('refreshToken');
      expect(raceForRefreshOrSignout.RACE.token.CALL.args[0]).toBe(mockValidToken);
    });

    it('successfully refreshes the token', () => {
      // Should proceed to save the token
      const callSetToken = generator.next({ token: mockValidToken }).value;
      expect(callSetToken.CALL.fn.name).toBe('setAuthToken');
      expect(callSetToken.CALL.args[0]).toBe(mockValidToken);

      // Should tell the stores of the successful token
      const putAuthSuccess = generator.next().value;
      expect(putAuthSuccess.PUT.action.type).toBe(AUTH_SUCCESS);
      expect(putAuthSuccess.PUT.action.token).toBe(mockValidToken);

      // Annnnnd....we're done
      const finished = generator.next();
      expect(finished.done).toExist();
      expect(finished.value).toBe(mockValidToken);
    });

    it('returns a null response from the refresh call', () => {
      const putAuthFailure = generator.next({ token: null }).value;
      expect(putAuthFailure.PUT.action.type).toBe(AUTH_FAILURE);
      expect(putAuthFailure.PUT.action.error).toBe(INVALID_TOKEN_ERR);
      expect(putAuthFailure.PUT.action.authProcess).toBe(REFRESH_TOKEN);

      // Annnnnd....we're done
      const finished = generator.next();
      expect(finished.done).toExist();
      expect(finished.value).toBe(null);
    });

    it('throws an exception from the refresh call', () => {
      const err = new Error('Test Error');

      const putAuthFailure = generator.throw(err).value;
      expect(putAuthFailure.PUT.action.type).toBe(AUTH_FAILURE);
      expect(putAuthFailure.PUT.action.error).toBe(err);
      expect(putAuthFailure.PUT.action.authProcess).toBe(REFRESH_TOKEN);

      // Annnnnd....we're done
      const finished = generator.next();
      expect(finished.done).toExist();
      expect(finished.value).toBe(null);
    });

    it('signs out before the refresh can occur', () => {
      const finished = generator.next({ signout: true });
      expect(finished.done).toExist();
      expect(finished.value).toBe(null);
    });
  });
});
