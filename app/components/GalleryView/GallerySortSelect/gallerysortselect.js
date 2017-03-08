import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { updateGallerySort } from './gallerysortselectactions';

class GallerySortSelector extends React.Component {
    constructor (props) {
        super(props);
    }

    handleChange = (e) => {
        e.preventDefault();
        this.props.updateGallerySort(this.props.gallery.id, this.refs.gallerySortSelector.value);
        return false;
    }

    render () {
        const props = this.props;

        return (
            <form>
                <select value={props.gallery.sortBy} ref="gallerySortSelector" onChange={this.handleChange}>
                    <option value="date">Photo Date</option>
                    <option value="filename">Filename</option>
                    {!props.gallery.isSet &&
                        <option value="pos">Custom</option>
                    }
                </select>
            </form>
        )
    }
}

GallerySortSelector.PropTypes = {
    gallery: PropTypes.object.isRequired,
};

GallerySortSelector = connect(
    (state, ownProps) => ownProps,
    {updateGallerySort}
)(GallerySortSelector);

export default GallerySortSelector;
