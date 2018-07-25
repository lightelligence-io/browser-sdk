import ApiService from '../tools/apiService';

/**
 * Methods for certificate operations
 */
export default class Certificates {
  /**
   * Get the certificates assigned to this device
   * @param {string} deviceId
   * @returns {Promise}
   */
  static getDeviceCertificates(deviceId) {
    return ApiService.call(`/devices/${deviceId}/certificates`);
  }

  /**
   * Assign a certificate to a device. A certificate can only be assigned to exactly one device.
   * @param {string} deviceId
   * @param {object} certificate
   * @returns {Promise}
   */
  static assignCertificates(deviceId, certificate) {
    return ApiService.call(`/devices/${deviceId}/certificates`, 'POST', certificate);
  }

  /**
   * Get specific certificate object
   * @param {string} deviceId
   * @param {string} certificateId
   * @returns {Promise}
   */
  static getDeviceCertificate(deviceId, certificateId) {
    return ApiService.call(`/devices/${deviceId}/certificates/${certificateId}`);
  }

  /**
   * Patch specific certificate object
   * @param {string} deviceId
   * @param {string} certificateId
   * @param {object} patch
   * @returns {Promise}
   */
  static patchDeviceCertificate(deviceId, certificateId, patch) {
    return ApiService.call(`/devices/${deviceId}/certificates/${certificateId}`, 'PATCH', patch);
  }
}
