import * as types from './../actions/types';
import AsyncStorage from '@react-native-community/async-storage';

const initialState = {
  isLogin: false,
  lang: '',
  user: null,
};

const userReducer = (state = initialState, action) => {
  const {type} = action;

  switch (type) {
    case types.USER_LOGOUT:
      return Object.assign({}, state, {
        isLogin: false,
        user: null,
      });

    case types.USER_IS_LOGIN:
      return Object.assign({}, state, {
        isLogin: true,
        user: action.user,
      });
    case types.USER_UPDATE:
      return Object.assign({}, state, {
        isLogin: true,
        user: action.user,
      });

    default:
      return state;
  }
};

export default userReducer;
