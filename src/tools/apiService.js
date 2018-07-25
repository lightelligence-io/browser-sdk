import UserManagerProvider from './userManagerProvider';
import EnvironmentProvider from './environmentProvider';

/**
 * @private
 * Makes GET http request with access_token
 * @param {string} path - resource path
 * @param {string} [method = 'GET'] - HTTP method
 * @returns {Promise}
 */
async function call(path, method = 'GET', body = null) {
  const user = await UserManagerProvider.get().getUser();
  const { apiUri } = EnvironmentProvider.get();

  if (!user) {
    throw Error('OLT Browser SDK: No authorized user found');
  }

  return fetch(`${apiUri}${path}`, {
    method,
    body,
    headers: {
      authorization: `Bearer ${user.access_token}`,
    },
  }).then(response => response.json());
}

export default {
  call,
};
