import _ from 'lodash';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { StyleSheet, css } from 'aphrodite';
import { Button, Modal } from 'react-bootstrap';
import { DropTarget } from 'react-dnd';
import { toggleAddGalleryModal, addGallery, updateGallery, deleteGallery, addPhotoToGallery } from './galleriespanelactions';
import Confirm from '../Confirm/confirm';

const ItemTypes = {
    PHOTO: 'photo'
};

function collectPhotoTarget(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver({ shallow: true }),
        canDrop: monitor.canDrop(),
    };
}

const photoTarget = {
    canDrop(props, monitor) {
        if (props.gallery.isSet) {
            return false;
        }
        return true;
    },
    drop(props, monitor, component) {
        if (!monitor.didDrop()) {
            props.addPhotoToGallery(monitor.getItem().photoId, props.gallery.id);
        }
        return;
    },
};

class GalleryListItem extends React.Component {
    constructor (props) {
        super(props);
        this.state = {name: this.props.gallery.name, isEditing: false};
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.gallery.name !== this.props.gallery.name) {
            this.setState({name: nextProps.gallery.name});
        }
    }

    startEdit = (e) => {
        this.setState({isEditing: true});
    }

    handleChange = (e) => {
        this.setState({name: e.target.value});
    }

    handleUpdate = (e) => {
        e.preventDefault();
        this.setState({isEditing : false});
        this.props.updateGallery(this.props.gallery.id, this.state.name, this.props.gallery.parentId);
    }

    handleDelete = () => {
        this.props.deleteGallery(this.props.gallery.id, this.props.gallery.parentId);
    }

    render () {
        const { gallery, children, connectDropTarget, isOver, canDrop } = this.props;

        const color = isOver && !canDrop ? 'red' : 'black';

        if (this.state.isEditing) {
            return (
                <li className="gallery">
                    <input type="text" value={this.state.name} onChange={this.handleChange}/>
                    <input type="submit" value="Change" onClick={this.handleUpdate} />
                </li>
            );
        } else {
            return connectDropTarget(
                <li className="gallery">
                    <span onClick={this.startEdit} style={{ color }}>{this.state.name}</span>
                    <Link to={"/gallery/" + gallery.id}>Go</Link>
                    <Confirm
                        onConfirm={this.handleDelete}
                        body="Are you sure you want to delete this gallery?"
                        confirmText="Delete"
                        title="Delete Gallery">
                        <button>Delete</button>
                    </Confirm>
                    {typeof children !== 'undefined' &&
                        <ul>
                            {children}
                        </ul>
                    }
                </li>
            );
        }
    }
}
GalleryListItem.propTypes = {
    gallery: PropTypes.object.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
}
GalleryListItem = DropTarget(ItemTypes.PHOTO, photoTarget, collectPhotoTarget)(GalleryListItem);
GalleryListItem = connect(
    (state, ownProps) => ownProps,
    {updateGallery, deleteGallery, addPhotoToGallery}
)(GalleryListItem);

class GalleryList extends React.Component {
    render () {
        let props = this.props;
        let galleries = this.props.data.map(function(gallery) {
            let subGalleries = [];
            if (!_.isUndefined(gallery.children)) {
                subGalleries = gallery.children.map(function(sub) {
                    return (
                        <GalleryListItem gallery={sub} key={sub.id}>
                        </GalleryListItem>
                    );
                });
            }
            return (
                <GalleryListItem gallery={gallery} key={gallery.id}>
                    {subGalleries}
                </GalleryListItem>
            );
        });
        return (
            <ul className="gallery-list">
                {galleries}
            </ul>
        );
    }
}

class GalleryForm extends React.Component {
    constructor () {
        super();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let name = this.refs.galleryNameInput.value.trim();
        let parentGallery = this.refs.parentGallerySelect.value;
        let isSet = this.refs.isSet.value;
        if (!name) {
            return;
        }
        this.refs.galleryNameInput.value = '';
        this.refs.parentGallerySelect.value = '';
        this.props.addGallery(name, parentGallery, isSet);
    }

    render () {
        const props = this.props;
        let title = 'Add Gallery';
        if (props.addSet) {
            title = 'Add Gallery Set';
        }
        const parentGalleryOptions = props.galleries.filter(g => g.isSet)
            .map(function(gallery) {
                return (
                    <option value={gallery.id} key={gallery.id}>{gallery.name}</option>
                );
            });
        return (
            <Modal show={props.show} onHide={props.toggleAddGalleryModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className="gallery-form" onSubmit={this.handleSubmit}>
                        <input type="text" placeholder="Gallery Name" ref="galleryNameInput" /><br />
                        Add to gallery set:
                        <select name="parentGallery" ref="parentGallerySelect">
                            <option value="">--</option>
                            {parentGalleryOptions}
                        </select><br />
                        <input type="hidden" name="isSet" ref="isSet" value={props.addSet}/>
                        <input type="submit" value="Add Gallery" />
                    </form>
                </Modal.Body>
            </Modal>
        );
    }
}
GalleryForm = connect(
    (state, ownProps) => ownProps,
    {toggleAddGalleryModal, addGallery}
)(GalleryForm);

class GalleriesPanel extends React.Component {
    constructor (props) {
        super(props);
    }

    handleButtonClick = (e) => {
        e.stopPropagation();
        let addSet = false;
        if (e.target.id === 'addGallerySetButton') {
            addSet = true;
        }
        return this.props.actions.toggleAddGalleryModal(addSet);
    }

    render () {
        return (
            <div id="gallery-panel">
                <h1>Galleries</h1>
                <Button bsStyle="primary" bsSize="small" onClick={this.handleButtonClick} id="addGallerySetButton">Add Gallery Set</Button>
                <Button bsStyle="primary" bsSize="small" onClick={this.handleButtonClick} id="addGalleryButton">Add Gallery</Button>
                <GalleryForm show={this.props.galleryPanel.showAddGalleryModal} galleries={this.props.galleries} addSet={this.props.galleryPanel.addSet}/>
                <GalleryList data={this.props.galleries} />
            </div>
        );
    }
}
export default GalleriesPanel;

const styles = StyleSheet.create({
    addGalleryModal: {
        position: 'absolute',
        zIndex: '1000',
        backgroundColor: '#888888',
        width: '500px',
        height: '500px',
        marginLeft: '-250px',
        marginTop: '-250px',
        left: '50%',
        top: '50%',
    }
});
