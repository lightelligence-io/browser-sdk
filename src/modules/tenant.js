import ApiService from '../tools/apiService';

/**
 * Methods for tenant operations
 */
export default class Tenant {
  /**
   * Get the tenants of a user for the supplied userId
   * @param {string} userId
   * @param {object} params search params
   * @param {number} [params.page=0] The number of the result page starting with 0
   * @param {number} [params.pageSize=10] The number of result per page
   * @returns {Promise}
   */
  static getUserTenants(userId, params) {
    const urlParams = new URLSearchParams(params);
    return ApiService.call(`/users/${userId}/tenants?${urlParams.toString()}`);
  }

  /**
   * Creates a new tenant
   * @param {object} tenant
   * @returns {Promise}
   */
  static createTenant(tenant) {
    return ApiService.call('/tenants', 'POST', tenant);
  }

  /**
   * Gets tenant
   * @param {string} tenantId
   * @returns {Promise}
   */
  static getTenant(tenantId) {
    return ApiService.call(`/tenants/${tenantId}`);
  }

  /**
   * Get the users associated to a tenant by any role
   * @param {string} tenantId
   * @returns {Promise}
   */
  static getTenantUsers(tenantId) {
    return ApiService.call(`/tenants/${tenantId}/users`);
  }

  /**
   * Delete tenant for the supplied tenantId
   * @param {string} tenantId
   * @returns {Promise}
   */
  static deleteTenant(tenantId) {
    return ApiService.call(`/tenants/${tenantId}`, 'DELETE');
  }
}
