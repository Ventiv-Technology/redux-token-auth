/**
 * Flow Types used in this library
 *
 * @flow
 */

export type Token = {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  expires_date?: Date;
};

export type Options = {
  getAuthToken?: () => Token;
  setAuthToken?: (token: Token) => void;
  removeAuthToken?: () => void;
  getToken: (username : string, password : string) => Promise<Token>;
  refreshToken: (token : Token) => Promise<Token>;
};
