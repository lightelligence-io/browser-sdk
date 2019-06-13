import Timeseries from '../src/modules/timeseries';
import ApiService from '../src/tools/apiService';

jest.mock('../src/tools/apiService', () => ({
  call: jest.fn().mockResolvedValue({}),
}));

describe('Timeseries module', () => {
  test('getDeviceLastTimeseries calls ApiService', () =>
    Timeseries.getDeviceLastTimeseries('1').then(() =>
      expect(ApiService.call).toBeCalledWith('/devices/1/last-timeseries?')
    ));

  test('getDeviceLastTimeseries calls ApiService with correct params', () =>
    Timeseries.getDeviceLastTimeseries('1', {
      path: '$.brightness',
    }).then(() =>
      expect(ApiService.call).toBeCalledWith(
        '/devices/1/last-timeseries?path=%24.brightness'
      )
    ));

  test('deleteDeviceTimeseries calls ApiService', () =>
    Timeseries.deleteDeviceTimeseries('1').then(() =>
      expect(ApiService.call).toBeCalledWith('/devices/1/timeseries?', 'DELETE')
    ));

  test('deleteDeviceTimeseries calls ApiService with correct params', () =>
    Timeseries.deleteDeviceTimeseries('1', {
      path: '$.brightness',
    }).then(() =>
      expect(ApiService.call).toBeCalledWith(
        '/devices/1/timeseries?path=%24.brightness',
        'DELETE'
      )
    ));

  test('getDeviceAggregatedTimeseries calls ApiService', () =>
    Timeseries.getDeviceAggregatedTimeseries('1').then(() =>
      expect(ApiService.call).toBeCalledWith(
        '/devices/1/aggregated-timeseries?'
      )
    ));

  test('getDeviceAggregatedTimeseries calls ApiService with correct params', () =>
    Timeseries.getDeviceAggregatedTimeseries('1', {
      path: '$.brightness',
    }).then(() =>
      expect(ApiService.call).toBeCalledWith(
        '/devices/1/aggregated-timeseries?path=%24.brightness'
      )
    ));
});
