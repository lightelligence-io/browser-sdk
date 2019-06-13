import Role from '../src/modules/role';
import ApiService from '../src/tools/apiService';

jest.mock('../src/tools/apiService', () => ({
  call: jest.fn().mockResolvedValue({}),
}));

describe('Role module', () => {
  test('getPermissions calls ApiService', () =>
    Role.getPermissions().then(() =>
      expect(ApiService.call).toBeCalledWith('/permissions')
    ));

  test('getRoles calls ApiService', () =>
    Role.getRoles().then(() =>
      expect(ApiService.call).toBeCalledWith('/roles?')
    ));

  test('getRoles calls ApiService with correct pagination', () =>
    Role.getRoles({ page: 1, pageSize: 10 }).then(() =>
      expect(ApiService.call).toBeCalledWith('/roles?page=1&pageSize=10')
    ));

  test('getRole calls ApiService', () =>
    Role.getRole('1').then(() =>
      expect(ApiService.call).toBeCalledWith('/roles/1')
    ));

  test('createRole calls ApiService', () =>
    Role.createRole({
      name: 'foo',
      permissions: [{ id: 'bar-id', alias: 'bar-alias' }],
      description: 'baz',
    }).then(() =>
      expect(ApiService.call).toBeCalledWith('/roles', 'POST', {
        name: 'foo',
        permissions: [{ id: 'bar-id', alias: 'bar-alias' }],
        description: 'baz',
      })
    ));

  test('deleteRole calls ApiService', () =>
    Role.deleteRole('bar').then(() =>
      expect(ApiService.call).toBeCalledWith('/roles/bar', 'DELETE')
    ));

  test('patchRole calls ApiService', () =>
    Role.patchRole('bar', {
      name: 'foo',
      permissions: [{ id: 'bar-id', alias: 'bar-alias' }],
      description: 'baz',
    }).then(() =>
      expect(ApiService.call).toBeCalledWith('/roles/bar', 'PATCH', {
        name: 'foo',
        permissions: [{ id: 'bar-id', alias: 'bar-alias' }],
        description: 'baz',
      })
    ));

  test('getRoleUsers calls ApiService', () =>
    Role.getRoleUsers('bar').then(() =>
      expect(ApiService.call).toBeCalledWith('/roles/bar/users?')
    ));

  test('getRoleUsers calls ApiService with correct parameters', () =>
    Role.getRoleUsers('bar', { page: 1, pageSize: 20 }).then(() =>
      expect(ApiService.call).toBeCalledWith(
        '/roles/bar/users?page=1&pageSize=20'
      )
    ));
});
