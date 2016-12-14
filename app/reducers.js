import { combineReducers } from 'redux';
import gallery from './components/GalleryView/galleryviewreducers';
import galleries from './components/GalleriesPanel/galleriespanelreducers';
import photos from './components/PhotoGrid/photogridreducers';

const rootReducer = combineReducers({
    gallery,
    galleries,
    photos
});

export default rootReducer;