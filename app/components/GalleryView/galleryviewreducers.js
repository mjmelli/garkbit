import _ from 'lodash';

function gallery(state = {id: '', name: '', parentId: ''}, action) {
    let newState = {};
    switch (action.type) {
        case 'LOAD_GALLERY':
            newState = action.gallery;
            return newState;
        case 'UPDATE_GALLERY':
            if (state.id === action.id) {
              newState = { id: action.id, name: action.name, parentId: action.parentId };
              return newState;
            } else {
              return state;
            }
        case 'DELETE_GALLERY':
            if (state.id === action.id) {
                return {};
            } else {
                return state;
            }
        default:
            return state;
    }
}

export default gallery;
