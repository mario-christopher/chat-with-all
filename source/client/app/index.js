require('es6-promise').polyfill();

import React from 'react';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import { appReducer } from './reducer';
import { App } from './app';
import '../style';

let store = createStore(
    appReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(thunk));

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);