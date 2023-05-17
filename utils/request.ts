import axios from 'axios';

const TIMEOUT = 20000;

const request = axios.create({
  timeout: TIMEOUT,
});

const makeRequest =
  ({ method, data = undefined }) =>
  async ([url, query]) => {
    const options = {
      url,
      method,
    };
    if (method === 'get') {
      Object.assign(options, data ? { params: data } : {});
    } else {
      Object.assign(options, { data } || {});
      Object.assign(options, { params: query } || {});
    }
    const { data: response } = await request(options);
    return response;
  };

export { request, makeRequest };
