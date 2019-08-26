import Application from '../src/modules/application';
import ApiService from '../src/tools/apiService';

jest.mock('../src/tools/apiService', () => ({
  call: jest.fn().mockResolvedValue({}),
}));

describe('Application module', () => {
  afterEach(() => {
    ApiService.call.mockClear();
  });

  test('getApplications calls ApiService', () => {
    const params = {
      installed: true,
    };
    return Application.getApplications(params).then(() =>
      expect(ApiService.call).toBeCalledWith('/applications?installed=true')
    );
  });

  test('getApplication calls ApiService', () => {
    const applicationId = 'fakeId';
    return Application.getApplication(applicationId).then(() =>
      expect(ApiService.call).toBeCalledWith(`/applications/${applicationId}`)
    );
  });

  test('getPermissions calls ApiService', () => {
    const applicationId = 'fakeId';
    return Application.getPermissions(applicationId).then(() =>
      expect(ApiService.call).toBeCalledWith(
        `/applications/${applicationId}/permissions`
      )
    );
  });

  test('installApplication calls ApiService', () => {
    const applicationId = 'fakeId';
    const data = {
      permissions: {
        client: [{ id: 'permissionId1' }, { id: 'permissionId2' }],
        user: [{ id: 'permissionId2' }, { id: 'permissionId3' }],
      },
    };
    return Application.installApplication(applicationId, data).then(() =>
      expect(ApiService.call).toBeCalledWith(
        `/applications/${applicationId}/installation`,
        'POST',
        data
      )
    );
  });

  test('updateInstallation calls ApiService', () => {
    const applicationId = 'fakeId';
    const data = {
      permissions: {
        client: [{ id: 'permissionId1' }, { id: 'permissionId2' }],
        user: [{ id: 'permissionId2' }, { id: 'permissionId3' }],
      },
    };
    return Application.updateInstallation(applicationId, data).then(() =>
      expect(ApiService.call).toBeCalledWith(
        `/applications/${applicationId}/installation`,
        'PATCH',
        data
      )
    );
  });

  test('getInstallationDetails calls ApiService', () => {
    const applicationId = 'fakeId';
    return Application.getInstallationDetails(applicationId).then(() =>
      expect(ApiService.call).toBeCalledWith(
        `/applications/${applicationId}/installation`
      )
    );
  });

  test('uninstallApplication calls ApiService', () => {
    const applicationId = 'fakeId';
    return Application.uninstallApplication(applicationId).then(() =>
      expect(ApiService.call).toBeCalledWith(
        `/applications/${applicationId}/installation`,
        'DELETE'
      )
    );
  });
});
