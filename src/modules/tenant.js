import ApiService from '../tools/apiService';

/**
 * Get all user tenants
 * @param {string} userId
 * @returns {Promise}
 */
function getUserTenants(userId) {
  return ApiService.call(`/users/${userId}/tenants`);
}

export default {
  getUserTenants,
};
