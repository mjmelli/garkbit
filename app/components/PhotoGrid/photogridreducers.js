import _ from 'lodash';

function photos(state = [], action) {
    let newState = [];
    let index = 0;
    switch (action.type) {
        case 'LOAD_PHOTOS':
            newState = action.photos;
            return newState;
        case 'ADD_PHOTO':
            newState = [ ...state, action.photo ];
            return newState;
        case 'UPDATE_PHOTO': {

        }
        case 'DELETE_PHOTO': {
            index = _.findIndex(state, {id: action.id});
            newState = [...state];
            _.pullAt(newState, index);
            return newState;
        }
        case 'SORT_PHOTO': {
            newState = [...state];
            if (action.id === action.targetId) return newState;
            let itemToMove = _.find(newState, {id: action.id});
            _.pull(newState, itemToMove);
            let targetIndex = _.findIndex(newState, {id: action.targetId});
            newState.splice(targetIndex, 0, itemToMove);
            return newState;
        }
        case 'SORT_PLACEHOLDER': {
            newState = [...state];
            const placeholder = {id: 'placeholder'};
            let itemToPull = _.find(newState, {id: 'placeholder'});
            _.pull(newState, itemToPull);
            let targetIndex = _.findIndex(newState, {id: action.targetId});
            newState.splice(targetIndex, 0, placeholder);
            return newState;
        }

        default:
            return state;
    }
}

export default photos;
