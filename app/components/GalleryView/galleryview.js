import _ from 'lodash';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import PhotoGrid from '../PhotoGrid/photogrid';
import AddPhoto from '../AddPhoto/addphoto';
import GallerySortSelect from './GallerySortSelect/gallerysortselect';
import GalleryHeader from './GalleryHeader/galleryheader';
import { loadGallery, unloadGallery } from '../../modules/Gallery/galleryactions';
import { loadPhotosByGallery } from '../../modules/Photos/photosactions';

class GalleryView extends React.Component {
    constructor (props, context) {
        super(props, context);
        this.props.loadGallery(props.params.galleryId);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.galleryId !== this.props.params.galleryId) {
            this.props.loadGallery(nextProps.params.galleryId);
        }

        /* Reload if we've changed galleries
           OR if we've changed the sort method for a gallery
           BUT NOT if we've deleted the gallery
        */
        if (
            (nextProps.gallery.id !== this.props.gallery.id && !_.isUndefined(nextProps.gallery.id))
            || nextProps.gallery.sortBy !== this.props.gallery.sortBy
        ) {
            this.props.loadPhotosByGallery(nextProps.gallery.id);
        }
    }

    componentWillUnmount() {
        // Unload the gallery to force a reload when we navigate away (someplace outside of galleries) and then back to this gallery
        this.props.unloadGallery();
    }

    render () {
        const props = this.props;

        return (
            <div id="gallery-view">
                <GalleryHeader gallery={props.gallery} />
                <GallerySortSelect gallery={props.gallery} />
                {!props.gallery.isSet &&
                    <AddPhoto galleryId={props.gallery.id} />
                }
                <PhotoGrid photos={props.photos} gallery={props.gallery} />
            </div>
        );
    }
}

GalleryView.PropTypes = {
    gallery: PropTypes.object.isRequired,
    loadGallery: PropTypes.func.isRequired,
    unloadGallery: PropTypes.func.isRequired,
    photos: PropTypes.array.isRequired,
}

GalleryView = connect(
    (state) => {
        return {
            gallery: state.gallery,
            photos: state.photos,
        };
    },
    { loadGallery, unloadGallery, loadPhotosByGallery }
)(GalleryView);

export default GalleryView;
