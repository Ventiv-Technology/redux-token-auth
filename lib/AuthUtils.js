/**
 * Functions to support Authenitcation (to Spring Boot OAuth)
 *
 * @flow
 */
import TokenUtils from './TokenUtils';

const sampleToken = { access_token: '370592fd-b9f8-452d-816a-4fd5c6b4b8a6', token_type: 'bearer', expires_in: 10, scope: 'read write', refresh_token: '0ed8ffc6-f013-43a3-96bd-5a9565d63152' };

export default class AuthUtils {

  static getToken(username : string, password : string) : Promise<?Token> {
    return fetch('/getToken')
      // .then(response => response.json())
      .then(_ => sampleToken)
      .then(TokenUtils.toToken);
  }

  static refreshToken(token : Token) : Promise<?Token> {
    return fetch('/refreshToken')
      .then(response => response.json());
  }

}
