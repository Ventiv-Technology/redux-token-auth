/**
 * Global sagas
 */

import { push } from 'react-router-redux';
import { take, put } from 'redux-saga/effects';

import { AUTH_SUCCESS } from '../lib/constants';

export function* listenForAuthSuccess() : Generator<*, *, *> {
  while (true) {  // eslint-disable-line
    const authSuccess = yield take(AUTH_SUCCESS);
    yield put(push('/'));     // TODO: check for redirection parameter?
  }
}
