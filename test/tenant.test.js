import Tenant from '../src/modules/tenant';
import ApiService from '../src/tools/apiService';

jest.mock('../src/tools/apiService', () => ({
  call: jest.fn().mockResolvedValue({}),
}));

describe('Tenant module', () => {
  test('getUserTenants calls ApiService', () =>
    Tenant.getUserTenants('1').then(() =>
      expect(ApiService.call).toBeCalledWith('/users/1/tenants?')
    ));

  test('getUserTenants calls ApiService with correct paging params', () =>
    Tenant.getUserTenants('1', {
      page: 2,
      pageSize: 20,
    }).then(() =>
      expect(ApiService.call).toBeCalledWith(
        '/users/1/tenants?page=2&pageSize=20'
      )
    ));

  test('createTenant calls ApiService', () =>
    Tenant.createTenant({ name: 'abc' }).then(() =>
      expect(ApiService.call).toBeCalledWith('/tenants', 'POST', {
        name: 'abc',
      })
    ));

  test('getTenant calls ApiService', () =>
    Tenant.getTenant('1').then(() =>
      expect(ApiService.call).toBeCalledWith('/tenants/1')
    ));

  test('getTenantUsers calls ApiService', () =>
    Tenant.getTenantUsers('1').then(() =>
      expect(ApiService.call).toBeCalledWith('/tenants/1/users?')
    ));

  test('getTenantUsers calls ApiService with correct paging params', () =>
    Tenant.getTenantUsers('1', {
      page: 2,
      pageSize: 20,
    }).then(() =>
      expect(ApiService.call).toBeCalledWith(
        '/tenants/1/users?page=2&pageSize=20'
      )
    ));

  test('deleteTenant calls ApiService', () =>
    Tenant.deleteTenant('1').then(() =>
      expect(ApiService.call).toBeCalledWith('/tenants/1', 'DELETE')
    ));

  test('deleteTenantUser calls ApiService', () =>
    Tenant.deleteTenantUser('1', '2').then(() =>
      expect(ApiService.call).toBeCalledWith('/tenants/1/users/2', 'DELETE')
    ));

  test('createInvite calls ApiService', () =>
    Tenant.createInvite('1', {
      receiverEmail: 'a@b.se',
      roleNames: ['admin'],
    }).then(() =>
      expect(ApiService.call).toBeCalledWith('/tenants/1/invites', 'POST', {
        receiverEmail: 'a@b.se',
        roleNames: ['admin'],
      })
    ));

  test('getInvites calls ApiService', () =>
    Tenant.getInvites('1').then(() =>
      expect(ApiService.call).toBeCalledWith('/tenants/1/invites?')
    ));

  test('getInvites calls ApiService with correct paging params', () =>
    Tenant.getInvites('1', {
      page: 2,
      pageSize: 20,
    }).then(() =>
      expect(ApiService.call).toBeCalledWith(
        '/tenants/1/invites?page=2&pageSize=20'
      )
    ));

  test('deleteInvite calls ApiService', () =>
    Tenant.deleteInvite('1', '2').then(() =>
      expect(ApiService.call).toBeCalledWith('/tenants/1/invites/2', 'DELETE')
    ));

  test('getTenantRoles calls ApiService', () =>
    Tenant.getTenantRoles('1').then(() =>
      expect(ApiService.call).toBeCalledWith('/tenants/1/roles')
    ));

  test('getTenantUserPermissions calls ApiService', () =>
    Tenant.getTenantUserPermissions('1', '2').then(() =>
      expect(ApiService.call).toBeCalledWith('/tenants/1/users/2/permissions')
    ));

  test('putTenantUserRoles calls ApiService', () =>
    Tenant.putTenantUserRoles('1', '2', {
      roles: [{ id: '123e4567-e89b-12d3-a456-426655440000' }],
    }).then(() =>
      expect(ApiService.call).toBeCalledWith(
        '/tenants/1/users/2/roles',
        'PUT',
        { roles: [{ id: '123e4567-e89b-12d3-a456-426655440000' }] }
      )
    ));
});
