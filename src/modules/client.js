import ApiService from '../tools/apiService';

/**
 * Methods for client operations
 */
export default class Client {
  /**
   * Create a new client for your current tenant.
   * As stated in the Client model, the client secret will only be
   * returned upon client creation, and you will never be able to
   * get it again. Store it safe and secure.
   * @param {object} client
   * @returns {Promise}
   */
  static createClient(client) {
    return ApiService.call('/clients', 'POST', client);
  }

  /**
   * Get the client for the supplied clientId
   * @param {string} clientId
   * @returns {Promise}
   */
  static getClient(clientId) {
    return ApiService.call(`/clients/${clientId}`);
  }

  /**
   * Delete the client for the supplied clientId
   * @param {string} clientId
   * @returns {Promise}
   */
  static deleteClient(clientId) {
    return ApiService.call(`/clients/${clientId}`, 'DELETE');
  }
}
