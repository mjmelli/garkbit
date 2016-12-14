import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/index';
import GalleriesPanel from './components/GalleriesPanel/galleriespanelcontainer';
import GalleryView from './components/GalleryView/galleryviewcontainer';

export default (
    <Route name="app" component={App} path="/">
        <IndexRoute components={{sidebar: GalleriesPanel}}/>
        <Route path="/gallery/:galleryId" components={{sidebar: GalleriesPanel, content: GalleryView}}/>
    </Route>
);