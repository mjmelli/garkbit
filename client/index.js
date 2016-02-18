import React from 'react';
import { render } from 'react-dom';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import { syncHistory, routeReducer } from 'redux-simple-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import Routes from '../app/routes';
import configureStore from '../app/store';

let history = createBrowserHistory();
const initialState = window.__INITIAL_STATE__;

const store = configureStore(initialState);

render(
    <Provider store={store}>
        <Router children={Routes} history={history}/>
    </Provider>, 
    document.getElementById('app')
);