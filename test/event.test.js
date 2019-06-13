import Event from '../src/modules/event';
import ApiService from '../src/tools/apiService';

jest.mock('../src/tools/apiService', () => ({
  call: jest.fn().mockResolvedValue({}),
}));

describe('Event module', () => {
  test('getEvents calls ApiService', () =>
    Event.getEvents('1').then(() =>
      expect(ApiService.call).toBeCalledWith('/devices/1/events?')
    ));

  test('getEvents calls ApiService with correct params', () =>
    Event.getEvents('1', {
      eventTypes: 'a,b,c',
    }).then(() =>
      expect(ApiService.call).toBeCalledWith(
        '/devices/1/events?eventTypes=a%2Cb%2Cc'
      )
    ));

  test('createEvent calls ApiService', () =>
    Event.createEvent('1', { name: 'abc' }).then(() =>
      expect(ApiService.call).toBeCalledWith('/event-ingest', 'POST', {
        name: 'abc',
        deviceId: '1',
      })
    ));
});
