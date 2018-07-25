import DeviceType from '../src/modules/deviceType';
import ApiService from '../src/tools/apiService';

jest.mock('../src/tools/apiService', () => ({
  call: jest.fn().mockResolvedValue({}),
}));

describe('DeviceType module', () => {
  test('getDeviceType calls ApiService', () =>
    DeviceType.getDeviceType('1').then(() =>
      expect(ApiService.call).toBeCalledWith('/device-types/1'),
    ));

  test('createDeviceType calls ApiService', () =>
    DeviceType.createDeviceType({ name: 'abc' }).then(() =>
      expect(ApiService.call).toBeCalledWith('/device-types', 'POST', { name: 'abc' }),
    ));

  test('getDeviceTypes calls ApiService', () =>
    DeviceType.getDeviceTypes().then(() =>
      expect(ApiService.call).toBeCalledWith('/device-types?'),
    ));

  test('getDeviceTypes calls ApiService with correct paging params', () =>
    DeviceType.getDeviceTypes({
      page: 2,
      pageSize: 20,
    }).then(() => expect(ApiService.call).toBeCalledWith('/device-types?page=2&pageSize=20')));

  test('getDeviceTypes calls ApiService with correct name params', () =>
    DeviceType.getDeviceTypes({
      page: 2,
      pageSize: 20,
      name: '*device',
    }).then(() =>
      expect(ApiService.call).toBeCalledWith('/device-types?page=2&pageSize=20&name=*device'),
    ));

  test('pathDeviceType calls ApiService', () =>
    DeviceType.patchDeviceType('1', { name: 'abc' }).then(() =>
      expect(ApiService.call).toBeCalledWith('/device-types/1', 'PATCH', { name: 'abc' }),
    ));

  test('deleteDeviceType calls ApiService', () =>
    DeviceType.deleteDeviceType('1').then(() =>
      expect(ApiService.call).toBeCalledWith('/device-types/1', 'DELETE'),
    ));
});
