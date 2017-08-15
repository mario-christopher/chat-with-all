import { combineReducers } from 'redux';
import { messageReducer } from '../store/reducer';

export const appReducer = combineReducers({
    messages: messageReducer
})