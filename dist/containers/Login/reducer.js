'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _immutable = require('immutable');

var _constants = require('./constants');

var _constants2 = require('../../constants');

// The initial state of the App
var initialState = (0, _immutable.fromJS)({
  username: '',
  password: '',
  authFailure: false
}); /*
     * Login Reducer
     */

function loginReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {
    case _constants.CHANGE_USERNAME:
      return state.set('username', action.username);
    case _constants.CHANGE_PASSWORD:
      return state.set('password', action.password);
    case _constants2.AUTH_FAILURE:
      return state.set('authFailure', action.error);
    case _constants2.AUTH_SUCCESS:
      return state.merge({ authFailure: false, password: '' });
    default:
      return state;
  }
}

exports.default = loginReducer;