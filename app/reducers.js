import { combineReducers } from 'redux';
import galleries from './components/galleries/galleriesreducers';
import photos from './components/photos/photosreducers';

const rootReducer = combineReducers({
    galleries,
    photos
});

export default rootReducer;