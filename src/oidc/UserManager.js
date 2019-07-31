import * as OIDC from 'oidc-client';

/**
 * @typedef jsonService
 * @property {Function} postForm
 * @property {XMLHttpRequest} _XMLHttpRequest
 * @property {Array<string>} _contentTypes
 */

/**
 * @typedef jsonServicePostFormPayload
 * @property {Object<string>} headers
 */

/**
 * @typedef tokenClient
 * @property {jsonService} _jsonService
 * @property {Function} exchangeRefreshToken
 */

/**
 * User Manager
 *
 * Just a wrapper around OIDC.UserManager
 * https://github.com/IdentityModel/oidc-client-js/blob/dev/src/UserManager.js
 */
export default class UserManager extends OIDC.UserManager {
  constructor(settings) {
    super(settings);

    /**
     * We access the tokenClient which is part of the UserManager
     *
     * https://github.com/IdentityModel/oidc-client-js/blob/dev/src/UserManager.js#L45
     *
     * @type tokenClient
     */
    const tokenClient = this._tokenClient; // eslint-disable-line

    /**
     * We need to access the JSONService instance in order to modify the
     * XMLHTTPRequest to accept headers.
     *
     * https://github.com/IdentityModel/oidc-client-js/blob/dev/src/JsonService.js#L99
     */
    const jsonService = tokenClient._jsonService; // eslint-disable-line

    /** @type Array<string> */
    const allowedContentTypes = jsonService._contentTypes; // eslint-disable-line

    /**
     * Checks if a content type is one of the allowed ones
     *
     * @param contentType
     * @returns {string}
     */
    const isAllowedContentType = contentType =>
      allowedContentTypes.find(item => contentType.startsWith(item));

    /**
     * Replaces postForm method of the jsonService.
     * https://github.com/IdentityModel/oidc-client-js/blob/dev/src/JsonService.js#L99
     *
     * @param {string} url
     * @param {jsonServicePostFormPayload} payload
     */
    jsonService.postForm = (url, payload) => {
      /** @type XMLHttpRequest */
      const XMLHttpRequest = jsonService._XMLHttpRequest; // eslint-disable-line

      if (!url) {
        OIDC.Log.error('JsonService.postForm: No url passed');
        throw new Error('url');
      }

      OIDC.Log.debug('JsonService.postForm, url: ', url);

      return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();
        req.open('POST', url);

        req.onload = () => {
          OIDC.Log.debug(
            'JsonService.postForm: HTTP response received, status',
            req.status
          );

          if (req.status !== 200 && req.status !== 400) {
            return reject(Error(`${req.statusText} ( ${req.status} )`));
          }

          const contentType = req.getResponseHeader('Content-Type');

          if (!contentType || !isAllowedContentType(contentType)) {
            if (req.status === 200) {
              return reject(
                Error(
                  `Invalid response Content-Type: ${contentType}, from URL: ${url}`
                )
              );
            }
            return reject(Error(`${req.statusText} ( ${req.status} )`));
          }

          try {
            const responsePayload = JSON.parse(req.responseText);
            if (req.status === 200) {
              return resolve(responsePayload);
            }
            if (responsePayload && responsePayload.error) {
              OIDC.Log.error(
                'JsonService.postForm: Error from server: ',
                responsePayload.error
              );
              return reject(new Error(responsePayload.error));
            }
          } catch (error) {
            OIDC.Log.error(
              'JsonService.postForm: Error parsing JSON response',
              error.message
            );
            return reject(error);
          }

          return reject(Error(`${req.statusText} ( ${req.status} )`));
        };

        req.onerror = () => {
          OIDC.Log.error('JsonService.postForm: network error');
          reject(Error('Network Error'));
        };

        const body = Object.entries(payload)
          .filter(([key]) => key !== 'headers')
          .map(pair => pair.map(encodeURIComponent))
          .map(([key, value]) => `${key}=${value}`)
          .join('&');

        req.setRequestHeader(
          'Content-Type',
          'application/x-www-form-urlencoded'
        );

        Object.entries(payload.headers || {}).forEach(([name, value]) => {
          req.setRequestHeader(name, value);
        });

        req.send(body);
      });
    };
  }

  /**
   * Change the tenant id
   *
   * @param {string} tenantId  Changes the users's tenant
   * @returns {Promise<User>}
   */
  async changeTenant(tenantId) {
    /** @type {tokenClient} */
    const tokenClient = this._tokenClient; // eslint-disable-line

    const user = await this.getUser();

    if (!user || !user.refresh_token) {
      throw new Error('changeTenant: No refresh token');
    }

    if (!user.profile) {
      throw new Error('changeTenant: No profile loaded for the user');
    }

    const result = await tokenClient.exchangeRefreshToken({
      refresh_token: user.refresh_token,
      headers: { 'X-Requested-With': tenantId },
    });

    if (
      !result ||
      !result.access_token ||
      !result.refresh_token ||
      !result.expires_in
    ) {
      throw new Error('changeTenant: Error while changing tenant');
    }

    user.access_token = result.access_token;
    user.refresh_token = result.refresh_token;
    user.expires_in = result.expires_in;
    user.profile.tenant = tenantId;

    await this.storeUser(user);

    this.events.load(user);

    return user;
  }
}
