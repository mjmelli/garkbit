import Config from '../../../config';
import Fetch from 'isomorphic-fetch';

export function loadPhotos() {
    return dispatch => {
        return Fetch(Config.API_URL + '/photos/')
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
