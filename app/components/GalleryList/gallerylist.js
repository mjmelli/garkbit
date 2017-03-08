import _ from 'lodash';
import React, { PropTypes } from 'react';
import GalleryListItem from './GalleryListItem/gallerylistitem';

const GalleryList = (props) => {
    let galleries = props.data.map(function(gallery) {
        let subGalleries = [];
        if (!_.isUndefined(gallery.children)) {
            subGalleries = gallery.children.map(function(sub) {
                return (
                    <GalleryListItem gallery={sub} key={sub.id} />
                );
            });
        }
        return (
            <GalleryListItem gallery={gallery} key={gallery.id}>
                {subGalleries}
            </GalleryListItem>
        );
    });
    return (
        <ul className="gallery-list">
            {galleries}
        </ul>
    );
}

GalleryList.PropTypes = {
    data: PropTypes.array.isRequired,
};

export default GalleryList;
