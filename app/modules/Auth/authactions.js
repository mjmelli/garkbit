import Config from '../../../config';
import Fetch from 'isomorphic-fetch';
import Cookie from 'react-cookie';
import { browserHistory } from 'react-router';

export const logoutUser = (dispatch) => {
    Cookie.remove('token', { path: '/' });
    dispatch(didLogout());
    //browserHistory.push('/login');
}

export const loginUser = (email, password) => {
    return dispatch => {
        return Fetch(Config.API_URL + '/login', {
            method: 'POST',
            headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
            body: 'email=' + email + '&password=' + password,
        })
        .then(response => {
            if (!response.ok) {
                throw response;
            }
            return response.json();
        })
        .then(json => {
            Cookie.save('token', json.token, { path: '/' });
            dispatch(didLogin());
            browserHistory.push('/');
        })
        .catch(function(e) {
            logoutUser(dispatch);
            console.log('--User Login--');
            console.log(e);
        });
    }
}

const didLogin = () => ({ type: 'LOGIN_USER' });
const didLogout = () => ({ type: 'LOGOUT_USER' });
