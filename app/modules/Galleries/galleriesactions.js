import _ from 'lodash';
import Config from '../../../config';
import Fetch from 'isomorphic-fetch';

/*
    THUNKS
*/

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

export const updateGallery = (id, name, parentId) => {
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

export const deleteGallery = (id, parentId) => {
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

/*
    Note: in this function, it's important to remove the photo from the old gallery
    before adding to the new gallery in order to preserve parent/child consistency
*/
export const addPhotoToGallery = (photoId, galleryId) => {
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

/*
    ACTION CREATORS
*/

const didAddGallery = (gallery) => ({ type: 'ADD_GALLERY', gallery });
const didUpdateGallery = (id, name, parentId) => ({ type: 'UPDATE_GALLERY', id, name, parentId });
const didDeleteGallery = (id, parentId) => ({ type: 'DELETE_GALLERY', id, parentId });
const didAddPhotoToGallery = (photoId, galleryId) => ({ type: 'ADD_PHOTO_TO_GALLERY', photoId, galleryId });
