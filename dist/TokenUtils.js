var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Utilities for getting / verifying OAuth2 Tokens
 *
 * 
 */

var TokenUtils = function () {
  function TokenUtils() {
    _classCallCheck(this, TokenUtils);
  }

  _createClass(TokenUtils, null, [{
    key: 'getAuthToken',
    value: function getAuthToken() {
      return JSON.parse(localStorage.getItem('authToken') || 'null');
    }
  }, {
    key: 'setAuthToken',
    value: function setAuthToken(token) {
      localStorage.setItem('authToken', JSON.stringify(token));
    }
  }, {
    key: 'removeAuthToken',
    value: function removeAuthToken() {
      localStorage.removeItem('authToken');
    }
  }, {
    key: 'toToken',
    value: function toToken(obj) {
      if ({}.hasOwnProperty.call(obj, 'access_token') && {}.hasOwnProperty.call(obj, 'token_type') && {}.hasOwnProperty.call(obj, 'refresh_token') && {}.hasOwnProperty.call(obj, 'expires_in') && {}.hasOwnProperty.call(obj, 'scope')) return obj;

      return null;
    }
  }]);

  return TokenUtils;
}();

export default TokenUtils;