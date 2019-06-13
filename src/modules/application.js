import ApiService from '../tools/apiService';

/**
 * Methods for application operations
 */
export default class Application {
  /**
   * Get all applications available for the tenant.
   * @param {object} params Search parameters
   * @param {boolean} [params.installed] Filter for only installed applications
   * @param {number} [params.page=0] The number of the result page starting with 0
   * @param {number} [params.pageSize=10] The number of results per page. Default is 10
   * @returns {Promise}
   */
  static getApplications(params) {
    const urlParams = new URLSearchParams(params);
    return ApiService.call(`/applications?${urlParams.toString()}`);
  }

  /**
   * Get detailed information for the available or installed application
   * @param {string} applicationId The application ID
   * @returns {Promise}
   */
  static getApplication(applicationId) {
    return ApiService.call(`/applications/${applicationId}`);
  }

  /**
   * Install an available application
   * @param {string} applicationId The application ID
   * @returns {Promise}
   */
  static installApplication(applicationId) {
    return ApiService.call(
      `/applications/${applicationId}/installation`,
      'PUT'
    );
  }

  /**
   * Uninstall an installed application
   * @param {string} applicationId The application ID
   * @returns {Promise}
   */
  static uninstallApplication(applicationId) {
    return ApiService.call(
      `/applications/${applicationId}/installation`,
      'DELETE'
    );
  }
}
