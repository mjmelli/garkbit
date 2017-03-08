import _ from 'lodash';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import PhotoGrid from '../PhotoGrid/photogrid';
import { loadAllPhotos } from '../../modules/Photos/photosactions';

class PhotosView extends React.Component {
    constructor (props) {
        super(props);
        props.loadAllPhotos();
    }

    render () {
        const props = this.props;

        return (
            <div id="gallery-view">
                <div className="gallery">
                    <span>All Photos</span>
                </div>
                <PhotoGrid photos={props.photos} />
            </div>
        );

    }
}

PhotosView.PropTypes = {
    photos: PropTypes.array.isRequired,
};

export default connect(
    (state) => {
        return {
            photos: state.photos,
        };
    },
    { loadAllPhotos }
)(PhotosView);
