import Config from '../../../config';
import Fetch from 'isomorphic-fetch';
import { browserHistory } from 'react-router';
import Cookie from 'react-cookie';
import { handleError } from '../Error/erroractions';

/*
    THUNKS
*/

export const loadGallery = (galleryId) => {
    return dispatch => {
        return Fetch(Config.API_URL + '/galleries/' + galleryId, {
            headers: {
                'Authorization': Cookie.load('token'),
            },
        })
        .then(response => {
            if (!response.ok) {
                throw response;
            }
            return response.json();
        })
        .then(json => dispatch(didLoadGallery(json.gallery)))
        .catch(function(e) {
            handleError(dispatch, e, 'Error loading gallery');
            console.log('--Load Gallery--');
            console.log(e);
        });
    }
}

export const unloadGallery = () => {
    return dispatch => { dispatch(didUnloadGallery()) }
}

export const updateGallery = (id, name, parentId) => {
    return dispatch => {
        return Fetch(Config.API_URL + '/galleries/' + id, {
            method: 'POST',
            headers: {
                'Authorization': Cookie.load('token'),
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body: 'name=' + name,
        })
        .then(response => {
            if (!response.ok) {
                throw response;
            }
            return response.json();
        })
        .then(json => dispatch(didUpdateGallery(id, name, parentId)))
        .catch(function(e) {
            handleError(dispatch, e, 'Error updating gallery');
            console.log('--Update Gallery--');
            console.log(e);
        });
    }
}


export const deleteGallery = (id, parentId) => {
    return ( dispatch ) => {
        return Fetch(Config.API_URL + '/galleries/' + id, {
            method: 'DELETE',
            headers: {
                'Authorization': Cookie.load('token'),
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
        })
        .then(response => {
            if (!response.ok) {
                throw response;
            }
            return response.json();
        })
        .then(json => dispatch(didDeleteGallery(id, parentId)))
        .then(() => {
            browserHistory.push('/');
        })
        .catch(function(e) {
            handleError(dispatch, e, 'Error deleting gallery');
            console.log('--Delete Gallery--');
            console.log(e);
        });
    }
}

/*
    ACTION CREATORS
*/

const didLoadGallery = (gallery) => ({ type: 'LOAD_GALLERY', gallery });
const didUnloadGallery = () => ({ type: 'UNLOAD_GALLERY' });
const didUpdateGallery = (id, name, parentId) => ({ type: 'UPDATE_GALLERY', id, name, parentId });
const didDeleteGallery = (id, parentId) => ({ type: 'DELETE_GALLERY', id, parentId });
