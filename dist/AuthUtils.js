var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Functions to support Authenitcation (to Spring Boot OAuth)
 *
 * 
 */
import TokenUtils from './TokenUtils';

var AuthUtils = function () {
  function AuthUtils() {
    _classCallCheck(this, AuthUtils);
  }

  _createClass(AuthUtils, null, [{
    key: 'getToken',
    value: function getToken(username, password) {
      return fetch('/oauth/token', { method: 'POST', headers: { Authorization: 'Basic YWNtZTphY21lc2VjcmV0', 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=password&username=' + username + '&password=' + password }).then(function (response) {
        return response.json();
      }).then(TokenUtils.toToken);
    }
  }, {
    key: 'refreshToken',
    value: function refreshToken(token) {
      return fetch('/oauth/token', { method: 'POST', headers: { Authorization: 'Basic YWNtZTphY21lc2VjcmV0', 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=refresh_token&refresh_token=' + token.refresh_token }).then(function (response) {
        return response.json();
      }).then(TokenUtils.toToken);
    }
  }]);

  return AuthUtils;
}();

export default AuthUtils;