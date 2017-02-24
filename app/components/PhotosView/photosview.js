import _ from 'lodash';
import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as PhotosViewActions from './photosviewactions';
import { GridPhoto } from '../PhotoGrid/photogrid';

class PhotosView extends React.Component {
    constructor (props) {
        super(props);
        props.actions.loadPhotos();
    }

    render () {
        const props = this.props;

        const photos = props.photos.map(function(photo, i) {
            return (
                <GridPhoto key={photo.id} galleryId={null} photo={photo} i={i} canSort={false} />
            );
        });

        return (
            <div id="gallery-view">
                <div className="gallery">
                    <span>All Photos</span>
                </div>
                {photos}
            </div>
        );

    }
}

const mapStateToProps = (state) => {
    return {
        photos: state.photos,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(PhotosViewActions, dispatch)
    }
}

export default PhotosView = connect(
    mapStateToProps,
    mapDispatchToProps
)(PhotosView);
