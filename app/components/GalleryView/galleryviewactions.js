import Config from '../../../config';
import Fetch from 'isomorphic-fetch';

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

export function updateGallery(id, name) {
    return dispatch => {
        return Fetch(Config.API_URL + '/galleries/' + id, {
            method: 'POST',
            headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
            body: 'name=' + name,
        })
        .then(response => response.json())
        .then(json => dispatch(didUpdateGallery(json.gallery.id, json.gallery.name)))
        .catch(function(e) {
            console.log('--Update Gallery--');
            console.log(e);
        })
    }
}

function didUpdateGallery(id, name) {
  return { type: 'UPDATE_GALLERY', id, name }
}