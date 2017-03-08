import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/index';
import PhotosView from './components/PhotosView/photosview';
import GalleriesPanel from './components/GalleriesPanel/galleriespanel';
import GalleryView from './components/GalleryView/galleryview';

export default (
    <Route name="app" component={ App } path="/">
        <IndexRoute components={{ sidebar: GalleriesPanel }} />
        <Route path="/photos" components={{ sidebar: GalleriesPanel, content: PhotosView }} />
        <Route path="/gallery/:galleryId" components={{ sidebar: GalleriesPanel, content: GalleryView }} />
    </Route>
);
