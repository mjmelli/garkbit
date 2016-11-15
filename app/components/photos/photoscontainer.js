import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as PhotosActions from './photosactions';
import Photos from './photos';

/*
class PhotoContainer extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { galleryId, gallery, photos, actions } = this.props
        return (
            <Photos galleryId={galleryId} gallery={gallery} photos={photos} actions={actions} />
        );
    }
}
*/

const mapStateToProps = (state) => {
    return {
        gallery: state.gallery,
        photos: state.photos
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(PhotosActions, dispatch)
    }
}

const PhotoContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Photos);

export default PhotoContainer;