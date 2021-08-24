import * as types from './../actions/types';

const initialState = {
  hasError: false,
  isLoading: false,
  email: '',
  password: '',
  signed: false,
  errorMsg: '',
  errorField: '',
  data: null,
};

const signinReducer = (state = initialState, action) => {
  const {type, email, password} = action;

  switch (type) {
    case types.SIGNIN_START:
      return Object.assign({}, state, {
        email: email,
        password: password,
        isLoading: true,
        hasError: false,
        errorMsg: '',
      });
    case types.SIGNIN_HAS_ERROR:
      return Object.assign({}, state, {
        hasError: action.hasError,
        errorMsg: action.errorMsg,
        errorField: action.errorField,
        isLoading: action.isLoading,
      });

    case types.SIGNIN_SUCCES:
      return Object.assign({}, state, {
        signed: action.signed,
        isLoading: action.isLoading,
        hasError: action.hasError,
        errorMsg: action.errorMsg,
        errorField: action.errorField,
        data: action.data,
      });
    case types.USER_LOGOUT:
      return Object.assign({}, state, {
        signed: action.signed,
      });
    default:
      return state;
  }
};

export default signinReducer;
