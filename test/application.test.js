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

  test('installApplication calls ApiService', () => {
    const applicationId = 'fakeId';
    return Application.installApplication(applicationId).then(() =>
      expect(ApiService.call).toBeCalledWith(
        `/applications/${applicationId}/installation`,
        'PUT'
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
