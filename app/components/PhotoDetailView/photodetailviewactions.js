import Config from '../../../config';
import Fetch from 'isomorphic-fetch';
import { browserHistory } from 'react-router';

/*
    THUNKS
*/

export const updatePhoto = (id, caption) => {
    return dispatch => {
        return Fetch(Config.API_URL + '/photos/' + id, {
            method: 'POST',
            headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
            body: 'caption=' + caption,
        })
        .then(response => response.json())
        .then(json => dispatch(didUpdatePhoto(id, caption, json.success)))
        .catch(function(e) {
            console.log('--Update Photo Details--');
            console.log(e);
        });
    }
}

/*
    ACTION CREATORS
*/

export const clearMessages = () => {
    return dispatch => { dispatch({ type: 'CLEAR_MESSAGES' }); }
}

const didUpdatePhoto = (id, caption, success) => ({ type: 'UPDATE_PHOTO', id, caption, success });
