import _ from 'lodash';
import React, { PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import { StyleSheet, css } from 'aphrodite';
import { Button, Modal, Glyphicon, ButtonToolbar, Dropdown, MenuItem } from 'react-bootstrap';
import { DragSource, DropTarget } from 'react-dnd';
import Thumbnail from '../../Thumbnail/thumbnail';
import Confirm from '../../Confirm/confirm';
import { sortPhoto, movePhoto, deletePhoto, togglePhotoSelect } from '../../../modules/Photos/photosactions';
import { toggleCannotSortDialog } from '../photogridactions';

const ItemTypes = {
    PHOTO: 'photo'
};

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
            props.movePhoto(monitor.getItem().i, originalIndex);
        }
    },
};

const photoTarget = {
    canDrop(props, monitor) {
        if (!monitor.getItem().canSort) {
            //return false;
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
    drop(props) {
        if (!props.canSort) {
            props.toggleCannotSortDialog();
            return;
        }
        return { 'target': { 'type': 'photo', 'id': props.photo.id } };
    }
};

function collectPhotoSource(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    }
}

function collectPhotoTarget(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
    };
}

class GridThumbnail extends React.Component {
    constructor (props) {
        super(props);
        this.state = { 'showMenu': false, 'showRemoveConfirm': false };
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.isDragging) {
            this.setState({ 'showMenu': false });
        }
    }

    handleDelete = (e) => {
        this.props.deletePhoto(this.props.photo.id);
    }

    toggleSelect = (e) => {
        /*
        console.log(e.target.parentNode, e.currentTarget);
        if (e.target !== e.currentTarget && e.target.parentNode !== e.currentTarget && e.target.parentNode.parentNode !== e.currentTarget) {
            return false;
        }
        */
        this.props.togglePhotoSelect(this.props.photo.id);
    }

    showMenu = (e) => {
        this.setState({ 'showMenu': true });
    }

    hideMenu = (e) => {
        this.setState({ 'showMenu': false });
    }

    toggleRemoveConfirm = (e) => {
        if (!this.state.showRemoveConfirm) {
            this.setState({ 'showRemoveConfirm': true });
        } else {
            this.setState({ 'showRemoveConfirm': false });
        }
    }

    render() {
        const { galleryId, photo, i, connectDragSource, connectDropTarget, isDragging, isOver, canDrop } = this.props;

        return connectDragSource(connectDropTarget(
            <div className={css(styles.photo)} onMouseEnter={this.showMenu} onMouseLeave={this.hideMenu}>
                <Thumbnail photo={photo} isDragging={isDragging} canDrop={canDrop} onImageClick={this.toggleSelect} />
                <Confirm
                    show={this.state.showRemoveConfirm}
                    onConfirm={this.handleDelete}
                    onCancel={this.toggleRemoveConfirm}
                    showActionButton={false}
                    body="Are you sure you want to remove this photo from this gallery?"
                    confirmText="Remove"
                    title="Remove Photo from Gallery">
                </Confirm>
                {this.state.showMenu &&
                    <div className={css(styles.photoMenu)}>
                        <ButtonToolbar>
                            <Dropdown id={`dropdown-custom-${photo.id}`} pullRight>
                                <Dropdown.Toggle bsSize="xsmall">
                                    <Glyphicon glyph="tasks" />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <MenuItem eventKey="1"><span onClick={this.toggleRemoveConfirm}>Remove from Gallery</span></MenuItem>
                                </Dropdown.Menu>
                            </Dropdown>
                        </ButtonToolbar>
                    </div>
                }
            </div>
        ), { dropEffect: 'move' });
    }
}

GridThumbnail.propTypes = {
    galleryId: PropTypes.string,
    photo: PropTypes.object.isRequired,
    i: PropTypes.number.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    canSort: PropTypes.bool.isRequired,
}

GridThumbnail = DragSource(ItemTypes.PHOTO, photoSource, collectPhotoSource)(GridThumbnail);
GridThumbnail = DropTarget(ItemTypes.PHOTO, photoTarget, collectPhotoTarget)(GridThumbnail);

GridThumbnail = connect(
    (state, ownProps) => ownProps,
    { deletePhoto, togglePhotoSelect, movePhoto, sortPhoto, toggleCannotSortDialog }
)(GridThumbnail);

export default GridThumbnail;

const styles = StyleSheet.create({
    photo: {
        position: 'relative',
        float: 'left',
        marginTop: 0,
        marginLeft: 0,
        marginRight: 10,
        marginBottom: 10,
        ':focus': {
            outline: 'none',
            boxShadow: 'none',
        }
    },
    photoMenu: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    photoDeleteButton: {
    },
});
