import ApiService from '../tools/apiService';

/**
 * Get all user devices
 * @returns {Promise}
 */
function getDevices() {
  return ApiService.call('/devices');
}

export default {
  getDevices,
};
