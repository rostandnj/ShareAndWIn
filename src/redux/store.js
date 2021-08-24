import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import signinReducer from './reducers/signin';
import userReducer from './reducers/user';

const rootReducer = combineReducers({
  signin: signinReducer,
  userState: userReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));
