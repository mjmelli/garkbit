import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as GalleriesPanelActions from './galleriespanelactions';
import GalleriesPanel from './galleriespanel';

function mapStateToProps (state) {
    return {
        galleryPanel: state.galleryPanel,
        galleries: state.galleries
    }
}

function mapDispatchToProps (dispatch) {
    return {
        actions: bindActionCreators(GalleriesPanelActions, dispatch)
    }
}

const GalleriesPanelContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(GalleriesPanel);

export default GalleriesPanelContainer;
