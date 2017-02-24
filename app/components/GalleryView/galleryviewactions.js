import Config from '../../../config';
import Fetch from 'isomorphic-fetch';
import { browserHistory } from 'react-router';

export function loadGallery(galleryId) {
    return dispatch => {
        return Fetch(Config.API_URL + '/galleries/' + galleryId)
        .then(response => response.json())
        .then(json => dispatch(didLoadGallery(json.gallery)))
        .catch(function(e) {
            console.log('--Load Gallery--');
            console.log(e);
        })
    }
}

function didLoadGallery(gallery) {
    return { type: 'LOAD_GALLERY', gallery };
}

export function unloadGallery() {
    return dispatch => {
        return dispatch({ type: 'UNLOAD_GALLERY' });
    }
}

export function updateGallery(id, name, parentId) {
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
        })
    }
}

function didUpdateGallery(id, name, parentId) {
  return { type: 'UPDATE_GALLERY', id, name, parentId }
}

export function updateGallerySort(id, sort) {
    return dispatch => {
        return Fetch(Config.API_URL + '/galleries/' + id, {
            method: 'POST',
            headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
            body: 'sortBy=' + sort,
        })
        .then(response => response.json())
        .then(json => dispatch(didUpdateGallerySort(id, sort)))
        .catch(function(e) {
            console.log('--Update Gallery Sort--');
            console.log(e);
        })
    }
}

function didUpdateGallerySort(id, sort) {
    return { type: 'UPDATE_GALLERY_SORT', id, sort }
}

export function deleteGallery(id, parentId) {
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
        })
    }
}

function didDeleteGallery(id, parentId) {
  return { type: 'DELETE_GALLERY', id, parentId }
}
