import { combineReducers } from 'redux';
import gallery from './modules/Gallery/galleryreducers';
import galleries from './modules/Galleries/galleriesreducers';
import photos from './modules/Photos/photosreducers';
import galleriesPanel from './components/GalleriesPanel/galleriespanelreducers';
import photoGrid from './components/PhotoGrid/photogridreducers';

const rootReducer = combineReducers({
    gallery,
    galleries,
    photos,
    galleriesPanel,
    photoGrid,
});

export default rootReducer;
