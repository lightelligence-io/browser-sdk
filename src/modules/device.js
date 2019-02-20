import ApiService from '../tools/apiService';

/**
 * Methods for device operations
 */
export default class Device {
  /**
   * Creates a new device
   * @param {object} device
   * @returns {Promise}
   */
  static createDevice(device) {
    return ApiService.call('/devices', 'POST', device);
  }

  /**
   * Get all devices
   * @param {object} params
   * @param {number} [params.page=0] The number of the result page starting with 0
   * @param {number} [params.pageSize=10] The number of result per page. Default is 10
   * @param {string} [params.tags=undefined] Filter the results to contain only devices having all the comma-separated list of tags provided here. Case-insensitive. Surround the tag with * for substring matching. Example: subString-of-a-tag,fullMatching-Tag
   * @param {string} [params.name=undefined] Filter the results to contain only devices having the provided name. Case-insensitive. Surround with * for substring matching. Example: &subString* OR fullMatchingName
   * @param {string} [params.deviceTypeId=undefined] Filter returning devices matching a single device type UUID.
   * @param {string} [params.connectedBy=undefined] Filter the results to contain only devices connected by a given device UUID.
   * @returns {Promise}
   */
  static getDevices(params) {
    const urlParams = new URLSearchParams(params);
    return ApiService.call(`/devices?${urlParams.toString()}`);
  }

  /**
   * Get all device tags
   * @returns {Promise}
   */
  static getDeviceTags() {
    return ApiService.call('/devices/tags');
  }

  /**
   * Get a device by its deviceId.
   * @param {string} deviceId
   * @returns {Promise}
   */
  static getDevice(deviceId) {
    return ApiService.call(`/devices/${deviceId}`);
  }

  /**
   * Edit a specific device by id partially. Id is not patchable. You can also only patch a single property from your custom data. To delete submit null.
   * @param {string} deviceId
   * @param {object} patch changes to device
   * @returns {Promise}
   */
  static patchDevice(deviceId, patch) {
    return ApiService.call(`/devices/${deviceId}`, 'PATCH', patch);
  }

  /**
   * Delete a specific device by id.
   * @param {string} deviceId
   * @returns {Promise}
   */
  static deleteDevice(deviceId) {
    return ApiService.call(`/devices/${deviceId}`, 'DELETE');
  }

  /**
   * Trigger device action
   * @param {string} deviceId
   * @returns {Promise}
   */
  static createAction(deviceId, action) {
    return ApiService.call(`/devices/${deviceId}/actions`, 'POST', action);
  }

  /**
   * The current state of a a device are the attributes and configurations the device has last sent to the cloud. Newer values for the same attribute and configuration overwrite older on.
   * @param {string} deviceId
   * @returns {Promise}
   */
  static getState(deviceId) {
    return ApiService.call(`/devices/${deviceId}/state`);
  }

  /**
   * List device diagnostic messages sorted descending by time for a specific device for the last hour to simplify debugging.
   * @param {string} deviceId
   * @returns {Promise}
   */
  static getLastDiagnostics(deviceId) {
      return ApiService.call(`/devices/${deviceId}/last-diagnostics`);
  }

  /**
   * Push data to device
   * @param {string} deviceId
   * @param {object} data
   * @returns {Promise}
   */
  static pushData(deviceId, data) {
    const post = { ...data, deviceId };
    return ApiService.call('/data-ingest', 'POST', post);
  }
}
