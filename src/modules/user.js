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
   * @returns {Promise}
   */
  static getUserInvites(userId) {
    return ApiService.call(`/users/${userId}/invites`);
  }

  /**
   * Accept a user invite
   * @param {string} userId
   * @param {string} inviteId
   * @returns {Promise}
   */
  static acceptUserInvite(userId, inviteId) {
    return ApiService.call(`/users/${userId}/invites/${inviteId}`, 'PATCH', { status: 'accepted' });
  }

  /**
   * Decline a user invite
   * @param {string} userId
   * @param {string} inviteId
   * @returns {Promise}
   */
  static declineUserInvite(userId, inviteId) {
    return ApiService.call(`/users/${userId}/invites/${inviteId}`, 'PATCH', { status: 'declined' });
  }
}