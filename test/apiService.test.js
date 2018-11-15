import ApiService from '../src/tools/apiService';
import UserManagerProvider from '../src/tools/userManagerProvider';
import EnvironmentProvider from '../src/tools/environmentProvider';

const userMock = { access_token: 'abcdefg' };

const defaultHeaders = { 'content-type': 'application/json' };
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
    fetch.mockResponseOnce(JSON.stringify({ data: '12345' }), { headers: defaultHeaders });

    return ApiService.call('/test-uri').then(() => {
      expect(UserManagerProvider.get().getUser.mock.calls.length).toEqual(1);
    });
  });

  it('throws error if no user is authorized', () => {
    UserManagerProvider.set({
      getUser: jest.fn().mockResolvedValue(null),
    });
    fetch.mockResponseOnce(JSON.stringify({ data: '12345' }), { headers: defaultHeaders });

    expect(ApiService.call('/test-uri')).rejects.toEqual(
      new Error('OLT Browser SDK: No authorized user found'),
    );
  });

  it('returns promise with response', () => {
    const responseMock = { data: '12345' };
    fetch.mockResponseOnce(JSON.stringify(responseMock), { headers: defaultHeaders });

    return ApiService.call('/test-uri').then((response) => {
      expect(response.data).toEqual(responseMock.data);
      expect(response.httpStatusCode).toEqual(200);
    });
  });

  it('can handle json responses where content-type contains application/json as a substring', () => {
    const responseMock = { data: '12345' };
    fetch.mockResponseOnce(JSON.stringify(responseMock), { headers: { 'content-type': 'application/json; charset=utf-8' } });

    return ApiService.call('/test-uri').then((response) => {
      expect(response.data).toEqual(responseMock.data);
      expect(response.httpStatusCode).toEqual(200);
    });
  });

  it('can handle non json responses', () => {
    const responseMock = 'no json';

    fetch.mockResponseOnce(responseMock);

    return ApiService.call('/test-uri').then((response) => {
      expect(response.httpStatusCode).toEqual(200);
      expect(response.data).toBeUndefined();
      expect(response.response.body).toEqual(responseMock);
    });
  });
});
