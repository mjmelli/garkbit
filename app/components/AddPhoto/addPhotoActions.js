import Config from '../../../config';
import Fetch from 'isomorphic-fetch';

export const addPhoto = (file, galleryId) => {
    return dispatch => {

        let formData = new FormData();
        formData.append('photo', file);
        formData.append('galleryId', galleryId);

        return Fetch(Config.API_URL + '/photos', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(json => dispatch(didAddPhoto(json.photo)))
        .catch(function(e) {
            console.log('--Add Photo--');
            console.log(e);
        })
    }
}

const didAddPhoto = (photo) => ({ type: 'ADD_PHOTO', photo });
