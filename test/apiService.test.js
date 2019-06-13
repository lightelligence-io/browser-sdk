import ApiService from '../src/tools/apiService';
import userManagerProvider from '../src/tools/userManagerProvider';
import environmentProvider from '../src/tools/environmentProvider';

const userMock = { access_token: 'abcdefg' };

const defaultHeaders = { 'content-type': 'application/json' };
describe('ApiService.call', () => {
  beforeEach(() => {
    userManagerProvider.set({
      getUser: jest.fn().mockResolvedValue(userMock),
    });

    environmentProvider.set({
      apiUri: 'http://example.com',
    });
    fetch.resetMocks();
  });

  it('resolves user object before executing a call', () => {
    fetch.mockResponseOnce(JSON.stringify({ data: '12345' }), {
      headers: defaultHeaders,
    });

    return ApiService.call('/test-uri').then(() => {
      expect(userManagerProvider.get().getUser.mock.calls.length).toEqual(1);
    });
  });

  it('throws error if no user is authorized', () => {
    userManagerProvider.set({
      getUser: jest.fn().mockResolvedValue(null),
    });
    fetch.mockResponseOnce(JSON.stringify({ data: '12345' }), {
      headers: defaultHeaders,
    });

    expect(ApiService.call('/test-uri')).rejects.toEqual(
      new Error('OLT Browser SDK: No authorized user found')
    );
  });

  it('returns promise with response', () => {
    const responseMock = { data: '12345' };
    fetch.mockResponseOnce(JSON.stringify(responseMock), {
      headers: defaultHeaders,
    });

    return ApiService.call('/test-uri').then(response => {
      expect(response.data).toEqual(responseMock.data);
      expect(response.httpStatusCode).toEqual(200);
    });
  });

  it('can handle json responses where content-type contains application/json as a substring', () => {
    const responseMock = { data: '12345' };
    fetch.mockResponseOnce(JSON.stringify(responseMock), {
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });

    return ApiService.call('/test-uri').then(response => {
      expect(response.data).toEqual(responseMock.data);
      expect(response.httpStatusCode).toEqual(200);
    });
  });

  it('can handle non json responses', () => {
    const responseMock = 'no json';

    fetch.mockResponseOnce(responseMock);

    return ApiService.call('/test-uri').then(response => {
      expect(response.httpStatusCode).toEqual(200);
      expect(response.data).toBeUndefined();
      expect(response.response.body).toEqual(responseMock);
    });
  });

  it('enriches the response with a default error message when no errorMessage given and status is over or equal 400', () => {
    const codes = [400, 404, 500, 504];

    const tests = codes.map(code => () => {
      const responseMock = { data: '12345' };
      fetch.mockResponseOnce(JSON.stringify(responseMock), {
        headers: defaultHeaders,
        status: code,
      });

      return ApiService.call('/test-uri').then(response => {
        expect(response.data).toEqual(responseMock.data);
        expect(response.httpStatusCode).toEqual(code);
        expect(response.errorMessage).toEqual(
          `Unknown Error occurred. Please try again later. Error Code: ${code}`
        );
      });
    });
    return tests.reduce(
      (previous, current) => previous.then(current),
      Promise.resolve({})
    );
  });
  it('rejects the promise when no json is returned and status is 500', () => {
    const code = 500;

    fetch.mockResponseOnce('An error', {
      headers: defaultHeaders,
      status: code,
    });

    return ApiService.call('/test-uri').catch(err => {
      expect(err.message).not.toBeUndefined();
      expect(err.message).toEqual(expect.stringContaining('invalid'));
      expect(err.message).toEqual(expect.stringContaining('json'));
    });
  });

  it('enriches the response with a default error message when no json and no content type returned and status is 500', () => {
    const code = 500;

    fetch.mockResponseOnce('An error', {
      headers: {},
      status: code,
    });

    return ApiService.call('/test-uri').then(response => {
      expect(response.httpStatusCode).toEqual(code);
      expect(response.errorMessage).toEqual(
        `Unknown Error occurred. Please try again later. Error Code: ${code}`
      );
    });
  });

  it("doesn't enrich a response with a default error message when no errorMessage given and status below 400", () => {
    const codes = [200, 204, 300, 303];

    const tests = codes.map(code => () => {
      const responseMock = { data: '12345' };
      fetch.mockResponseOnce(JSON.stringify(responseMock), {
        headers: defaultHeaders,
        status: code,
      });

      return ApiService.call('/test-uri').then(response => {
        expect(response.data).toEqual(responseMock.data);
        expect(response.httpStatusCode).toEqual(code);
        expect(response.errorMessage).toBeUndefined();
      });
    });
    return tests.reduce(
      (previous, current) => previous.then(current),
      Promise.resolve({})
    );
  });
});
