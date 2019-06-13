import ApiService from '../tools/apiService';

/**
 * Methods for application operations for the owner (developer)
 */
export default class ApplicationDeveloper {
  /**
   * Creates an application.
   * Include the tenant to the allowedTenants to enable the access for the usage. Ownership of the application does not imply ability to use the application.
   * @param {object} application The application data
   * @param {string} application.name The name of the application
   * @param {string} [application.teaserDescription] A short description for the application
   * @param {string} [application.url] A URL with more information on the app. E.g. the app homepage. Protocol is required
   * @param {boolean} [application.withPublicOauth2Client] Indicator of whether the application should also be accessible as a public OAuth2 client
   * @param {Array<string>} [application.redirectUris] List of redirect URIs
   * @param {Array<{tenantId:string, comment?:string}>} [application.allowedTenants] List of allowed tenants
   * @returns {Promise}
   */
  static createApplication(application) {
    return ApiService.call(
      '/application-developer/applications',
      'POST',
      application
    );
  }

  /**
   * Get all applications, which are owned (developed) by the tenant.
   * Tenant is implied by the session
   * @param {object} params Search parameters
   * @param {number} [params.page=0] The number of the result page starting with 0
   * @param {number} [params.pageSize=10] The number of result per page. Default is 10
   * @returns {Promise}
   */
  static getApplications(params) {
    const urlParams = new URLSearchParams(params);
    return ApiService.call(
      `/application-developer/applications?${urlParams.toString()}`
    );
  }

  /**
   * Get details of a specific owned (developed) application
   * @param {string} applicationId The application ID
   * @returns {Promise}
   */
  static getApplicationDetails(applicationId) {
    return ApiService.call(
      `/application-developer/applications/${applicationId}`
    );
  }

  /**
   * Delete an owned (developed) application
   * @param {string} applicationId The application ID
   * @returns {Promise}
   */
  static deleteApplication(applicationId) {
    return ApiService.call(
      `/application-developer/applications/${applicationId}`,
      'DELETE'
    );
  }

  /**
   * Update an owned (developed) application
   * @param {string} applicationId The application ID
   * @param {object} application The applications data
   * @param {string} [application.name] The name of the application
   * @param {string} [application.teaserDescription] A short description for the application
   * @param {string} [application.url] A URL with more information on the app. E.g. the app homepage. Protocol is required
   * @param {boolean} [application.withPublicOauth2Client] Indicator of whether the application should also be accessible as a public OAuth2 client
   * @param {string} [application.status] Enum: 'active'. 'inactive'. Status of the application. An inactive application cannot be installed, nor can the tenant data be accessed
   * @param {Array<string>} [application.redirectUris] List of redirect URIs
   * @returns {Promise}
   */
  static patchApplication(applicationId, application) {
    return ApiService.call(
      `/application-developer/applications/${applicationId}`,
      'PATCH',
      application
    );
  }

  /**
   * Get the list of the tenants who can install the application
   * @param {string} applicationId The application ID
   * @param {object} params Search parameters
   * @param {number} [params.page=0] The number of the result page starting with 0
   * @param {number} [params.pageSize=10] The number of result per page. Default is 10
   * @returns {Promise}
   */
  static getAllowedTenants(applicationId, params = {}) {
    const urlParams = new URLSearchParams(params);
    return ApiService.call(
      `/application-developer/applications/${applicationId}/allowed-tenants?${urlParams.toString()}`
    );
  }

  /**
   * Add a tenant to the list of those who can install the application
   * @param {string} applicationId The application ID
   * @param {string} tenantId The tenant ID
   * @param {object} [data]
   * @param {string} [data.comment] A comment about the allowed tenant
   * @returns {Promise}
   */
  static addAllowedTenant(applicationId, tenantId, data = {}) {
    return ApiService.call(
      `/application-developer/applications/${applicationId}/allowed-tenants/${tenantId}`,
      'PUT',
      data
    );
  }

  /**
   * Deletes the tenant from the list of the allowed tenants
   * @param {string} applicationId The application ID
   * @param {string} tenantId The tenant ID
   * @returns {Promise}
   */
  static removeAllowedTenant(applicationId, tenantId) {
    return ApiService.call(
      `/application-developer/applications/${applicationId}/allowed-tenants/${tenantId}`,
      'DELETE'
    );
  }

  /**
   * Regenerates an application secret for an owned (developed) application
   * @param {string} applicationId The application ID
   * @returns {Promise}
   */
  static regenerateApplicationSecret(applicationId) {
    return ApiService.call(
      `/application-developer/applications/${applicationId}/secret`,
      'POST'
    );
  }
}
