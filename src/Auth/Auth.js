import auth0 from 'auth0-js';

const REDIRECT_ON_LOGIN = 'redirect_on_login';
let _accessToken = null;
let _idToken = null;
let _expiresAt = null;
let _scopes = null;

export default class Auth {
  constructor(history) {
    this.history = history;
    this.userProfile = null;
    this.requestedScopes = 'openid profile email read:courses';
    this.auth0 = new auth0.WebAuth({
      domain: process.env.REACT_APP_AUTH0_DOMAIN,
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
      redirectUri: process.env.REACT_APP_AUTH0_CALLBACK_URL,
      responseType: 'token id_token',
      scope: this.requestedScopes,
      audience: process.env.REACT_APP_AUTH0_AUDIENCE
    });
  }

  login = () => {
    localStorage.setItem(
      REDIRECT_ON_LOGIN,
      JSON.stringify(this.history.location)
    );
    this.auth0.authorize();
  };

  handleAuthentication = () => {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        const redirectLocation =
          localStorage.getItem(REDIRECT_ON_LOGIN) === undefined
            ? '/'
            : JSON.parse(localStorage.getItem(REDIRECT_ON_LOGIN));
        this.history.push(redirectLocation);
      } else if (err) {
        this.history.push('/');
        alert(`Error: ${err.error}. Check console for futher info`);
        console.log(err);
      }
      localStorage.removeItem(REDIRECT_ON_LOGIN);
    });
  };

  setSession = (authResult) => {
    _expiresAt = authResult.expiresIn * 1000 + new Date().getTime();
    _scopes = authResult.scopes || this.requestedScopes || '';
    _accessToken = authResult.accessToken;
    _idToken = authResult.idToken;
    this.scheduleTokenRenwal();
  };

  isAuthenticated = () => {
    return new Date().getTime() < _expiresAt;
  };

  logout = () => {
    this.auth0.logout({
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
      returnTo: 'http://localhost:3000'
    });
  };

  getAccessToken = () => {
    if (!_accessToken) {
      return new Error('No access token found');
    }
    return _accessToken;
  };

  getProfile = (cb) => {
    if (this.userProfile) {
      return cb(this.userProfile);
    }
    this.auth0.client.userInfo(this.getAccessToken(), (err, profile) => {
      if (profile) this.userProfile = profile;
      cb(profile, err);
    });
  };

  userHasScope = (scopes) => {
    const grantedScope = (_scopes || '').split(' ');
    return scopes.every((scope) => grantedScope.includes(scope));
  };

  renewToken(cb) {
    this.auth0.checkSession({}, (err, result) => {
      if (err) {
        console.log(`Error: ${err.error} -  ${err.error_description}`);
      } else {
        this.setSession(result);
      }

      if (cb) {
        cb(err, result);
      }
    });
  }

  scheduleTokenRenwal() {
    const delay = _expiresAt - Date.now();
    if (delay > 0) setTimeout(() => this.renewToken(), delay);
  }
}