import ApiService from '../tools/apiService';

/**
 * Methods for user operations
 */
export default class User {
  /**
   * Gets user information
   * @param {string} userId
   * @returns {Promise}
   */
  static getUser(userId) {
    return ApiService.call(`/users/${userId}`);
  }

  /**
   * Gets user invites
   * @param {string} userId
   * @param {object} params search params
   * @param {number} [params.page=0] The number of the result page starting with 0
   * @param {number} [params.pageSize=10] The number of result per page
   * @returns {Promise}
   */
  static getUserInvites(userId, params) {
    const urlParams = new URLSearchParams(params);
    return ApiService.call(`/users/${userId}/invites?${urlParams.toString()}`);
  }

  /**
   * Accept a user invite
   * @param {string} userId
   * @param {string} inviteId
   * @returns {Promise}
   */
  static acceptUserInvite(userId, inviteId) {
    return ApiService.call(`/users/${userId}/invites/${inviteId}`, 'PATCH', {
      status: 'accepted',
    });
  }

  /**
   * Decline a user invite
   * @param {string} userId
   * @param {string} inviteId
   * @returns {Promise}
   */
  static declineUserInvite(userId, inviteId) {
    return ApiService.call(`/users/${userId}/invites/${inviteId}`, 'PATCH', {
      status: 'declined',
    });
  }

  /**
   * Get a user's permissions within the current tenant
   * @param {string} userId
   * @returns {Promise}
   */
  static getUserPermissions(userId) {
    return ApiService.call(`/users/${userId}/permissions`);
  }
}
