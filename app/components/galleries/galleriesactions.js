import fetch from 'isomorphic-fetch';

export function addGallery(name) {
    return dispatch => {
        return fetch('/api/galleries', {
            method: 'POST',
            headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
            body: 'name=' + name,
        })
        .then(response => response.json())
        .then(json => dispatch(didAddGallery(json.gallery)))
    }
}

function didAddGallery(gallery) {
    return { type: 'ADD_GALLERY', gallery }
}

export function updateGallery(id, name) {
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

function didUpdateGallery(id, name) {
  return { type: 'UPDATE_GALLERY', id, name }
}

export function deleteGallery(id) {
    return dispatch => {
        return fetch('/api/galleries/' + id, {
            method: 'DELETE',
            headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
        })
        .then(response => response.json())
        .then(json => dispatch(didDeleteGallery(id)))
    }
}

function didDeleteGallery(id) {
  return { type: 'DELETE_GALLERY', id }
}