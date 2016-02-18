import _ from 'lodash';
//function galleries(state = {isFetching: false, items: []}, action) {

function galleries(state = [], action) {
    switch (action.type) {
        case 'ADD_GALLERY':
            return [
                ...state,
                { id: action.gallery.id, name: action.gallery.name }
            ];
        case 'UPDATE_GALLERY':
            let gallery = { id: action.id, name: action.name };
            var index = _.findIndex(state, {id: action.id});
            var newState = [...state];
            newState.splice(index, 1, gallery);
            return newState;
        case 'DELETE_GALLERY':
            var index = _.findIndex(state, {id: action.id});
            var newState = [...state];
            _.pullAt(newState, index);
            return newState;
        default:
            return state;
    }
}

export default galleries;