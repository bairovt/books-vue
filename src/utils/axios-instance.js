'use strict';
const axios = require('axios');
import store from '@/store'

const axiosInst = axios.create({
  // baseURL: process.env.API_URL,
  baseURL: process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:7000/',
  timeout: process.env.NODE_ENV === 'development' ? 60000 : 10000 // todo: error dialog when canceled by timeout
  // withCredentials: true
});

/* Add a request interceptor */
axiosInst.interceptors.request.use(function (config) {
    const authToken = window.localStorage.getItem('authToken'); // token or null
    if (authToken) config.headers.Authorization = 'Bearer ' + authToken;  // set auth header
    store.commit('setLoading', true)
    return config;
  },
  function (error){
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInst.interceptors.response.use(function (response) {
  // Do something with response data
  store.commit('setLoading', false)
  return response;
}, function (error) {
  // Do something with response error
  return Promise.reject(error);
});

export default axiosInst;
