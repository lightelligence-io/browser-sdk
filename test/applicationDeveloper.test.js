import Application from '../src/modules/applicationDeveloper';
import ApiService from '../src/tools/apiService';

jest.mock('../src/tools/apiService', () => ({
  call: jest.fn().mockResolvedValue({}),
}));

describe('ApplicationDeveloper module', () => {
  afterEach(() => {
    ApiService.call.mockClear();
  });
  test('createApplication calls ApiService', () => {
    const applicationData = { name: 'test name' };
    return Application.createApplication(applicationData).then(() =>
      expect(ApiService.call).toBeCalledWith(
        '/application-developer/applications',
        'POST',
        applicationData
      )
    );
  });

  test('getApplications calls ApiService', () =>
    Application.getApplications().then(() =>
      expect(ApiService.call).toBeCalledWith(
        '/application-developer/applications?'
      )
    ));

  test('getApplicationDetails calls ApiService', () => {
    const applicationId = 'fakeId';
    return Application.getApplicationDetails(applicationId).then(() =>
      expect(ApiService.call).toBeCalledWith(
        `/application-developer/applications/${applicationId}`
      )
    );
  });

  test('deleteApplication calls ApiService', () => {
    const applicationId = 'fakeId';
    return Application.deleteApplication(applicationId).then(() =>
      expect(ApiService.call).toBeCalledWith(
        `/application-developer/applications/${applicationId}`,
        'DELETE'
      )
    );
  });

  test('patchApplication calls ApiService', () => {
    const applicationId = 'fakeId';
    const applicationData = { name: 'test name' };
    return Application.patchApplication(applicationId, applicationData).then(
      () =>
        expect(ApiService.call).toBeCalledWith(
          `/application-developer/applications/${applicationId}`,
          'PATCH',
          applicationData
        )
    );
  });
  test('getAllowedTenants calls ApiService, params are optional', () => {
    const applicationId = 'fakeId';
    return Application.getAllowedTenants(applicationId).then(() =>
      expect(ApiService.call).toBeCalledWith(
        `/application-developer/applications/${applicationId}/allowed-tenants?`
      )
    );
  });

  test('getAllowedTenants calls ApiService', () => {
    const applicationId = 'fakeId';
    const params = { page: 1, pageSize: 20 };
    return Application.getAllowedTenants(applicationId, params).then(() =>
      expect(ApiService.call).toBeCalledWith(
        `/application-developer/applications/${applicationId}/allowed-tenants?page=1&pageSize=20`
      )
    );
  });

  test('addAllowedTenant calls ApiService', () => {
    const applicationId = 'fakeId';
    const tenantId = 'fakeTenantId';
    const tenantData = { comment: 'foo' };
    return Application.addAllowedTenant(
      applicationId,
      tenantId,
      tenantData
    ).then(() =>
      expect(ApiService.call).toBeCalledWith(
        `/application-developer/applications/${applicationId}/allowed-tenants/${tenantId}`,
        'PUT',
        tenantData
      )
    );
  });

  test('addAllowedTenant calls ApiService, comment is optional', () => {
    const applicationId = 'fakeId';
    const tenantId = 'fakeTenantId';
    return Application.addAllowedTenant(applicationId, tenantId).then(() =>
      expect(ApiService.call).toBeCalledWith(
        `/application-developer/applications/${applicationId}/allowed-tenants/${tenantId}`,
        'PUT',
        {}
      )
    );
  });

  test('removeAllowedTenant calls ApiService', () => {
    const applicationId = 'fakeId';
    const tenantId = 'fakeTenantId';

    return Application.removeAllowedTenant(applicationId, tenantId).then(() =>
      expect(ApiService.call).toBeCalledWith(
        `/application-developer/applications/${applicationId}/allowed-tenants/${tenantId}`,
        'DELETE'
      )
    );
  });

  test('regenerateApplicationSecret calls ApiService', () => {
    const applicationId = 'fakeId';

    return Application.regenerateApplicationSecret(applicationId).then(() =>
      expect(ApiService.call).toBeCalledWith(
        `/application-developer/applications/${applicationId}/secret`,
        'POST'
      )
    );
  });
});
