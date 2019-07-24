import * as OIDC from 'oidc-client';

/**
 * User Manager
 *
 * Just a wrapper around OIDC.UserManager
 * https://github.com/IdentityModel/oidc-client-js/blob/dev/src/UserManager.js
 */
export default class UserManager extends OIDC.UserManager {
  constructor(settings) {
    super(settings);
    // eslint-disable-next-line no-underscore-dangle,func-names
    this._tokenClient._jsonService.postForm = function(url, payload) {
      if (!url) {
        OIDC.Log.error('JsonService.postForm: No url passed');
        throw new Error('url');
      }

      OIDC.Log.debug('JsonService.postForm, url: ', url);

      return new Promise((resolve, reject) => {
        // eslint-disable-next-line no-underscore-dangle
        const req = new this._XMLHttpRequest();
        req.open('POST', url);

        // eslint-disable-next-line no-underscore-dangle
        const allowedContentTypes = this._contentTypes;

        req.onload = () => {
          OIDC.Log.debug(
            'JsonService.postForm: HTTP response received, status',
            req.status
          );

          if (req.status === 200) {
            const contentType = req.getResponseHeader('Content-Type');
            if (contentType) {
              const found = allowedContentTypes.find(item =>
                contentType.startsWith(item)
              );

              if (found) {
                try {
                  resolve(JSON.parse(req.responseText));
                  return;
                } catch (e) {
                  OIDC.Log.error(
                    'JsonService.postForm: Error parsing JSON response',
                    e.message
                  );
                  reject(e);
                  return;
                }
              }
            }

            reject(
              Error(
                `Invalid response Content-Type: ${contentType}, from URL: ${url}`
              )
            );
            return;
          }

          if (req.status === 400) {
            const contentType = req.getResponseHeader('Content-Type');
            if (contentType) {
              const found = allowedContentTypes.find(item =>
                contentType.startsWith(item)
              );

              if (found) {
                try {
                  const requestPayload = JSON.parse(req.responseText);
                  if (requestPayload && requestPayload.error) {
                    OIDC.Log.error(
                      'JsonService.postForm: Error from server: ',
                      requestPayload.error
                    );
                    reject(new Error(requestPayload.error));
                    return;
                  }
                } catch (e) {
                  OIDC.Log.error(
                    'JsonService.postForm: Error parsing JSON response',
                    e.message
                  );
                  reject(e);
                  return;
                }
              }
            }
          }

          reject(Error(`${req.statusText} ( ${req.status} )`));
        };

        req.onerror = () => {
          OIDC.Log.error('JsonService.postForm: network error');
          reject(Error('Network Error'));
        };

        const body = Object.entries(payload)
          .filter(([key]) => key === 'headers')
          .map(
            ([key, value]) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
          )
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

  changeTenant(tenantId) {
    // eslint-disable-next-line no-underscore-dangle
    return this._loadUser().then(user => {
      if (!user || !user.refresh_token) {
        throw new Error('changeTenant: No refresh token');
      }
      // eslint-disable-next-line no-underscore-dangle
      return this._tokenClient.exchangeRefreshToken({
        refresh_token: user.refresh_token,
        headers: {
          tenant: tenantId,
        },
      });
    });
  }
}
