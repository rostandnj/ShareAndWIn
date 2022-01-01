import * as ActionTypes from './types';
import AsyncStorage from '@react-native-community/async-storage';

import API from './../../api/fetch';
import Config from './../../var/config';

export const isLogin = (user, lang) => {
  return {
    type: ActionTypes.USER_IS_LOGIN,
    isLogin: true,
    user: user,
    lang: lang,
  };
};

export const isUpdate = (user) => {
  return {
    type: ActionTypes.USER_UPDATE,
    isLogin: true,
    user: user,
  };
};

export const updateSearchData = (data) => {
  return {
    type: ActionTypes.USER_UPDATE_SEARCH,
    isLogin: true,
    searchData: data,
  };
};

export const updateOpenOffer = (data) => {
  return {
    type: ActionTypes.USER_UPDATE_OPEN_OFFER,
    isLogin: true,
    openOffer: data,
  };
};

export const isLogout = () => {
  return {
    type: ActionTypes.USER_LOGOUT,
    isLogin: false,
    user: null,
  };
};

export const logout = () => {
  return (dispatch) => {
    dispatch(isLogout());
  };
};

export const CheckUserStatus = () => {
  return (dispatch) => {
    AsyncStorage.getItem('user').then((userToken) => {
      if (userToken !== null) {
        API.defaults.headers.Authorization =
          'Bearer ' + JSON.parse(userToken).accessToken;
        API.get(Config.API_URL_BASE1 + Config.API_USER_PROFILE)
          .then((res) => {
            API.get(
              Config.API_URL_BASE4 + Config.API_Loyality + res.data.data.id,
            )
              .then((res2) => {
                res.data.data.loyalTy = res2.data.data;
                console.log(res.data.data);
                dispatch(isLogin(res.data.data, 'en'));
              })
              .then((res2) => {})
              .catch((error) => {
                console.log(error.response.data);
              });
          })
          .catch((error) => {
            console.log(error.response.data);
            console.log('user');
          });
      } else {
        dispatch(isLogout());
      }
    });
  };
};

const UserAction = {
  isLogin,
  logout,
  CheckUserStatus,
  isUpdate,
  updateSearchData,
  updateOpenOffer,
};
export default UserAction;
