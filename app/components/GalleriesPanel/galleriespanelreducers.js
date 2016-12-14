import _ from 'lodash';
//function galleries(state = {isFetching: false, items: []}, action) {

function galleries(state = [], action) {
    let newState = [];
    let index = 0;
    switch (action.type) {
        case 'ADD_GALLERY':
            return [
                ...state,
                { id: action.gallery.id, name: action.gallery.name }
            ];
        case 'UPDATE_GALLERY':
            let gallery = { id: action.id, name: action.name };
            index = _.findIndex(state, {id: action.id});
            newState = [...state];
            newState.splice(index, 1, gallery);
            return newState;
        case 'DELETE_GALLERY':
            index = _.findIndex(state, {id: action.id});
            newState = [...state];
            _.pullAt(newState, index);
            return newState;
        default:
            return state;
    }
}

export default galleries;
