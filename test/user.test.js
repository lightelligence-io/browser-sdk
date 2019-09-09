import User from '../src/modules/user';
import ApiService from '../src/tools/apiService';

jest.mock('../src/tools/apiService', () => ({
  call: jest.fn().mockResolvedValue({}),
}));

describe('Tenant module', () => {
  test('getUser calls ApiService', () =>
    User.getUser('1').then(() =>
      expect(ApiService.call).toBeCalledWith('/users/1')
    ));

  test('getUserInvites calls ApiService', () =>
    User.getUserInvites('1').then(() =>
      expect(ApiService.call).toBeCalledWith('/users/1/invites?')
    ));

  test('getUserInvites calls ApiService with correct paging params', () =>
    User.getUserInvites('1', {
      page: 2,
      pageSize: 20,
    }).then(() =>
      expect(ApiService.call).toBeCalledWith(
        '/users/1/invites?page=2&pageSize=20'
      )
    ));

  test('acceptUserInvite calls ApiService', () =>
    User.acceptUserInvite('1', '2').then(() =>
      expect(ApiService.call).toBeCalledWith('/users/1/invites/2', 'PATCH', {
        status: 'accepted',
      })
    ));

  test('declineUserInvite calls ApiService', () =>
    User.declineUserInvite('1', '2').then(() =>
      expect(ApiService.call).toBeCalledWith('/users/1/invites/2', 'PATCH', {
        status: 'declined',
      })
    ));

  test('getUserPermissions calls ApiService', () =>
    User.getUserPermissions('1').then(() =>
      expect(ApiService.call).toBeCalledWith('/users/1/permissions')
    ));
});
