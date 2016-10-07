/**
 * Functions to support Authenitcation (to Spring Boot OAuth)
 *
 * @flow
 */
import TokenUtils from './TokenUtils';


let clientId = '';
let clientSecret = '';

export default class AuthUtils {

  static setClientId(val: string) {
    clientId = val;
  }

  static setClientSecret(val: string) {
    clientSecret = val;
  }

  static getAuth() {
    return btoa(`${clientId}:${clientSecret}`);
  }

  static getToken(username : string, password : string) : Promise<?Token> {
    return fetch('/oauth/token', { method: 'POST', headers: { Authorization: `Basic ${AuthUtils.getAuth()}`, 'Content-Type': 'application/x-www-form-urlencoded' }, body: `grant_type=password&username=${username}&password=${password}` })
      .then(response => response.json())
      .then(TokenUtils.toToken);
  }

  static refreshToken(token : Token) : Promise<?Token> {
    return fetch('/oauth/token', { method: 'POST', headers: { Authorization: `Basic ${AuthUtils.getAuth()}`, 'Content-Type': 'application/x-www-form-urlencoded' }, body: `grant_type=refresh_token&refresh_token=${token.refresh_token}` })
      .then(response => response.json())
      .then(TokenUtils.toToken);
  }

}
