/**
 * Utilities for getting / verifying OAuth2 Tokens
 *
 * @flow
 */

export default class TokenUtils {

  static getAuthToken() : Token {
    return JSON.parse(localStorage.getItem('authToken') || 'null');
  }

  static setAuthToken(token : Token) {
    localStorage.setItem('authToken', JSON.stringify(token));
  }

  static removeAuthToken() {
    localStorage.removeItem('authToken');
  }

  static toToken(obj : any) : ?Token {
    if ({}.hasOwnProperty.call(obj, 'access_token') &&
      {}.hasOwnProperty.call(obj, 'token_type') &&
      {}.hasOwnProperty.call(obj, 'refresh_token') &&
      {}.hasOwnProperty.call(obj, 'expires_in') &&
      {}.hasOwnProperty.call(obj, 'scope'))
      return obj;

    return null;
  }

}
