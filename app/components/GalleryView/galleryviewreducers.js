import _ from 'lodash';

function gallery(state = {id: '', name: ''}, action) {
    let newState = {};
    switch (action.type) {
        case 'LOAD_GALLERY':
            newState = { id: action.gallery.id, name: action.gallery.name };
            return newState;
        case 'UPDATE_GALLERY':
            if(state.id == action.id) {
              newState = { id: action.id, name: action.name };
              return newState;
            } else {
              return state;
            }
        default:
            return state;
    }
}

export default gallery;
