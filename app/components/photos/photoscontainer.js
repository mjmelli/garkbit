import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as PhotosActions from './photosactions';
import Photos from './photos';

class PhotoContainer extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { galleryId, photos, actions } = this.props
        return (
            <Photos galleryId={galleryId} photos={photos} actions={actions} />
        );
    }
}

function mapStateToProps (state, props) {
    return {
        galleryId: props.params.galleryId,
        photos: state.photos
    }
}

function mapDispatchToProps (dispatch) {
    return {
        actions: bindActionCreators(PhotosActions, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PhotoContainer);