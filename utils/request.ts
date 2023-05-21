import axios from 'axios';

const TIMEOUT = 20000;

const request = axios.create({
  timeout: TIMEOUT,
});

const makeRequest =
  ({ method, data = undefined } = { method: 'GET', data: undefined }) =>
  async ([url, query]: [string, Record<string, any>] | [string]) => {
    const options = {
      url,
      method,
    };
    Object.assign(options, query ? { params: query } : {});
    Object.assign(options, { data });
    const { data: response } = await request(options);
    return response;
  };

export { request, makeRequest };
