import { combineReducers } from 'redux';
import gallery from './components/GalleryView/galleryviewreducers';
import { galleryPanel, galleries } from './components/GalleriesPanel/galleriespanelreducers';
import photos from './components/PhotoGrid/photogridreducers';

const rootReducer = combineReducers({
    gallery,
    galleryPanel,
    galleries,
    photos
});

export default rootReducer;
