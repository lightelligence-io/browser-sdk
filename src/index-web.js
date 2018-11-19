import { UserManager } from "oidc-client";
import UserManagerProvider from "./tools/userManagerProvider";
import EnvironmentProvider from "./tools/environmentProvider";
import Tenant from "./modules/tenant";
import Client from "./modules/client";
import Device from "./modules/device";
import Timeseries from "./modules/timeseries";
import Event from "./modules/event";
import Certificate from "./modules/certificate";
import DeviceType from "./modules/deviceType";

export { Tenant, Client, Device, DeviceType, Timeseries, Event, Certificate };

const AUTH_CALLBACK_PATH = "/auth-callback";

/**
 * Main browser sdk module
 * TODO: add getting started block here
 * @param {Object} options
 * @param {string} [options.environment] - lightelligence environment.
 * avalaible options: 'dev', 'int', 'preview', 'prod'
 * @param {array} [options.scope = ['openid', 'profile', 'email', 'offline_access']] - openid scope
 * @param {string} options.clientId - registered app client id
 */
export default class BrowserSDK {
  constructor({
    environment,
    clientId,
    scope = ["openid", "profile", "email", "offline_access"]
  }) {
    if (!environment || !clientId) {
      throw Error("OLT Browser SDK: Missing one or more init options.");
    }

    this.manager = new UserManager({
      authority: environment === 'prod' ? 'https://id.lightelligence.io/v1/id/auth/realms/olt' :`https://id.${environment}.oltd.de/v1/id/auth/realms/olt`,
      client_id: clientId,
      scope: scope.join(" "),
      response_type: "id_token token",
      redirect_uri: `${window.location.origin}${AUTH_CALLBACK_PATH}`,
      post_logout_redirect_uri: window.location.origin
    });

    // execute this code only on redirect from token issuer
    if (window.location.pathname === AUTH_CALLBACK_PATH) {
      this.manager
        .signinRedirectCallback()
        .then(() => {
          window.location = window.location.origin;
        })
        .catch(e => {
          throw new Error(e);
        });
    }

    UserManagerProvider.set(this.manager);
    EnvironmentProvider.set({
      apiUri: `https://api.${environment}.oltd.de/v1`,
      clientId
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
      if (!user && window.location.pathname !== AUTH_CALLBACK_PATH) {
        this.manager.signinRedirect({ login_hint: loginHint });
      }
    });
  }

  /**
   * Redirects to the tenant selection page if the user is already logged in.
   * Otherwise it redirects to the keycloak login page.
   */
  changeTenant() {
    this.manager.signinRedirect();
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
