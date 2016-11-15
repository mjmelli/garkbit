import _ from 'lodash';

function photos(state = { gallery: {}, photos: [] }, action) {
    let newState = {};
    switch (action.type) {
        case 'LOAD_GALLERY':
            newState = {...state};
            newState.gallery = { id: action.gallery.id, name: action.gallery.name };
            return newState;
        case 'LOAD_PHOTOS':
            newState = {...state};
            newState.photos = action.photos;
            return newState;
        case 'ADD_PHOTO':
            newState = {...state};
            newState.photos = [ ...state.photos, action.photo ];
            return newState;
        case 'UPDATE_PHOTO': {

        }
        case 'DELETE_PHOTO': {

        }
        default:
            return state;
    }
}

export default photos;