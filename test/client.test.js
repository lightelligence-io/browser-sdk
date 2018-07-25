import Client from '../src/modules/client';
import ApiService from '../src/tools/apiService';

jest.mock('../src/tools/apiService', () => ({
  call: jest.fn().mockResolvedValue({}),
}));

describe('Client module', () => {
  test('getClient calls ApiService', () =>
    Client.getClient('1').then(() => expect(ApiService.call).toBeCalledWith('/clients/1')));

  test('createClient calls ApiService', () =>
    Client.createClient({ name: 'abc' }).then(() =>
      expect(ApiService.call).toBeCalledWith('/clients', 'POST', { name: 'abc' }),
    ));

  test('deleteClient calls ApiService', () =>
    Client.deleteClient('1').then(() =>
      expect(ApiService.call).toBeCalledWith('/clients/1', 'DELETE'),
    ));
});
