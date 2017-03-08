import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { updateGallery, deleteGallery } from '../../../modules/Gallery/galleryactions.js';

class GalleryHeader extends React.Component {
    constructor (props) {
        super(props);
        this.state = { isEditing: false };
    }

    startEdit = () => {
        this.setState({ 'name': this.props.gallery.name, 'isEditing': true });
    }

    handleChange = (e) => {
        this.setState({ 'name': e.target.value });
    }

    handleUpdate = (e) => {
        e.preventDefault();
        this.props.updateGallery(this.props.gallery.id, this.state.name, this.props.gallery.parentId);
        this.setState({ 'isEditing': false });
    }

    handleDelete = (e) => {
        this.props.deleteGallery(this.props.gallery.id, this.props.gallery.parentId);
    }

    render () {
        if (this.state.isEditing) {
            return (
                <div className="gallery">
                    <input type="text" value={this.state.name} onChange={this.handleChange} />
                    <input type="submit" value="Change" onClick={this.handleUpdate} />
                </div>
            );
        } else {
            return (
                <div className="gallery">
                    <span onClick={this.startEdit}>{this.props.gallery.name}</span>
                    <a className="galleryDelete" onClick={this.handleDelete}>x</a>
                </div>
            );
        }
    }
}

GalleryHeader.PropTypes = {
    gallery: PropTypes.object.isRequired,
    updateGallery: PropTypes.func.isRequired,
    deleteGallery: PropTypes.func.isRequired,
};

GalleryHeader = connect(
    (state, ownProps) => ownProps,
    { updateGallery, deleteGallery }
)(GalleryHeader);

export default GalleryHeader;
