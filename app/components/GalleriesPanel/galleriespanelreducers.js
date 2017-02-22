import _ from 'lodash';
import update from 'immutability-helper';
//function galleries(state = {isFetching: false, items: []}, action) {

export function galleryPanel(state = {'showAddGalleryModal': false, 'addSet': false}, action) {
    let newState = {};
    switch (action.type) {
        case 'TOGGLE_ADDGALLERY_MODAL':
            newState = {...state};
            if (state.showAddGalleryModal) {
                newState.showAddGalleryModal = false;
            } else {
                newState.showAddGalleryModal = true;
            }
            newState.addSet = action.addSet;
            return newState;
        default:
            return state;
    }
}

export function galleries(state = [], action) {
    let newState = [];
    let index = 0;
    switch (action.type) {
        case 'ADD_GALLERY':
            newState = [...state];
            const newGallery = action.gallery;
            if (!_.isEmpty(action.gallery.parentId)) {
                const parentIndex = _.findIndex(state, {id: action.gallery.parentId});
                const parent = newState[parentIndex];
                if (_.isUndefined(parent.children)) {
                    parent.children = [newGallery];
                } else {
                    parent.children.push(newGallery);
                    parent.children = _.sortBy(parent.children, ['name']);
                }
                newState[parentIndex] = parent;
            } else {
                newState.push(newGallery);
                newState = _.sortBy(newState, ['name']);
            }
            return newState;
        case 'UPDATE_GALLERY':
            if (!_.isEmpty(action.parentId)) {
                let parentIndex = _.findIndex(state, {id: action.parentId});
                index = _.findIndex(state[parentIndex].children, {id: action.id});
                newState = update(state, {[parentIndex]: {children: {[index]: {name: {$set: action.name}}}}});
            } else {
                index = _.findIndex(state, {id: action.id});
                newState = update(state, {[index]: {name: {$set: action.name}}});
            }
            return newState;
        case 'DELETE_GALLERY':
            newState = [...state];
            if (!_.isEmpty(action.parentId)) {
                let parentIndex = _.findIndex(newState, {id: action.parentId});
                _.remove(newState[parentIndex].children, {id: action.id});
            } else {
                _.remove(newState, {id: action.id});
            }
            return newState;
        default:
            return state;
    }
}
