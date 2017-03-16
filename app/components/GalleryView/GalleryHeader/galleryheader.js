import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, css } from 'aphrodite';
import { Button, Modal, Glyphicon } from 'react-bootstrap';
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
                <div className={css(styles.galleryHeader) + ' clear'}>
                    <input type="text" value={this.state.name} onChange={this.handleChange} />
                    <input type="submit" value="Change" onClick={this.handleUpdate} />
                </div>
            );
        } else {
            return (
                <div className={css(styles.galleryHeader) + ' clear'}>
                    <h2 className={css(styles.galleryHeaderTitle)} onClick={this.startEdit}>{this.props.gallery.name}</h2>
                    <div className={css(styles.galleryHeaderOptions)}>
                        <Button bsStyle="danger" bsSize="small" onClick={this.handleDelete}><Glyphicon glyph="trash"/></Button>
                    </div>
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

const styles = StyleSheet.create({
    galleryHeader: {
        backgroundColor: '#fcfcfc',
        borderBottom: '1px solid #f8f8f8',
        padding: '20px',
    },
    galleryHeaderTitle: {
        float: 'left',
        paddingTop: '0.25em',
    },
    galleryHeaderOptions: {
        float: 'right',
        textAlign: 'right',
    }
});
