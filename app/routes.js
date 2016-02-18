import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/index';
import Galleries from './components/galleries/galleriescontainer';
import Photos from './components/photos/photoscontainer';

export default (
    <Route name="app" component={App} path="/">
        <IndexRoute component={Galleries}/>
        <Route path="/gallery/:galleryId" components={{sidebar: Galleries, content: Photos}}/>
    </Route>   
);