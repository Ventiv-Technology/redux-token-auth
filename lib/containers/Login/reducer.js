/*
 * Login Reducer
 */

import {
  CHANGE_USERNAME, CHANGE_PASSWORD,
} from './constants';
import { AUTH_FAILURE, AUTH_SUCCESS } from '../../constants';
import { fromJS } from 'immutable';

// The initial state of the App
const initialState = fromJS({
  username: '',
  password: '',
  authFailure: false,
});

function loginReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_USERNAME:
      return state.set('username', action.username);
    case CHANGE_PASSWORD:
      return state.set('password', action.password);
    case AUTH_FAILURE:
      return state.set('authFailure', action.error);
    case AUTH_SUCCESS:
      return state.merge({ authFailure: false, password: '' });
    default:
      return state;
  }
}

export default loginReducer;
