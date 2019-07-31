import UserManager from './oidc/UserManager';
import userManagerProvider from './tools/userManagerProvider';
import environmentProvider from './tools/environmentProvider';
import User from './modules/user';
import Tenant from './modules/tenant';
import Client from './modules/client';
import Device from './modules/device';
import Timeseries from './modules/timeseries';
import Event from './modules/event';
import Certificate from './modules/certificate';
import DeviceType from './modules/deviceType';
import Consumption from './modules/consumption';
import Role from './modules/role';
import Application from './modules/application';
import ApplicationDeveloper from './modules/applicationDeveloper';

export {
  User,
  Tenant,
  Client,
  Device,
  DeviceType,
  Timeseries,
  Event,
  Certificate,
  Consumption,
  Role,
  Application,
  ApplicationDeveloper,
};

const AUTH_CALLBACK_DEFAULT_PATH = '/auth-callback';

/**
 * Main browser sdk module
 * TODO: add getting started block here
 * @param {Object} options
 * @param {string} [options.environment] - lightelligence environment.
 * avalaible options: 'dev', 'int', 'preview', 'prod'
 * @param {array} [options.scope = ['openid', 'profile', 'email']] - openid scope
 * @param {string} options.clientId - registered app client id
 * @param {string} [options.authCallback = '/auth-callback'] - configurable authCallback path, the
 * signin redirect after this path is called is automatically handled by this sdk
 */
export default class BrowserSDK {
  constructor({
    environment,
    clientId,
    scope = ['openid', 'profile', 'email'],
    authCallback = AUTH_CALLBACK_DEFAULT_PATH,
  }) {
    if (!environment || !clientId) {
      throw Error('OLT Browser SDK: Missing one or more init options.');
    }
    const baseUrl = environmentProvider.getBaseUrlFromEnv(environment);

    this.authCallback = authCallback;

    this.manager = new UserManager({
      authority: `https://id.${baseUrl}/v1/id/auth/realms/olt`,
      client_id: clientId,
      scope: scope.join(' '),
      response_type: 'code', // Authorisation code flow only since we don't support anything else
      redirect_uri: `${window.location.origin}${authCallback}`,
      post_logout_redirect_uri: window.location.origin,
    });

    // execute this code only on redirect from token issuer
    if (window.location.pathname === authCallback) {
      this.manager
        .signinRedirectCallback()
        .then(() => {
          window.location = window.location.origin;
        })
        .catch(e => {
          throw new Error(e);
        });
    }

    userManagerProvider.set(this.manager);
    environmentProvider.set({
      apiUri: `https://api.${baseUrl}/v1`,
      clientId,
    });
  }

  /**
   * Redirects to login page if user is not logged in already
   * @param {Object} [options]
   * @param {string} [options.loginHint] - login_hint to forward email/username in keycloak.
   */
  login({ loginHint } = {}) {
    return this.manager.getUser().then(user => {
      // ignore this code only on redirect from token issuer
      if (!user && window.location.pathname !== this.authCallback) {
        this.manager.signinRedirect({ login_hint: loginHint });
      }
    });
  }

  /**
   * Changes a tenant
   *
   * In case there is no tenantId provided, it will either redirect to the
   * tenant selection page or to the oAuth login page.
   *
   * @param {string} [tenantId]  The tenant id that the user wants to change to
   */
  changeTenant(tenantId) {
    return tenantId
      ? this.manager.changeTenant(tenantId)
      : this.manager.signinRedirect();
  }

  /**
   * Logs user out
   */
  logout() {
    userManagerProvider.clear();
    this.manager.signoutRedirect();
  }

  /**
   * Return current user
   * @returns {Promise} user profile object
   */
  getCurrentUser() {
    return this.manager.getUser();
  }
}
