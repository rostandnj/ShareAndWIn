import axios from 'axios';
import Config from './../var/config';
import {AsyncStorage} from 'react-native';

var header = {
  'Content-Type': 'text/html',
  language: '',
  Authorization: '',
};

const onResponseSuccess = (response) => {
  //console.log(response.data.results);
  return response;
};
const onResponseError = (err) => {
  const status = err.status;
  if (status > 201) {
    console.log('errror 401 or 403');
  } else {
    console.log(err);
  }
  return Promise.reject(err);
};

const requestHandler = (request) => {
  request.headers.lang = 'fr';

  return request;
};

const instance = axios.create({
  /*baseURL: Config.API_URL,*/
  timeout: 20000,
  headers: header,
});

instance.interceptors.response.use(onResponseSuccess, onResponseError);

instance.interceptors.request.use((request) => requestHandler(request));

export default instance;
