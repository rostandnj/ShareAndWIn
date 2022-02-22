import * as ActionTypes from './types';
import API from './../../api/fetch';
import {Alert} from 'react-native';
import I18n from '../../i18n/i18n';
import Config from '../../var/config';
import AsyncStorage from '@react-native-community/async-storage';
import * as RootNavigation from '../../rootNavigation';

export const isSignIn = (bool, data) => {
  return {
    type: ActionTypes.SIGNIN_SUCCES,
    signed: bool,
    isLoading: false,
    hasError: false,
    errorMsg: '',
    errorField: '',
    data: data,
  };
};

export const signInHasError = (bool, msg, field) => {
  return {
    type: ActionTypes.SIGNIN_HAS_ERROR,
    hasError: bool,
    errorMsg: msg,
    errorField: field,
    isLoading: false,
  };
};

export const signInIsLoading = (bool, data) => {
  return {
    email: data.email,
    password: '',
    type: ActionTypes.SIGNIN_START,
    isLoading: bool,
    hasError: false,
    errorMsg: '',
  };
};

export const signin = (email, password) => {
  let data1 = {username: email, password: password};

  return (dispatch) => {
    dispatch(signInIsLoading(true, {email: email, password: password}));

    if (!email) {
      dispatch(signInHasError(true, I18n.t('fill_email'), 'email'));
      return;
    } else {
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (re.test(String(email).toLowerCase()) === false) {
        dispatch(signInHasError(true, I18n.t('invalid_email'), 'email'));
        return;
      }
    }

    if (!password) {
      dispatch(signInHasError(true, I18n.t('fill_password'), 'password'));
      return;
    }

    let ur = Config.API_URL_BASE1 + Config.API_LOGIN;

    API.post(ur, data1)
      .then(function (res) {
        if ([201, 200].includes(res.status)) {
          if (res.data.code === 200) {
            //console.log(res.data.data);
            dispatch(isSignIn(true, res.data.data));
          } else {
            dispatch(signInHasError(true, I18n.t('login_error'), ''));
          }
        } else {
          dispatch(signInHasError(true, I18n.t('login_error'), ''));
        }
      })
      .catch(function (error) {
        if (error.response && error.response.data) {
          dispatch(signInHasError(true, error.response.data.message, ''));
        } else {
          console.log(JSON.stringify(error));
          dispatch(signInHasError(true, I18n.t('network_error'), ''));
          Alert.alert(
            'Message',
            I18n.t('network_error'),
            [{text: 'OK', onPress: () => {}}],
            {cancelable: true},
          );
        }

        //dispatch(signInHasError(true,translate(error.response.data.message.message),""));
      });
  };
};

export const signinOne = (id) => {
  return (dispatch) => {
    dispatch(signInIsLoading(true, {email: id, password: ''}));

    let ur = Config.API_URL_BASE1 + Config.API_LOGIN_GOOGLE + id;
    console.log(ur);

    API.get(ur, {})
      .then(function (res) {
        if ([201, 200].includes(res.status)) {
          if (res.data.code === 200) {
            console.log(res.data.data);
            dispatch(isSignIn(true, res.data.data));
          } else {
            dispatch(signInHasError(true, I18n.t('login_error'), ''));
          }
        } else {
          dispatch(signInHasError(true, I18n.t('login_error'), ''));
        }
      })
      .catch(function (error) {
        if (error.response && error.response.data) {
          dispatch(signInHasError(true, error.response.data.message, ''));
        } else {
          console.log(error);
          //console.log(JSON.stringify(error));
          dispatch(signInHasError(true, I18n.t('network_error'), ''));
          Alert.alert(
            'Message',
            I18n.t('network_error'),
            [{text: 'OK', onPress: () => {}}],
            {cancelable: true},
          );
        }

        //dispatch(signInHasError(true,translate(error.response.data.message.message),""));
      });
  };
};

export const logout = () => {
  return (dispatch) => {
    dispatch(isSignIn(false, null));
  };
};

const SigninAction = {
  signin,
  signinOne,
  signInIsLoading,
  isSignIn,
  logout,
};

export default SigninAction;
