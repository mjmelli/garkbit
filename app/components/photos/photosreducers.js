import _ from 'lodash';

function photos(state = [], action) {
    switch (action.type) {
        case 'ADD_PHOTO':
            return [
                ...state,
                action.photo
            ];
        case 'UPDATE_PHOTO':
            let gallery = { id: action.id, name: action.name };
            var index = _.findIndex(state, {id: action.id});
            var newState = [...state];
            newState.splice(index, 1, gallery);
            return newState;
        case 'DELETE_PHOTO':
            var index = _.findIndex(state, {id: action.id});
            var newState = [...state];
            _.pullAt(newState, index);
            return newState;
        default:
            return state;
    }
}

export default photos;