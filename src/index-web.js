import { UserManager } from 'oidc-client';
import UserManagerProvider from './tools/userManagerProvider';
import EnvironmentProvider from './tools/environmentProvider';
import Tenant from './modules/tenant';
import Client from './modules/client';
import Device from './modules/device';
import Timeseries from './modules/timeseries';
import Event from './modules/event';
import Certificate from './modules/certificate';
import DeviceType from './modules/deviceType';

export { Tenant, Client, Device, DeviceType, Timeseries, Event, Certificate };

/**
 * Main browser sdk module
 * TODO: add getting started block here
 * @param {Object} options
 * @param {string} options.environment - lightelligence environment.
 * avalaible options: 'dev', 'int', 'preview'
 * @param {array} [options.scope = ['openid', 'profile', 'email', 'offline_access']] - openid scope
 * @param {string} options.clientId - registered app client id
 */
export default class BrowserSDK {
  constructor({ environment, clientId, scope = ['openid', 'profile', 'email', 'offline_access'] }) {
    if (!environment || !clientId) {
      throw Error('OLT Browser SDK: Missing one or more init options.');
    }

    this.manager = new UserManager({
      authority: `https://api.${environment}.oltd.de/auth/realms/olt`,
      client_id: clientId,
      scope: scope.join(' '),
      response_type: 'id_token token',
      redirect_uri: window.location.origin,
      post_logout_redirect_uri: window.location.origin,
    });

    this.manager
      .signinRedirectCallback()
      .then(() => {
        window.location = window.location.origin;
      })
      .catch(() => null);

    UserManagerProvider.set(this.manager);
    EnvironmentProvider.set({
      apiUri: `https://api.${environment}.oltd.de/v1`,
      clientId,
    });
  }

  /**
   * Redirects to login page if user is not logged in already
   */
  login() {
    return this.manager.getUser().then((user) => {
      if (!user) {
        this.manager.signinRedirect();
      }
    });
  }

  /**
   * Logs user out
   */
  logout() {
    UserManagerProvider.clear();
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
