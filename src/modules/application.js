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
   * Get permissions required by an application
   * @param {string} applicationId The application ID
   * @returns {Promise}
   */
  static getPermissions(applicationId) {
    return ApiService.call(`/applications/${applicationId}/permissions`);
  }

  /**
   * Install an available application
   * @param {string} applicationId The application ID
   * @param {object} data Application data
   * @param {object} [data.permissions] Application permissions
   * @param {{ id: string }[]} [data.permissions.client] Application client permissions
   * @param {{ id: string }[]} [data.permissions.user] Application client permissions
   * @returns {Promise}
   */
  static installApplication(applicationId, data = {}) {
    return ApiService.call(
      `/applications/${applicationId}/installation`,
      'POST',
      data
    );
  }

  /**
   * Updates and re-consents an installation
   * @param {string} applicationId The application ID
   * @param {object} data Application data
   * @param {object} [data.permissions] Application permissions
   * @param {{ id: string }[]} [data.permissions.client] Application client permissions
   * @param {{ id: string }[]} [data.permissions.user] Application client permissions
   * @returns {Promise}
   */
  static updateInstallation(applicationId, data) {
    return ApiService.call(
      `/applications/${applicationId}/installation`,
      'PATCH',
      data
    );
  }

  /**
   * Get detailed information for an application installation
   * @param {string} applicationId The application ID
   * @returns {Promise}
   */
  static getInstallationDetails(applicationId) {
    return ApiService.call(`/applications/${applicationId}/installation`);
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
