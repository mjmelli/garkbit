import Config from '../../../../config';
import Fetch from 'isomorphic-fetch';

export const updateGallerySort = (id, sort) => {
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

const didUpdateGallerySort = (id, sort) => ({ type: 'UPDATE_GALLERY_SORT', id, sort });
