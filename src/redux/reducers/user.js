import * as types from './../actions/types';
import AsyncStorage from '@react-native-community/async-storage';

const initialState = {
  isLogin: false,
  lang: '',
  user: null,
  searchData: {},
};

const userReducer = (state = initialState, action) => {
  const {type} = action;

  switch (type) {
    case types.USER_LOGOUT:
      return Object.assign({}, state, {
        isLogin: false,
        user: null,
        searchData: '',
      });

    case types.USER_IS_LOGIN:
      return Object.assign({}, state, {
        isLogin: true,
        user: action.user,
        searchData: '',
      });
    case types.USER_UPDATE:
      return Object.assign({}, state, {
        isLogin: true,
        user: action.user,
        searchData: '',
      });
    case types.USER_UPDATE_SEARCH:
      return Object.assign({}, state, {
        searchData: action.searchData,
      });
    case types.USER_UPDATE_OPEN_OFFER:
      const ob = Object.assign({}, state, {
        openOffer: action.openOffer,
      });
      return ob;

    default:
      return state;
  }
};

export default userReducer;
