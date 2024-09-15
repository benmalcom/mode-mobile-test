import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import { isEmpty } from 'lodash';

const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}`;

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  },
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED')
      throw new Error('Network timeout, please try again');
    if (error.response) throw error.response.data;
    if (error.request)
      throw new Error('Request taking too long, please check your network');
    throw error;
  }
);

export default instance;

export const createRequest = async <T = any>({
  method = 'get',
  payload,
  params,
  headers,
  ...rest
}: AxiosRequestConfig & { payload?: object }): Promise<AxiosResponse<T>> => {
  const config: AxiosRequestConfig = {
    method,
    data:
      payload && (!isEmpty(payload) || payload instanceof FormData)
        ? payload
        : undefined,
    params: !isEmpty(params) ? params : undefined,
    headers,
    ...rest,
  };

  return instance(config);
};
