import * as OIDC from 'oidc-client';
import XHRMock from 'xhr-mock';
import BrowserSDK from '../src/index';
import fixtureOpenIDConfiguration from './fixtures/openid-configuration';

const mockUser = (tenant, data) =>
  new OIDC.User({
    id_token: `${tenant}_id_token`,
    session_state: `${tenant}_session_state`,
    token_type: `${tenant}_token_type`,
    scope: `${tenant}_scope`,
    state: `${tenant}_state`,
    access_token: `${tenant}_access_token`,
    refresh_token: `${tenant}_refresh_token`,
    expires_at: Math.floor(Date.now() / 1000) + 60 * 60,
    profile: { tenant },
    ...data,
  });

describe('user manager', () => {
  beforeEach(() => {
    XHRMock.setup();
    XHRMock.get(
      'https://id.dev.olt-dev.io/v1/id/auth/realms/olt/.well-known/openid-configuration',
      (req, res) =>
        res
          .status(200)
          .body(JSON.stringify(fixtureOpenIDConfiguration))
          .header('Content-Type', 'application/json')
    );
  });

  it('should not allow change tenant without refresh token', () => {
    const sdk = new BrowserSDK({ environment: 'dev', clientId: 'foo-client' });

    sdk.manager.getUser = jest
      .fn()
      .mockResolvedValue(mockUser('foo', { refresh_token: null }));

    return sdk.changeTenant('bar').catch(error => {
      expect(error.message).toEqual('changeTenant: No refresh token');
    });
  });

  it('should not allow change tenant without user profile loaded', () => {
    const sdk = new BrowserSDK({ environment: 'dev', clientId: 'foo-client' });

    sdk.manager.getUser = jest
      .fn()
      .mockResolvedValue(mockUser('foo', { profile: null }));

    return sdk.changeTenant('bar').catch(error => {
      expect(error.message).toEqual(
        'changeTenant: No profile loaded for the user'
      );
    });
  });

  it('should call tokenClient.exchangeRefreshToken', () => {
    const sdk = new BrowserSDK({ environment: 'dev', clientId: 'foo-client' });
    const tokenClient = sdk.manager._tokenClient; // eslint-disable-line

    sdk.manager.getUser = jest.fn().mockResolvedValue(mockUser('foo'));

    tokenClient.exchangeRefreshToken = jest.fn().mockResolvedValue({
      access_token: 'bar_access_token',
      refresh_token: 'bar_refresh_token',
      expires_in: Math.floor(Date.now() / 1000) + 60 * 120, // two hours
    });

    return sdk.changeTenant('bar').then(() => {
      expect(tokenClient.exchangeRefreshToken.mock.calls[0][0]).toEqual({
        refresh_token: 'foo_refresh_token',
        headers: { 'X-Requested-With': 'bar' },
      });
    });
  });

  it('should throw error if response was not right', () => {
    const sdk = new BrowserSDK({ environment: 'dev', clientId: 'foo-client' });
    const tokenClient = sdk.manager._tokenClient; // eslint-disable-line

    sdk.manager.getUser = jest.fn().mockResolvedValue(mockUser('foo'));

    tokenClient.exchangeRefreshToken = jest.fn().mockResolvedValue({
      refresh_token: 'bar_refresh_token',
      expires_in: Math.floor(Date.now() / 1000) + 60 * 120, // two hours
    });

    return sdk.changeTenant('bar').catch(error => {
      expect(error.message).toEqual(
        'changeTenant: Error while changing tenant'
      );
    });
  });

  it('should call jsonService.postForm', () => {
    const sdk = new BrowserSDK({ environment: 'dev', clientId: 'foo-client' });
    const tokenClient = sdk.manager._tokenClient; // eslint-disable-line
    const jsonService = tokenClient._jsonService; // eslint-disable-line

    sdk.manager.getUser = jest.fn().mockResolvedValue(mockUser('foo'));

    jsonService.postForm = jest.fn().mockResolvedValue({
      access_token: 'bar_access_token',
      refresh_token: 'bar_refresh_token',
      expires_in: Math.floor(Date.now() / 1000) + 60 * 120, // two hours
    });

    return sdk.changeTenant('bar').then(() => {
      expect(jsonService.postForm.mock.calls[0][1]).toEqual({
        client_id: 'foo-client',
        grant_type: 'refresh_token',
        refresh_token: 'foo_refresh_token',
        headers: {
          'X-Requested-With': 'bar',
        },
      });
    });
  });

  it('should ignore headers in jsonService.postForm', () => {
    const sdk = new BrowserSDK({ environment: 'dev', clientId: 'foo-client' });
    const tokenClient = sdk.manager._tokenClient; // eslint-disable-line
    const jsonService = tokenClient._jsonService; // eslint-disable-line

    XHRMock.post(/foo/, (req, res) => {
      expect(req.header('Content-Type')).toEqual(
        'application/x-www-form-urlencoded'
      );
      expect(req.header('X-Requested-With')).toBeNull();
      return res
        .status(200)
        .body(JSON.stringify({ success: true }))
        .header('Content-Type', 'application/json');
    });

    return jsonService.postForm('foo', { bar: 'baz' }).then(response => {
      expect(response).toEqual({ success: true });
    });
  });

  it('should complain if url is not added to jsonService.postForm', () => {
    const sdk = new BrowserSDK({ environment: 'dev', clientId: 'foo-client' });
    const tokenClient = sdk.manager._tokenClient; // eslint-disable-line
    const jsonService = tokenClient._jsonService; // eslint-disable-line

    expect(() => jsonService.postForm('', { bar: 'baz' })).toThrowError('url');
  });

  it('should properly call XMLHttpRequest', () => {
    const sdk = new BrowserSDK({ environment: 'dev', clientId: 'foo-client' });

    sdk.manager.getUser = jest.fn().mockResolvedValue(mockUser('foo'));

    XHRMock.post(/token$/, (req, res) => {
      expect(req.header('Content-Type')).toEqual(
        'application/x-www-form-urlencoded'
      );
      expect(req.header('X-Requested-With')).toEqual('bar');
      const response = {
        access_token: 'bar_access_token',
        refresh_token: 'bar_refresh_token',
        expires_in: Math.floor(Date.now() / 1000) + 60 * 120, // two hours
      };
      return res
        .status(200)
        .body(JSON.stringify(response))
        .header('Content-Type', 'application/json');
    });

    return sdk.changeTenant('bar');
  });

  it('should properly handle errors in XMLHttpRequest', () => {
    const sdk = new BrowserSDK({ environment: 'dev', clientId: 'foo-client' });

    sdk.manager.getUser = jest.fn().mockResolvedValue(mockUser('foo'));

    XHRMock.post(/token$/, (req, res) =>
      res
        .status(400)
        .body(JSON.stringify({ error: 'Invalid token' }))
        .header('Content-Type', 'application/json')
    );

    return sdk.changeTenant('bar').catch(error => {
      expect(error.message).toEqual('Invalid token');
    });
  });

  it('should properly handle no errors in body in XMLHttpRequest', () => {
    const sdk = new BrowserSDK({ environment: 'dev', clientId: 'foo-client' });

    sdk.manager.getUser = jest.fn().mockResolvedValue(mockUser('foo'));

    XHRMock.post(/token$/, (req, res) =>
      res
        .status(400)
        .reason('Some other error')
        .body(JSON.stringify({}))
        .header('Content-Type', 'application/json')
    );

    return sdk.changeTenant('bar').catch(error => {
      expect(error.message).toEqual('Some other error ( 400 )');
    });
  });

  it('should complain for malformed response XMLHttpRequest', () => {
    const sdk = new BrowserSDK({ environment: 'dev', clientId: 'foo-client' });

    sdk.manager.getUser = jest.fn().mockResolvedValue(mockUser('foo'));

    XHRMock.post(/token$/, (req, res) =>
      res
        .status(200)
        .body('{ foo: bar }')
        .header('Content-Type', 'application/json')
    );

    return sdk.changeTenant('bar').catch(error => {
      expect(error.message).toEqual('Unexpected token f in JSON at position 2');
    });
  });

  it('should properly handle not allowed content type', () => {
    const sdk = new BrowserSDK({ environment: 'dev', clientId: 'foo-client' });

    sdk.manager.getUser = jest.fn().mockResolvedValue(mockUser('foo'));

    XHRMock.post(/token$/, (req, res) =>
      res
        .status(200)
        .body(JSON.stringify({ foo: 'bar' }))
        .header('Content-Type', 'invalid')
    );

    return sdk.changeTenant('bar').catch(error => {
      expect(error.message).toEqual(
        'Invalid response Content-Type: invalid, from URL: https://id.dev.olt-dev.io/v1/id/auth/realms/olt/protocol/openid-connect/token'
      );
    });
  });

  it('should properly handle not allowed content type with 400', () => {
    const sdk = new BrowserSDK({ environment: 'dev', clientId: 'foo-client' });

    sdk.manager.getUser = jest.fn().mockResolvedValue(mockUser('foo'));

    XHRMock.post(/token$/, (req, res) =>
      res
        .status(400)
        .reason('Other error')
        .body(JSON.stringify({ foo: 'bar' }))
        .header('Content-Type', 'invalid')
    );

    return sdk.changeTenant('bar').catch(error => {
      expect(error.message).toEqual('Other error ( 400 )');
    });
  });

  it('should properly handle network errors', () => {
    const sdk = new BrowserSDK({ environment: 'dev', clientId: 'foo-client' });

    sdk.manager.getUser = jest.fn().mockResolvedValue(mockUser('foo'));

    XHRMock.post(/token$/, () => Promise.reject(new Error('some error')));

    return sdk.changeTenant('bar').catch(error => {
      expect(error.message).toEqual('Network Error');
    });
  });

  it('should properly handle server errors in XMLHttpRequest', () => {
    const sdk = new BrowserSDK({ environment: 'dev', clientId: 'foo-client' });

    sdk.manager.getUser = jest.fn().mockResolvedValue(mockUser('foo'));

    XHRMock.post(/token$/, (req, res) =>
      res
        .status(500)
        .reason('Internal Server Error')
        .body(JSON.stringify({ error: 'Invalid token' }))
        .header('Content-Type', 'application/json')
    );

    return sdk.changeTenant('bar').catch(error => {
      expect(error.message).toEqual('Internal Server Error ( 500 )');
    });
  });

  afterEach(() => XHRMock.teardown());
});
