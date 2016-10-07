var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Functions to support Authenitcation (to Spring Boot OAuth)
 *
 * 
 */
import TokenUtils from './TokenUtils';

var clientId = '';
var clientSecret = '';

var AuthUtils = function () {
  function AuthUtils() {
    _classCallCheck(this, AuthUtils);
  }

  _createClass(AuthUtils, null, [{
    key: 'setClientId',
    value: function setClientId(val) {
      clientId = val;
    }
  }, {
    key: 'setClientSecret',
    value: function setClientSecret(val) {
      clientSecret = val;
    }
  }, {
    key: 'getAuth',
    value: function getAuth() {
      return btoa(clientId + ':' + clientSecret);
    }
  }, {
    key: 'getToken',
    value: function getToken(username, password) {
      return fetch('/oauth/token', { method: 'POST', headers: { Authorization: 'Basic ' + AuthUtils.getAuth(), 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=password&username=' + username + '&password=' + password }).then(function (response) {
        return response.json();
      }).then(TokenUtils.toToken);
    }
  }, {
    key: 'refreshToken',
    value: function refreshToken(token) {
      return fetch('/oauth/token', { method: 'POST', headers: { Authorization: 'Basic ' + AuthUtils.getAuth(), 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=refresh_token&refresh_token=' + token.refresh_token }).then(function (response) {
        return response.json();
      }).then(TokenUtils.toToken);
    }
  }]);

  return AuthUtils;
}();

export default AuthUtils;