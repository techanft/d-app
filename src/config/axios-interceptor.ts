import axios from 'axios';
import { SERVER_API_URL } from './constants';


const TIMEOUT = 1 * 60 * 1000;
axios.defaults.timeout = TIMEOUT;
axios.defaults.baseURL = SERVER_API_URL;

const instance = axios.create({
  baseURL: SERVER_API_URL,
  timeout: TIMEOUT,
});

export default instance;
