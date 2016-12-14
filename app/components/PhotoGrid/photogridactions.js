import Config from '../../../config';
import Fetch from 'isomorphic-fetch';

export function loadPhotos(galleryId) {
    return dispatch => {
        return Fetch(Config.API_URL + '/galleries/' + galleryId + '/photos')
        .then(response => response.json())
        .then(json => dispatch(didLoadPhotos(json.photos)))
        .catch(function(e) {
            console.log('--Load Photos--');
            console.log(e);
        })
    }
}

function didLoadPhotos(photos) {
    return { type: 'LOAD_PHOTOS', photos };
}

export function updatePhoto(id, name) {
    return dispatch => {
        return Fetch(Config.API_URL + '/galleries/' + id, {
            method: 'POST',
            headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
            body: 'name=' + name,
        })
        .then(response => response.json())
        .then(json => dispatch(didUpdateGallery(json.gallery.id, json.gallery.name)))
        .catch(function(e) {
            console.log('--Update Photo--');
            console.log(e);
        })
    }
}

function didUpdatePhoto(id, name) {
  return { type: 'UPDATE_PHOTO', id, name }
}

export function deletePhoto(id) {
    return dispatch => {
        return Fetch(Config.API_URL + '/photos/' + id, {
            method: 'DELETE',
            headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
        })
        .then(response => response.json())
        .then(json => dispatch(didDeletePhoto(id)))
        .catch(function(e) {
            console.log('--Delete Photo--');
            console.log(e);
        })
    }
}

function didDeletePhoto(id) {
  return { type: 'DELETE_PHOTO', id }
}

export function sortPhoto(id, targetId) {
    return dispatch => {
        return dispatch(didSortPhoto(id, targetId));
    }
}

function didSortPhoto(id, targetId) {
    return { type: 'SORT_PHOTO', id, targetId }
}

export function addSortPlaceholder(targetId) {
    return dispatch => {
        return dispatch( { 'type': 'SORT_PLACEHOLDER', targetId } );
    }
}
