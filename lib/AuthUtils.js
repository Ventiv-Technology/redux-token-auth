/**
 * Functions to support Authenitcation (to Spring Boot OAuth)
 *
 * @flow
 */
import TokenUtils from './TokenUtils';

export default class AuthUtils {

  static getToken(username : string, password : string) : Promise<?Token> {
    return fetch('/oauth/token', { method: 'POST', headers: { Authorization: 'Basic YWNtZTphY21lc2VjcmV0', 'Content-Type': 'application/x-www-form-urlencoded' }, body: `grant_type=password&username=${username}&password=${password}` })
      .then(response => response.json())
      .then(TokenUtils.toToken);
  }

  static refreshToken(token : Token) : Promise<?Token> {
    return fetch('/oauth/token', { method: 'POST', headers: { Authorization: 'Basic YWNtZTphY21lc2VjcmV0', 'Content-Type': 'application/x-www-form-urlencoded' }, body: `grant_type=refresh_token&refresh_token=${token.refresh_token}` })
      .then(response => response.json())
      .then(TokenUtils.toToken);
  }

}
