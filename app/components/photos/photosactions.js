import fetch from 'isomorphic-fetch';

export function loadPhotos(galleryId) {
    return dispatch => {
        return fetch('/api/galleries/' + galleryId + '/photos')
        .then(response => response.json())
        .then(json => dispatch(didLoadPhotos(json.photos)))
    }
}

function didLoadPhotos(photos) {
    return { type: 'LOAD_PHOTOS', photos };
}

export function loadGallery(galleryId) {
    return dispatch => {
        return fetch('/api/galleries/' + galleryId)
        .then(response => response.json())
        .then(json => dispatch(didLoadGallery(json.gallery)))
    }
}

function didLoadGallery(id, name) {
    return { type: 'LOAD_GALLERY', gallery };
}

export function addPhoto(file, galleryId) {
    return dispatch => {
        
        let formData = new FormData();
        formData.append('photo', file);
        formData.append('galleryId', galleryId);
        
        return fetch('/api/photos', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(json => dispatch(didAddPhoto(json.photo)))
    }
}

function didAddPhoto(photo) {
    return { type: 'ADD_PHOTO', photo }
}

export function updatePhoto(id, name) {
    return dispatch => {
        return fetch('/api/galleries/' + id, {
            method: 'POST',
            headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
            body: 'name=' + name,
        })
        .then(response => response.json())
        .then(json => dispatch(didUpdateGallery(json.gallery.id, json.gallery.name)))
    }
}

function didUpdatePhoto(id, name) {
  return { type: 'UPDATE_PHOTO', id, name }
}

export function deletePhoto(id) {
    return dispatch => {
        return fetch('/api/photos/' + id, {
            method: 'DELETE',
            headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
        })
        .then(response => response.json())
        .then(json => dispatch(didDeletePhoto(id)))
    }
}

function didDeletePhoto(id) {
  return { type: 'DELETE_PHOTO', id }
}