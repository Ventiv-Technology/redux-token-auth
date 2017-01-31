'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.changeUsername = changeUsername;
exports.changePassword = changePassword;

var _constants = require('./constants');

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of CHANGE_USERNAME
 */
function changeUsername(username) {
  return {
    type: _constants.CHANGE_USERNAME,
    username: username
  };
} /*
   * Login Actions
   */

function changePassword(password) {
  return {
    type: _constants.CHANGE_PASSWORD,
    password: password
  };
}