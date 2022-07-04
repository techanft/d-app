import axios from 'axios';
import { SERVICE_API_URL } from './constants';


const TIMEOUT = 1 * 60 * 1000;
axios.defaults.timeout = TIMEOUT;
axios.defaults.baseURL = SERVICE_API_URL;

const instance = axios.create({
  baseURL: SERVICE_API_URL,
  timeout: TIMEOUT,
});

export default instance;
