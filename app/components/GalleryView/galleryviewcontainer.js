import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as GalleryViewActions from './galleryviewactions';
import GalleryView from './galleryview';

const mapStateToProps = (state) => {
    return {
        gallery: state.gallery
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(GalleryViewActions, dispatch)
    }
}

const GalleryViewContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(GalleryView);

export default GalleryViewContainer;