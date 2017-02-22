import { combineReducers } from 'redux';
import gallery from './components/GalleryView/galleryviewreducers';
import { galleryPanel, galleries } from './components/GalleriesPanel/galleriespanelreducers';
import { photoGrid, photos } from './components/PhotoGrid/photogridreducers';

const rootReducer = combineReducers({
    gallery,
    galleryPanel,
    galleries,
    photoGrid,
    photos,
});

export default rootReducer;
