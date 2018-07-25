import Tenant from '../src/modules/tenant';
import ApiService from '../src/tools/apiService';

jest.mock('../src/tools/apiService', () => ({
  call: jest.fn().mockResolvedValue({}),
}));

describe('Tenant module', () => {
  test('getUserTenants calls ApiService', () =>
    Tenant.getUserTenants('1').then(() =>
      expect(ApiService.call).toBeCalledWith('/users/1/tenants?'),
    ));

  test('getUserTenants calls ApiService with correct paging params', () =>
    Tenant.getUserTenants('1', {
      page: 2,
      pageSize: 20,
    }).then(() => expect(ApiService.call).toBeCalledWith('/users/1/tenants?page=2&pageSize=20')));

  test('createTenant calls ApiService', () =>
    Tenant.createTenant({ name: 'abc' }).then(() =>
      expect(ApiService.call).toBeCalledWith('/tenants', 'POST', { name: 'abc' }),
    ));

  test('getTenant calls ApiService', () =>
    Tenant.getTenant('1').then(() => expect(ApiService.call).toBeCalledWith('/tenants/1')));

  test('getTenantUsers calls ApiService', () =>
    Tenant.getTenantUsers('1').then(() =>
      expect(ApiService.call).toBeCalledWith('/tenants/1/users'),
    ));

  test('deleteTenant calls ApiService', () =>
    Tenant.deleteTenant('1').then(() =>
      expect(ApiService.call).toBeCalledWith('/tenants/1', 'DELETE'),
    ));
});
