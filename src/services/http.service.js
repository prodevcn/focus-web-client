import axios from 'axios';

import storage from './storage.service';

const tokenKey = process.env.USER_TOKEN_KEY;
const baseURL = process.env.REACT_APP_API;

const http = axios.create({ baseURL: `${baseURL}/` });

function get(url, headers = {}, params = {}) {
  const accessToken = storage.getItem(tokenKey);
  const authHeader = { Authorization: `Bearer ${accessToken}` };
  return http.get(url, {
    ...params,
    headers: { ...authHeader, ...headers },
  });
}

function post(url, data, headers = {}, params = {}) {
  const accessToken = storage.getItem(tokenKey);
  const authHeader = { Authorization: `Bearer ${accessToken}` };
  return http.post(url, data, {
    ...params,
    headers: { ...authHeader, ...headers },
  });
}

function put(url, data, headers = {}) {
  const accessToken = storage.getItem(tokenKey);
  const authHeader = { Authorization: `Bearer ${accessToken}` };
  return http.put(url, data, { headers: { ...authHeader, ...headers } });
}

function remove(url, data, headers = {}) {
  const accessToken = storage.getItem(tokenKey);
  const authHeader = { Authorization: `Bearer ${accessToken}` };
  return http.delete(url, {
    headers: { ...authHeader, ...headers },
    data,
  });
}

export default {
  http,
  get,
  post,
  put,
  remove,
};
