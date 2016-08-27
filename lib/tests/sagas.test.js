import expect from 'expect';

import { authenticationSaga, defaultOptions } from '../sagas';
import { LOG_IN, AUTH_SUCCESS, SIGN_OUT } from '../constants';
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
    });

    describe('starts up with a refreshable token', () => {
      beforeEach(() => {
        const callGetToken = generator.next().value;
        expect(callGetToken.CALL.fn).toBeA(Function);

        // After getting the valid token, we should attempt to refresh the token
        const afterToken = generator.next(mockValidToken).value;
        expect(afterToken.CALL.fn).toBe(defaultOptions.refreshToken);

        // Inject a successfully refreshed token - Should put into store
        const putTokenIntoStore = generator.next(mockValidToken).value;
        expect(putTokenIntoStore.PUT.action.type).toBe(AUTH_SUCCESS);
        expect(putTokenIntoStore.PUT.action.token).toBe(mockValidToken);

        const raceForExpiresOrSignOut = generator.next().value;
        expect(raceForExpiresOrSignOut.RACE).toExist();
      });

      it('then signs out before refreshing after expiry', () => {
        const timeoutRefresh = generator.next({ expired: true }).value;
        expect(timeoutRefresh.CALL.fn).toBe(defaultOptions.refreshToken);
      });

      it('then requests a sign out before the token expires', () => {
        const takeLogin = generator.next({ signout: signOut() }).value;
        expect(takeLogin.TAKE.pattern).toBe(LOG_IN);
      });
    });

    describe('starts up with a token that cannot be refreshed', () => {
      it('by refresh call returning null', () => {

      });

      it('by refresh call throwing exception', () => {

      });
    });

    it('should take in username / password from action', () => {
      const callGetToken = generator.next().value;
      expect(callGetToken.CALL.fn).toBeA(Function);

      const takeLogin = generator.next().value;
      expect(takeLogin.TAKE.pattern).toBe(LOG_IN);

      generator.next(login('jcrygier', 'Password12'));
    });
  });
});
