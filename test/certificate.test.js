import Certificate from '../src/modules/certificate';
import ApiService from '../src/tools/apiService';

jest.mock('../src/tools/apiService', () => ({
  call: jest.fn().mockResolvedValue({}),
}));

describe('Certificate module', () => {
  test('getDeviceCertificates calls ApiService', () =>
    Certificate.getDeviceCertificates('1').then(() =>
      expect(ApiService.call).toBeCalledWith('/devices/1/certificates'),
    ));

  test('assignCertificates calls ApiService', () =>
    Certificate.assignCertificates('1', { name: 'abc' }).then(() =>
      expect(ApiService.call).toBeCalledWith('/devices/1/certificates', 'POST', { name: 'abc' }),
    ));

  test('getDeviceCertificate calls ApiService', () =>
    Certificate.getDeviceCertificate('1', '2').then(() =>
      expect(ApiService.call).toBeCalledWith('/devices/1/certificates/2'),
    ));

  test('patchDeviceCertificate calls ApiService', () =>
    Certificate.patchDeviceCertificate('1', '2', { name: 'abc' }).then(() =>
      expect(ApiService.call).toBeCalledWith('/devices/1/certificates/2', 'PATCH', { name: 'abc' }),
    ));
});
