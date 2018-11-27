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
   * Creates a new tenant and assigns role 'admin' to user.
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

  /**
   * Create invite for tenant
   * @param {string} tenantId
   * @param {Object} invite - the invite to be created.
   * @param {string} invite.receiverEmail - email of user to be invited
   * @param {array<string>} invite.roleNames - Array of roles for user to be assigned to. Ex. ['admin']
   * @returns {Promise}
   */
  static createInvite(tenantId, invite) {
    return ApiService.call(`/tenants/${tenantId}/invites`, 'POST', invite);
  }

  /**
   * Get tenant invites
   * @param {string} tenantId
   * @returns {Promise}
   */
  static getInvites(tenantId) {
    return ApiService.call(`/tenants/${tenantId}/invites`);
  }

  /**
   * Delete (revoke) a invite for a user.
   * - Only open invites can be deleted
   * @param {string} tenantId
   * @param {string} inviteId
   * @returns {Promise}
   */
  static deleteInvite(tenantId, inviteId) {
    return ApiService.call(`/tenants/${tenantId}/invites/${inviteId}`, 'DELETE');
  }

  /**
   * Gets roles of tenant
   * @param {string} tenantId
   * @returns {Promise}
   */
  static getTenantRoles(tenantId) {
    return ApiService.call(`/tenants/${tenantId}/roles`);
  }

  /**
   * Gets user permissions for specified tenant
   * @param {string} tenantId
   * @param {string} userId
   * @returns {Promise}
   */
  static getTenantUserPermissions(tenantId, userId) {
    return ApiService.call(`/tenants/${tenantId}/users/${userId}/permissions`);
  }

  /**
   * Update roles of user for tenant
   * - roleNames will replace the current roles.
   * @param {string} tenantId
   * @param {string} userId
   * @param {{ roleNames: array<string> }} put - roles to update to. Ex: ['reader']
   * @returns {Promise}
   */
  static putTenantUserRoles(tenantId, userId, put) {
    return ApiService.call(`/tenants/${tenantId}/users/${userId}`, 'PUT', put);
  }
}
