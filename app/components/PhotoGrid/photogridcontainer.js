import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as PhotoGridActions from './photogridactions';
import PhotoGrid from './photogrid';

const mapStateToProps = (state) => {
    return {
        photoGrid: state.photoGrid,
        gallery: state.gallery,
        photos: state.photos,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(PhotoGridActions, dispatch)
    }
}

const PhotoGridContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(PhotoGrid);

export default PhotoGridContainer;