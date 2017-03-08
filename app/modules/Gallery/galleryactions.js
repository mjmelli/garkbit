import Config from '../../../config';
import Fetch from 'isomorphic-fetch';
import { browserHistory } from 'react-router';

/*
    THUNKS
*/

export const loadGallery = (galleryId) => {
    return dispatch => {
        return Fetch(Config.API_URL + '/galleries/' + galleryId)
        .then(response => response.json())
        .then(json => dispatch(didLoadGallery(json.gallery)))
        .catch(function(e) {
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
            headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
            body: 'name=' + name,
        })
        .then(response => response.json())
        .then(json => dispatch(didUpdateGallery(id, name, parentId)))
        .catch(function(e) {
            console.log('--Update Gallery--');
            console.log(e);
        });
    }
}


export const deleteGallery = (id, parentId) => {
    return ( dispatch ) => {
        return Fetch(Config.API_URL + '/galleries/' + id, {
            method: 'DELETE',
            headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
        })
        .then(response => response.json())
        .then(json => dispatch(didDeleteGallery(id, parentId)))
        .then(() => {
            browserHistory.push('/');
        })
        .catch(function(e) {
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
