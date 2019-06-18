import ApiService from '../tools/apiService';

/**
 * Methods for device type operations
 */
export default class DeviceType {
  /**
   * Creates a new device type
   * @param {object} deviceType
   * @returns {Promise}
   */
  static createDeviceType(deviceType) {
    return ApiService.call('/device-types', 'POST', deviceType);
  }

  /**
   * Get all device types
   * @param {object} params
   * @param {number} [params.page=0] The number of the result page starting with 0
   * @param {number} [params.pageSize=10] The number of result per page. Default is 10
   * @param {string} [params.name=undefined] Filter the results to contain only devices having the provided name. Case-insensitive. Surround with * for substring matching. Example: &subString* OR fullMatchingName
   * @returns {Promise}
   */
  static getDeviceTypes(params) {
    const urlParams = new URLSearchParams(params);
    return ApiService.call(`/device-types?${urlParams.toString()}`);
  }

  /**
   * Get a specific device-type by id
   * @param {string} deviceTypeId
   * @returns {Promise}
   */
  static getDeviceType(deviceTypeId) {
    return ApiService.call(`/device-types/${deviceTypeId}`);
  }

  /**
   * Edit a specific device-type by id partially. Id is not patchable. You can also only patch a single property from your custom data. To delete submit null.
   * @param {string} deviceTypeId
   * @param {object} patch changes to device type
   * @returns {Promise}
   */
  static patchDeviceType(deviceTypeId, patch) {
    return ApiService.call(`/device-types/${deviceTypeId}`, 'PATCH', patch);
  }

  /**
   * Delete a specific device-type by id. Note: you can not delete device type if it's attached to at least one device
   * @param {string} deviceTypeId
   * @returns {Promise}
   */
  static deleteDeviceType(deviceTypeId) {
    return ApiService.call(`/device-types/${deviceTypeId}`, 'DELETE');
  }

  /**
   * Get the online monitoring configuration for a device type
   * @param {string} deviceTypeId
   * @returns {Promise}
   */
  static getOnlineMonitoringRules(deviceTypeId) {
    return ApiService.call(`/device-types/${deviceTypeId}/onlinemonitoring`);
  }

  /**
   * Edit the online monitoring configuration for a device type
   * @param {string} deviceTypeId
   * @param {object} config changes to device
   * @param {number|null} config.communicationInterval The expected communication interval in seconds. Special cases: **null** and **0** mean monitoring is disabled
   * @returns {Promise}
   */
  static patchOnlineMonitoringRules(deviceTypeId, config) {
    return ApiService.call(
      `/device-types/${deviceTypeId}/onlinemonitoring`,
      'PATCH',
      config
    );
  }
}
