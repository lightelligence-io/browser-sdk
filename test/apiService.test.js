import ApiService from '../src/tools/apiService';
import UserManagerProvider from '../src/tools/userManagerProvider';
import EnvironmentProvider from '../src/tools/environmentProvider';

const userMock = { access_token: 'abcdefg' };

describe('ApiService.call', () => {
  beforeEach(() => {
    UserManagerProvider.set({
      getUser: jest.fn().mockResolvedValue(userMock),
    });

    EnvironmentProvider.set({
      apiUri: 'http://example.com',
    });
    fetch.resetMocks();
  });

  it('resolves user object before executing a call', () => {
    fetch.mockResponseOnce(JSON.stringify({ data: '12345' }));

    return ApiService.call('/test-uri').then(() => {
      expect(UserManagerProvider.get().getUser.mock.calls.length).toEqual(1);
    });
  });

  it('throws error if no user is authorized', () => {
    UserManagerProvider.set({
      getUser: jest.fn().mockResolvedValue(null),
    });
    fetch.mockResponseOnce(JSON.stringify({ data: '12345' }));

    expect(ApiService.call('/test-uri')).rejects.toEqual(
      new Error('OLT Browser SDK: No authorized user found'),
    );
  });

  it('returns promise with response', () => {
    const responseMock = { data: '12345' };
    fetch.mockResponseOnce(JSON.stringify(responseMock));

    return ApiService.call('/test-uri').then((response) => {
      expect(response).toEqual(responseMock);
    });
  });
});
