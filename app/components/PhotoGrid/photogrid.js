import _ from 'lodash';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, css } from 'aphrodite';
import { Button, Modal } from 'react-bootstrap';
import Confirm from '../Confirm/confirm';
import GridThumbnail from './GridThumbnail/gridthumbnail';
import { toggleCannotSortDialog } from './photogridactions';
import { deletePhoto } from '../../modules/Photos/photosactions';

class PhotoGrid extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            'showConfirmDeleteDialog': false,
            'confirmDeleteDialogBody': "Are you sure you want to delete the selected photos?"
        };
    }

    handleDeleteKeyPress = (e) => {
        if (e.keyCode === 46) {
            // Don't allow deleting photos from a gallery set
            if (this.props.gallery.isSet) {
                this.toggleCannotDeleteDialog();
                return false;
            }
            const selectedPhotos = this.props.photos.filter(function (p) {
                return p.isSelected;
            });
            if (selectedPhotos.length > 0) {
                this.setState({
                    'showConfirmDeleteDialog': true,
                    'confirmDeleteDialogBody': 'Are you sure you want to delete ' + selectedPhotos.length + ' selected photos?',
                });
            }
        }
    }

    handleDeleteDialogCancel = () => {
        this.setState({ 'showConfirmDeleteDialog': false });
    }

    handleDelete = () => {
        const props = this.props;

        const selectedPhotos = props.photos.filter(function (p) {
            return p.isSelected;
        });
        selectedPhotos.forEach(function (p) {
            props.deletePhoto(p.id);
        });
        this.setState({ 'showConfirmDeleteDialog': false });
    }

    toggleCannotDeleteDialog = () => {
        if (this.state.showCannotDeleteDialog) {
            this.setState({ 'showCannotDeleteDialog': false });
        } else {
            this.setState({ 'showCannotDeleteDialog': true });
        }
        return;
    }

    render () {
        const props = this.props;

        let canSort = true;
        let cannotSortDialogBody = '';
        if (props.gallery.isSet) {
            canSort = false;
            cannotSortDialogBody = 'Photos cannot be custom sorted in a gallery set. You can sort them in the individual gallery.';
        }
        if (!props.gallery.isSet && props.gallery.sortBy !== 'pos') {
            canSort = false;
            cannotSortDialogBody = 'You must change the sort order for this gallery to "custom" before manually sorting.';
        }

        const photos = props.photos.map(function(photo, i) {
            return (
                <GridThumbnail key={photo.id} galleryId={props.gallery.id} photo={photo} i={i} canSort={canSort} />
            );
        });

        return (
            <div className={css(styles.photoGrid)} tabIndex="0" onKeyUp={this.handleDeleteKeyPress}>
                <Confirm
                    onConfirm={this.handleDelete}
                    onCancel={this.handleDeleteDialogCancel}
                    showActionButton={false}
                    show={this.state.showConfirmDeleteDialog}
                    body={this.state.confirmDeleteDialogBody}
                    confirmText="Delete"
                    title="Delete Photos">
                </Confirm>
                <Modal show={this.state.showCannotDeleteDialog} onHide={this.toggleCannotDeleteDialog} >
                    <Modal.Header closeButton>
                        <Modal.Title>Cannot Remove Photos from Gallery Set</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        You cannot remove photos directly from a gallery set. Remove the photo from
                        the gallery it is in.
                    </Modal.Body>
                </Modal>
                <Modal show={props.photoGrid.showCannotSortDialog} onHide={props.toggleCannotSortDialog} >
                    <Modal.Header closeButton>
                        <Modal.Title>Cannot Sort Photo</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {cannotSortDialogBody}
                    </Modal.Body>
                </Modal>
                {photos}
            </div>
        );
    }
}
export { PhotoGrid };

PhotoGrid.PropTypes = {
    photos: PropTypes.array.isRequired,
    gallery: PropTypes.object,
    deletePhoto: PropTypes.func.isRequired,
    toggleCannotSortDialog: PropTypes.func.isRequired,
}

export default connect(
    (state) => {
        return {
            photoGrid: state.photoGrid,
        };
    },
    { deletePhoto, toggleCannotSortDialog }
)(PhotoGrid);

const styles = StyleSheet.create({
    photoGrid: {
        ':focus': {
            outline: 'none',
            boxShadow: 'none',
        }
    },
});
