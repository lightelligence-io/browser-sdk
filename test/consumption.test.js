import Consumption from '../src/modules/consumption';
import ApiService from '../src/tools/apiService';

jest.mock('../src/tools/apiService', () => ({
  call: jest.fn().mockResolvedValue({}),
}));

describe('Client module', () => {

  test('getSummary calls ApiService', () => {
    const params = {
      startTime: '2018-11-01T00:00:00.000Z',
      endTime: '2018-12-01T00:00:00.000Z',
    };
    return Consumption.getSummary(params).then(() =>
      expect(ApiService.call).toBeCalledWith(
        '/consumption/summary?startTime=2018-11-01T00%3A00%3A00.000Z&endTime=2018-12-01T00%3A00%3A00.000Z'
      )
    );
  });

  test('getSummary transforms array of unit into valid query', () => {
    const params = {
      startTime: '2018-11-01T00:00:00.000Z',
      endTime: '2018-12-01T00:00:00.000Z',
      unit: ['devices', 'users'],
    };
    return Consumption.getSummary(params).then(() =>
      expect(ApiService.call).toBeCalledWith(
        '/consumption/summary?startTime=2018-11-01T00%3A00%3A00.000Z&endTime=2018-12-01T00%3A00%3A00.000Z&unit=devices&unit=users'
      )
    );
  });
});
