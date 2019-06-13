import Consumption from '../src/modules/consumption';
import ApiService from '../src/tools/apiService';

jest.mock('../src/tools/apiService', () => ({
  call: jest.fn().mockResolvedValue({}),
}));

const startTime = '2018-11-01T00:00:00.000Z';
const endTime = '2018-11-01T00:00:00.000Z';

describe('Client module', () => {
  test('getSummary calls ApiService', () => {
    const params = {
      startTime,
      endTime,
    };
    return Consumption.getSummary(params).then(() =>
      expect(ApiService.call).toBeCalledWith(
        `/consumption/summary?startTime=${encodeURIComponent(
          params.startTime
        )}&endTime=${encodeURIComponent(params.endTime)}`
      )
    );
  });

  test('getSummary transforms array of unit into valid query', () => {
    const params = {
      startTime,
      endTime,
      unit: ['devices', 'users'],
    };
    return Consumption.getSummary(params).then(() =>
      expect(ApiService.call).toBeCalledWith(
        `/consumption/summary?startTime=${encodeURIComponent(
          params.startTime
        )}&endTime=${encodeURIComponent(
          params.endTime
        )}&unit=devices&unit=users`
      )
    );
  });
});
