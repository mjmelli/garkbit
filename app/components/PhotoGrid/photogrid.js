import _ from 'lodash';
import React, { PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import { StyleSheet, css } from 'aphrodite';
import { Button, Modal } from 'react-bootstrap';
import { sortPhoto, movePhoto, deletePhoto, togglePhotoSelect, toggleCannotSortDialog } from './photogridactions';
import { DragSource, DropTarget } from 'react-dnd';
import Confirm from '../Confirm/confirm';

const ItemTypes = {
    PHOTO: 'photo'
};

class Photo extends React.Component {
    constructor (props) {
        super(props);
        this.state = { id: this.props.photo.id, name: this.props.photo.fn };
    }

    handleDelete = (e) => {
        this.props.deletePhoto(this.props.photo.id);
    }

    toggleSelect = (e) => {
        e.stopPropagation();
        this.props.togglePhotoSelect(this.props.photo.id);
    }

    render () {
        const props = this.props;

        let style;
        if (props.photo.isSelected) {
            style = { border: '1px solid black' };
        }

        return (
            <div style={style}>
                <img data-id={props.photo.id} src={'/images/photos/' + this.props.photo.sizes.thumb.uri} alt={this.props.photo.fn} onClick={this.toggleSelect}/>
                <Confirm
                    onConfirm={this.handleDelete}
                    body="Are you sure you want to delete this photo?"
                    confirmText="Delete"
                    title="Delete Photo">
                    <Button className={css(styles.photoDeleteButton)} onClick={this.handleDelete}>X</Button>
                </Confirm>
            </div>
        );
    }
}
Photo.propTypes = {
    photo: PropTypes.object.isRequired,
};
Photo = connect(
    (state, ownProps) => ownProps,
    {deletePhoto, togglePhotoSelect}
)(Photo);

const photoSource = {
    beginDrag(props) {
        return {
            photoId: props.photo.id,
            galleryId: props.galleryId,
            i: props.i,
            originalIndex: props.i,
            canSort: props.canSort,
        };
    },
    endDrag(props, monitor) {
        console.log('ending drag');
        const { originalIndex } = monitor.getItem();
        const didDrop = monitor.didDrop();
        const dropResult = monitor.getDropResult();

        if (didDrop && !_.isUndefined(dropResult.target) && dropResult.target.type === 'photo') {
            if (props.i === originalIndex) {
                return;
            }
            let direction = 'after';
            if (monitor.getItem().dragIndex > props.i) {
                direction = 'before';
            }
            const draggedPhotoId = monitor.getItem().photoId;
            const targetPhotoId = monitor.getItem().targetId;
            props.sortPhoto(props.galleryId, draggedPhotoId, targetPhotoId, direction);
        } else {
            if (!monitor.getItem().canSort) {
                props.toggleCannotSortDialog();
            }
            props.movePhoto(monitor.getItem().i, originalIndex);
        }
    },
};

const photoTarget = {
    canDrop(props, monitor) {
        if (!monitor.getItem().canSort) {
            return false;
        }
        return true;
    },
    hover(props, monitor, component) {
        const dragIndex = monitor.getItem().i;
        const hoverIndex = props.i;
        const hoverPhotoId = props.photo.id;
        if (dragIndex === hoverIndex) {
            return;
        }
        // Determine rectangle on screen
        const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
        // Get horizontal middle
        const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
        // Determine mouse position
        const clientOffset = monitor.getClientOffset();
        // Get pixels to the left
        const hoverClientX = clientOffset.x - hoverBoundingRect.left;
        // Only perform the move when the mouse has crossed half of the items width
        // When dragging right, only move when the cursor is below 50%
        // When dragging left, only move when the cursor is above 50%
        // Dragging right
        if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
          return;
        }
        // Dragging left
        if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
          return;
        }
        props.movePhoto(dragIndex, hoverIndex);
        monitor.getItem().i = hoverIndex;
        monitor.getItem().targetId = hoverPhotoId;
        monitor.getItem().dragIndex = dragIndex;
    },
    drop(target) {
        return { 'target': { 'type': 'photo', 'id': target.photo.id } };
    }
};

function collectPhotoSource(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

function collectPhotoTarget(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    };
}

class GridPhoto extends React.Component {
    render() {
        const { galleryId, photo, i, connectDragSource, connectDropTarget, isDragging, isOver } = this.props;
        const opacity = isDragging ? 0 : 1;

        return connectDragSource(connectDropTarget(
            <div className={css(styles.photo)} style={{ opacity }}>
                <Photo photo={photo} />
            </div>
        ));
    }
}
GridPhoto.propTypes = {
    galleryId: PropTypes.string.isRequired,
    photo: PropTypes.object.isRequired,
    i: PropTypes.number.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    isOver: PropTypes.bool.isRequired,
    canSort: PropTypes.bool.isRequired,
}
GridPhoto = DragSource(ItemTypes.PHOTO, photoSource, collectPhotoSource)(GridPhoto);
GridPhoto = DropTarget(ItemTypes.PHOTO, photoTarget, collectPhotoTarget)(GridPhoto);
GridPhoto = connect(
    (state, ownProps) => ownProps,
    {movePhoto, sortPhoto, toggleCannotSortDialog}
)(GridPhoto);

class PhotoGrid extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            'showConfirmDeleteDialog': false,
            'confirmDeleteDialogBody': "Are you sure you want to delete the selected photos?"
        };
    }

    componentWillReceiveProps(nextProps) {
        /* Reload if we've changed galleries
           OR if we've changed the sort method for a gallery
           BUT NOT if we've deleted the gallery
        */
        if (
            (nextProps.gallery.id !== this.props.gallery.id && !_.isUndefined(nextProps.gallery.id))
            || nextProps.gallery.sortBy !== this.props.gallery.sortBy
        ) {
            this.props.actions.loadPhotos(nextProps.gallery.id);
        }
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
            props.actions.deletePhoto(p.id);
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
                <GridPhoto key={photo.id} galleryId={props.gallery.id} photo={photo} i={i} canSort={canSort} />
            );
        });

        return (
            <div className="photo-grid" tabIndex="0" onKeyUp={this.handleDeleteKeyPress}>
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
                <Modal show={props.photoGrid.showCannotSortDialog} onHide={props.actions.toggleCannotSortDialog} >
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
export default PhotoGrid;

const styles = StyleSheet.create({
    photo: {
        position: 'relative',
        float: 'left',
        marginRight: '10px',
    },
    photoDeleteButton: {
        position: 'absolute',
        width: 20,
        height: 20,
        top: 10,
        right: 10,
        backgroundColor: '#880000',
        border: '1px solid #aaaaaa',
        color: 'white',
        textAlign: 'center',
        cursor: 'pointer',
    },
    photoPlaceholder: {
        position: 'relative',
        float: 'left',
        width: 150,
        height: 100,
        backgroundColor: '#aaaaaa',
        marginRight: '10px',
        display: 'none',
    }
});
