'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Redux Constants used in this library
 *
 * 
 */

var AUTH_FAILURE = exports.AUTH_FAILURE = 'spring-redux-oauth/constants/AUTH_FAILURE';
var AUTH_SUCCESS = exports.AUTH_SUCCESS = 'spring-redux-oauth/constants/AUTH_SUCCESS';
var AUTHENTICATING = exports.AUTHENTICATING = 'spring-redux-oauth/constants/AUTHENTICATING';
var LOG_IN = exports.LOG_IN = 'spring-redux-oauth/constants/LOG_IN';
var SIGN_OUT = exports.SIGN_OUT = 'spring-redux-oauth/constants/SIGN_OUT';

// Non-redux constants
var GET_TOKEN = exports.GET_TOKEN = 'GET_TOKEN';
var INVALID_TOKEN_ERR = exports.INVALID_TOKEN_ERR = 'Server did not respond with a token';
var REFRESH_TOKEN = exports.REFRESH_TOKEN = 'REFRESH_TOKEN';