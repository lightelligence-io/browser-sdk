import Device from '../src/modules/device';
import ApiService from '../src/tools/apiService';

jest.mock('../src/tools/apiService', () => ({
  call: jest.fn().mockResolvedValue({}),
}));

describe('Device module', () => {
  test('getDevice calls ApiService', () =>
    Device.getDevice('1').then(() => expect(ApiService.call).toBeCalledWith('/devices/1')));

  test('createDevice calls ApiService', () =>
    Device.createDevice({ name: 'abc' }).then(() =>
      expect(ApiService.call).toBeCalledWith('/devices', 'POST', { name: 'abc' }),
    ));

  test('getDevices calls ApiService', () =>
    Device.getDevices().then(() => expect(ApiService.call).toBeCalledWith('/devices?')));

  test('getDevices calls ApiService with correct paging params', () =>
    Device.getDevices({
      page: 2,
      pageSize: 20,
    }).then(() => expect(ApiService.call).toBeCalledWith('/devices?page=2&pageSize=20')));

  test('getDevices calls ApiService with correct name params', () =>
    Device.getDevices({
      page: 2,
      pageSize: 20,
      name: '*device',
    }).then(() =>
      expect(ApiService.call).toBeCalledWith('/devices?page=2&pageSize=20&name=*device'),
    ));

  test('getDeviceTags calls ApiService', () =>
    Device.getDeviceTags().then(() => expect(ApiService.call).toBeCalledWith('/devices/tags')));

  test('pathDevice calls ApiService', () =>
    Device.patchDevice('1', { name: 'abc' }).then(() =>
      expect(ApiService.call).toBeCalledWith('/devices/1', 'PATCH', { name: 'abc' }),
    ));

  test('deleteDevice calls ApiService', () =>
    Device.deleteDevice('1').then(() =>
      expect(ApiService.call).toBeCalledWith('/devices/1', 'DELETE'),
    ));

  test('createAction calls ApiService', () =>
    Device.createAction('1', { name: 'abc' }).then(() =>
      expect(ApiService.call).toBeCalledWith('/devices/1/actions', 'POST', { name: 'abc' }),
    ));

  test('getState calls ApiService', () =>
    Device.getState('1').then(() => expect(ApiService.call).toBeCalledWith('/devices/1/state')));

  test('pushData calls ApiService', () =>
    Device.pushData('1', { name: 'abc' }).then(() =>
      expect(ApiService.call).toBeCalledWith('/data-ingest', 'POST', {
        name: 'abc',
        deviceId: '1',
      }),
    ));
});
