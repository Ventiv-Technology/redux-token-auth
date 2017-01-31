'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Functions to support Authenitcation (to Spring Boot OAuth)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _TokenUtils = require('./TokenUtils');

var _TokenUtils2 = _interopRequireDefault(_TokenUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
      }).then(_TokenUtils2.default.toToken);
    }
  }, {
    key: 'refreshToken',
    value: function refreshToken(token) {
      return fetch('/oauth/token', { method: 'POST', headers: { Authorization: 'Basic ' + AuthUtils.getAuth(), 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=refresh_token&refresh_token=' + token.refresh_token }).then(function (response) {
        return response.json();
      }).then(_TokenUtils2.default.toToken);
    }
  }]);

  return AuthUtils;
}();

exports.default = AuthUtils;