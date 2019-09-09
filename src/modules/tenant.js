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
   * @param {number} [params.page=0] The number of the result page starting with 0
   * @param {number} [params.pageSize=10] The number of result per page. Default is 10
   * @returns {Promise}
   */
  static getTenantUsers(tenantId, params) {
    const urlParams = new URLSearchParams(params);
    return ApiService.call(
      `/tenants/${tenantId}/users?${urlParams.toString()}`
    );
  }

  /**
   * Delete (remove) a user from a tenant
   * @param {string} tenantId
   * @param {string} userId
   * @returns {Promise}
   */
  static deleteTenantUser(tenantId, userId) {
    return ApiService.call(`/tenants/${tenantId}/users/${userId}`, 'DELETE');
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
   * @param {array<string>} invite.roleNames - Deprecated: array of roles for user to be assigned to. Ex. ['admin']
   * @param {array<{ id: string }>} invite.roles - Array of objects containing the role id for user to be assigned to. Ex. [{ id: '123e4567-e89b-12d3-a456-426655440000' }]
   * @returns {Promise}
   */
  static createInvite(tenantId, invite) {
    return ApiService.call(`/tenants/${tenantId}/invites`, 'POST', invite);
  }

  /**
   * Get tenant invites
   * @param {string} tenantId
   * @param {number} [params.page=0] The number of the result page starting with 0
   * @param {number} [params.pageSize=10] The number of result per page. Default is 10
   * @returns {Promise}
   */
  static getInvites(tenantId, params) {
    const urlParams = new URLSearchParams(params);
    return ApiService.call(
      `/tenants/${tenantId}/invites?${urlParams.toString()}`
    );
  }

  /**
   * Delete (revoke) a invite for a user.
   * - Only open invites can be deleted
   * @param {string} tenantId
   * @param {string} inviteId
   * @returns {Promise}
   */
  static deleteInvite(tenantId, inviteId) {
    return ApiService.call(
      `/tenants/${tenantId}/invites/${inviteId}`,
      'DELETE'
    );
  }

  /**
   * Gets roles of tenant
   * @deprecated Use {@link Role.getRoles}
   * @param {string} tenantId
   * @returns {Promise}
   */
  static getTenantRoles(tenantId) {
    return ApiService.call(`/tenants/${tenantId}/roles`);
  }

  /**
   * Gets user permissions for specified tenant
   * @param {string} userId
   * @returns {Promise}
   */
  static getTenantUserPermissions(userId) {
    return ApiService.call(`/users/${userId}/permissions`);
  }

  /**
   * Update roles of user for tenant
   * - roleNames will replace the current roles.
   * @param {string} tenantId
   * @param {string} userId
   * @param {{ roles: array<{ id: string }> }} put - roles to update to
   * @returns {Promise}
   */
  static putTenantUserRoles(tenantId, userId, put) {
    return ApiService.call(
      `/tenants/${tenantId}/users/${userId}/roles`,
      'PUT',
      put
    );
  }

  /**
   * Partially change the data of a specific tenant by its id. The Id itself is not changeable.
   * @param {string} tenantId
   * @param {object} patch changes to tenant
   * @returns {Promise}
   */
  static patchTenant(tenantId, patch) {
    return ApiService.call(`/tenants/${tenantId}`, 'PATCH', patch);
  }
}
