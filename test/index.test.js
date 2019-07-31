import BrowserSDK from '../src/index';
import userManagerProvider from '../src/tools/userManagerProvider';
import environmentProvider from '../src/tools/environmentProvider';

describe('browser module', () => {
  describe('constructor', () => {
    it('throws error if constructor options are invalid', () => {
      expect(() => new BrowserSDK()).toThrowError();
      expect(() => new BrowserSDK({ environment: 'int' })).toThrowError();
      expect(() => new BrowserSDK({ clientId: 'abcdefg' })).toThrowError();
    });

    it('creates user manager instance', () => {
      const sdk = new BrowserSDK({ environment: 'int', clientId: 'abcdefg' });
      expect(sdk.manager.settings).toBeDefined();
    });

    it('sets userManagerProvider', () => {
      const sdk = new BrowserSDK({ environment: 'int', clientId: 'abcdefg' }); // eslint-disable-line no-unused-vars
      expect(userManagerProvider.get()).toBeDefined();
    });

    it('sets EnvironmentProvider', () => {
      const sdk = new BrowserSDK({ environment: 'int', clientId: 'abcdefg' }); // eslint-disable-line no-unused-vars
      expect(environmentProvider.get()).toBeDefined();
    });
  });

  describe('login', () => {
    it('calls signinRedirect method', () => {
      const sdk = new BrowserSDK({ environment: 'int', clientId: 'abcdefg' });
      sdk.manager.signinRedirect = jest.fn();
      return sdk.login().then(() => {
        expect(sdk.manager.signinRedirect.mock.calls.length).toBe(1);
      });
    });

    it('calls signinRedirect method with loginHint if passed as option', () => {
      const sdk = new BrowserSDK({ environment: 'int', clientId: 'abcdefg' });
      sdk.manager.signinRedirect = jest.fn();
      const loginHint = 's@n.se';
      return sdk.login({ loginHint }).then(() => {
        expect(sdk.manager.signinRedirect.mock.calls.length).toBe(1);
        expect(sdk.manager.signinRedirect.mock.calls[0][0]).toEqual({
          login_hint: loginHint,
        });
      });
    });

    it('dont call signinRedirect method when user is authorized', () => {
      const sdk = new BrowserSDK({ environment: 'int', clientId: 'abcdefg' });
      sdk.manager.getUser = jest
        .fn()
        .mockResolvedValue({ access_token: 'abcdefg' });
      sdk.manager.signinRedirect = jest.fn();
      return sdk.login().then(() => {
        expect(sdk.manager.signinRedirect.mock.calls.length).toBe(0);
      });
    });
  });

  describe('logout', () => {
    it('should call signoutRedirect method', () => {
      const sdk = new BrowserSDK({ environment: 'int', clientId: 'abcdefg' });
      sdk.manager.signoutRedirect = jest.fn();
      sdk.logout();
      expect(sdk.manager.signoutRedirect.mock.calls.length).toBe(1);
    });

    it('clears userManagerProvider', () => {
      const sdk = new BrowserSDK({ environment: 'int', clientId: 'abcdefg' }); // eslint-disable-line no-unused-vars
      sdk.logout();
      expect(userManagerProvider.get()).toBeUndefined();
    });
  });

  describe('getCurrentUser', () => {
    it('returns promise with user object', () => {
      const sdk = new BrowserSDK({ environment: 'int', clientId: 'abcdefg' });
      const userMock = { access_token: 'abcdefg' };
      sdk.manager.getUser = jest.fn().mockResolvedValue(userMock);
      return sdk.getCurrentUser().then(response => {
        expect(response).toEqual(userMock);
      });
    });
  });

  describe('changeTenant', () => {
    it('should call signInRedirect if no tenantId is provided', () => {
      const sdk = new BrowserSDK({ environment: 'int', clientId: 'abcdefg' });
      sdk.manager.signinRedirect = jest.fn().mockResolvedValue(true);
      return sdk.changeTenant().then(response => {
        expect(response).toEqual(true);
      });
    });

    it('should call changeTenant if no tenantId is provided', () => {
      const sdk = new BrowserSDK({ environment: 'int', clientId: 'abcdefg' });
      sdk.manager.changeTenant = jest.fn().mockResolvedValue(true);
      return sdk.changeTenant('foo').then(response => {
        expect(response).toEqual(true);
        expect(sdk.manager.changeTenant.mock.calls[0][0]).toEqual('foo');
      });
    });
  });
});
