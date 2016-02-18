import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as GalleriesActions from './galleriesactions';
import Galleries from './galleries';

class GalleryContainer extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { galleries, actions } = this.props
        return (
            <Galleries galleries={galleries} actions={actions} />
        );
    }
}

function mapStateToProps (state) {
    return {
        galleries: state.galleries
    }
}

function mapDispatchToProps (dispatch) {
    return {
        actions: bindActionCreators(GalleriesActions, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GalleryContainer);