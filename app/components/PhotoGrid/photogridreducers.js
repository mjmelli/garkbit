import _ from 'lodash';
import update from 'immutability-helper';

function photos(state = [], action) {
    let newState = [];
    let index = 0;
    switch (action.type) {
        case 'LOAD_PHOTOS':
            newState = action.photos;
            return newState;
        case 'ADD_PHOTO':
            newState = [ ...state, ...action.photos ];
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
            return state;
        }
        case 'MOVE_PHOTO': {
            newState = [...state];
            const itemToMove = newState[action.dragIndex];
            _.pullAt(newState, action.dragIndex);
            newState.splice(action.hoverIndex, 0, itemToMove);
            return newState;
        }
        case 'TOGGLE_PHOTO_SELECT': {
            index = _.findIndex(state, {id: action.id});
            if (state[index].isSelected) {
                newState = update(state, {[index]: {isSelected: {$set: false}}});
            } else {
                newState = update(state, {[index]: {isSelected: {$set: true}}});
            }
            return newState;
        }
        case 'MOVE_PHOTO_TO_GALLERY': {
            return state;
        }
        default:
            return state;
    }
}

export default photos;
