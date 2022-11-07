import axios from 'axios';
import { TIMEOUT } from './axios-interceptor';
import { MANAGEMENT_SITE_URL } from './constants';


axios.defaults.timeout = TIMEOUT;
axios.defaults.baseURL = `${MANAGEMENT_SITE_URL}api`;

const instance = axios.create({
  baseURL: `${MANAGEMENT_SITE_URL}api`,
  timeout: TIMEOUT,
});

const onRequestSuccess = (config: any) => {
  const token = localStorage.getItem('authentication_token') || sessionStorage.getItem('authentication_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

const onResponseSuccess = (response: any) => response;

instance.interceptors.request.use(onRequestSuccess);
instance.interceptors.response.use(onResponseSuccess);

export default instance;
