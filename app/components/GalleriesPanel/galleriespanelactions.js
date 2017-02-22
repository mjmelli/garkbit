import _ from 'lodash';
import Config from '../../../config';
import Fetch from 'isomorphic-fetch';

export const toggleAddGalleryModal = (addSet) => {
    return dispatch => {
        return dispatch({ type: 'TOGGLE_ADDGALLERY_MODAL', addSet });
    }
}

export const addGallery = (name, parentId, isSet) => {
    return ( dispatch ) => {
        return Fetch(Config.API_URL + '/galleries', {
            method: 'POST',
            headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
            body: 'name=' + name + '&parentId=' + parentId + '&isSet=' + isSet,
        })
        .then(response => response.json())
        .then(json => dispatch(didAddGallery(json.gallery)))
        .catch(function(e) {
            console.log('--Add Gallery--');
            console.log(e);
        })
    }
}

function didAddGallery(gallery) {
    return { type: 'ADD_GALLERY', gallery }
}

export function updateGallery(id, name, parentId) {
    return ( dispatch ) => {
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

export function deleteGallery(id, parentId) {
    return ( dispatch ) => {
        return Fetch(Config.API_URL + '/galleries/' + id, {
            method: 'DELETE',
            headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
        })
        .then(response => response.json())
        .then(json => dispatch(didDeleteGallery(id, parentId)))
        .catch(function(e) {
            console.log('--Delete Gallery--');
            console.log(e);
        })
    }
}

function didDeleteGallery(id, parentId) {
    return { type: 'DELETE_GALLERY', id, parentId }
}

/*
    Note: in this function, it's important to remove the photo from the old gallery
    before adding to the new gallery in order to preserve parent/child consistency
*/
export function addPhotoToGallery(photoId, galleryId) {
    return ( dispatch ) => {
        return Fetch(Config.API_URL + '/galleries/' + galleryId + '/photo/' + photoId, {
            method: 'PUT',
            headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
        })
        .then(response => response.json())
        .then(json => {
            return dispatch(didAddPhotoToGallery(photoId, galleryId))
        })
        .catch(function(e) {
            console.log('--Add Photo to Gallery--');
            console.log(e);
        })
    }
}

function didAddPhotoToGallery(photoId, galleryId) {
    return { type: 'ADD_PHOTO_TO_GALLERY', photoId, galleryId }
}

function didNotMovePhotoToGallery() {
    return { type: 'DID_NOT_ADD_PHOTO_TO_GALLERY' }
}
