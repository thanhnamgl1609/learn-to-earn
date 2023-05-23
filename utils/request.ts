import axios, { AxiosRequestConfig } from 'axios';

export const TIMEOUT = 20000;

const request = axios.create({
  timeout: TIMEOUT,
});

const makeRequest =
  (
    {
      method = 'GET',
      data = undefined,
      options = {},
    }: {
      method: 'GET' | 'POST' | 'PUT' | 'DELETE';
      data?: Record<string, any>;
      options?: AxiosRequestConfig;
    } = {
      method: 'GET',
      data: undefined,
      options: undefined,
    }
  ) =>
  async ([url, query]: [string, Record<string, any>] | [string]) => {
    const _options = {
      url,
      method,
      ...options,
    };
    Object.assign(_options, query ? { params: query } : {});
    Object.assign(_options, { data });
    const { data: response } = await request(_options);
    return response;
  };

export { request, makeRequest };
