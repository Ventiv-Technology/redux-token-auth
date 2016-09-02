/**
 * Global sagas
 */

import { push } from 'react-router-redux';
import { take, put, race } from 'redux-saga/effects';

import { AUTH_SUCCESS, SIGN_OUT } from '../lib/constants';

export function* listenForAuthChange() : Generator<*, *, *> {
  while (true) {  // eslint-disable-line
    const raceResponse = yield race({
      signOut: take(SIGN_OUT),
      authSuccess: take(AUTH_SUCCESS),
    });

    if (raceResponse && raceResponse.authSuccess)
      yield put(push('/'));     // TODO: check for redirection parameter?
    else
      yield put(push('/login'));     // TODO: put in redirection parameter?
  }
}
