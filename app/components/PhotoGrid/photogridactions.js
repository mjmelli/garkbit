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

export function sortPhoto(galleryId, photoId, targetId, direction) {
    return dispatch => {
        return Fetch(Config.API_URL + '/galleries/' + galleryId + '/photo/' + photoId + '/sort', {
            method: 'PUT',
            headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
            body: 'targetId=' + targetId + '&direction=' + direction,
        })
        .then(response => response.json())
        .then(json => dispatch(didSortPhoto(photoId, targetId)))
        .catch(function(e) {
            console.log('--Sort Photo--');
            console.log(e);
        })
    }
}

function didSortPhoto(id, targetId) {
    return { type: 'SORT_PHOTO', id, targetId }
}

export function movePhoto(dragIndex, hoverIndex) {
    return dispatch => {
        return dispatch({ type: 'MOVE_PHOTO', dragIndex, hoverIndex });
    }
}

export function togglePhotoSelect(id) {
    return dispatch => {
        return dispatch({ type: 'TOGGLE_PHOTO_SELECT', id });
    }
}

export function toggleCannotSortDialog() {
    return dispatch => {
        return dispatch({ type: 'TOGGLE_CANNOT_SORT_DIALOG' });
    }
}
