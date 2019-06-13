import userManagerProvider from './userManagerProvider';
import environmentProvider from './environmentProvider';

const addErrorMessageIfMissing = response => {
  if (!response.errorMessage && response.httpStatusCode >= 400) {
    const errorMessage = `Unknown Error occurred. Please try again later. Error Code: ${
      response.httpStatusCode
    }`;
    return {
      ...response,
      errorMessage,
    };
  }
  return response;
};

/**
 * @private
 * Makes GET http request with access_token
 * @param {string} path - resource path
 * @param {string} [method = 'GET'] - HTTP method
 * @param {object} [body = null] - HTTP method
 * @returns {Promise}
 */
async function call(path, method = 'GET', body = null) {
  const user = await userManagerProvider.get().getUser();
  const { apiUri } = environmentProvider.get();

  if (!user) {
    throw Error('OLT Browser SDK: No authorized user found');
  }

  return fetch(`${apiUri}${path}`, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      authorization: `Bearer ${user.access_token}`,
      'Content-Type': 'application/json',
    },
  }).then(async response => {
    const base = { response, httpStatusCode: response.status };
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.indexOf('application/json') !== -1) {
      const json = await response.json();
      return addErrorMessageIfMissing({
        ...base,
        ...json,
      });
    }

    return addErrorMessageIfMissing(base);
  });
}

export default {
  call,
};
