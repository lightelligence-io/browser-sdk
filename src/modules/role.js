import ApiService from '../tools/apiService';

/**
 * Methods for roles operations
 */
export default class Role {

  /**
   * Get the roles of the tenant
   *
   * @param {object} [params] Search parameters
   * @param {number} [params.page=0] The number of the page starting with 0
   * @param {number} [params.pageSize=10] The number of result per page
   * @returns {Promise}
   */
  static getRoles(params = {}) {
    const urlParams = new URLSearchParams(params);
    return ApiService.call(`/roles?${urlParams.toString()}`);
  }

  /**
   * Get the role of the tenant
   *
   * @param {string} roleId  The role's UUID
   * @returns {Promise}
   */
  static getRole(roleId) {
    return ApiService.call(`/roles/${roleId}`);
  }

  /**
   * Create the role of the tenant
   *
   * @param {object} role  The role data
   * @param {string} role.name The name of the role
   * @param {string} [role.description] The description of the role
   * @param {Array<string>} [role.permissions] The permissions of the role
   * @returns {Promise}
   */
  static createRole(role) {
    return ApiService.call(`/roles`, 'POST', role);
  }

  /**
   * Delete the role of the tenant
   *
   * @param {string} roleId  The role's UUID
   * @returns {Promise}
   */
  static deleteRole(roleId) {
    return ApiService.call(`/roles/${roleId}`, 'DELETE');
  }

  /**
   * Patch the role of the tenant
   *
   * @param {string} roleId  The role's UUID
   * @param {object} role  The role data
   * @param {string} [role.name] The name of the role
   * @param {string} [role.description] The description of the role
   * @param {Array<string>} [role.permissions] The permissions of the role
   * @returns {Promise}
   */
  static patchRole(roleId, role) {
    return ApiService.call(`/roles/${roleId}`, 'PATCH', role);
  }

  /**
   * Get the users of the role
   *
   * @param {string} roleId The role's UUID
   * @param {object} [params] Search parameters
   * @param {number} [params.page=0] The number of the page starting with 0
   * @param {number} [params.pageSize=10] The number of result per page
   * @returns {Promise}
   */
  static getRoleUsers(roleId, params = {}) {
    const urlParams = new URLSearchParams(params);
    return ApiService.call(`/roles/${roleId}/users?${urlParams.toString()}`);
  }

  /**
   * Get the permissions of the role
   *
   * @param {string} roleId The role's UUID
   * @param {object} [params] Search parameters
   * @param {number} [params.page=0] The number of the page starting with 0
   * @param {number} [params.pageSize=10] The number of result per page
   * @returns {Promise}
   */
  static getRolePermissions(roleId, params = {}) {
    const urlParams = new URLSearchParams(params);
    return ApiService.call(
      `/roles/${roleId}/permissions?${urlParams.toString()}`,
    );
  }

}
