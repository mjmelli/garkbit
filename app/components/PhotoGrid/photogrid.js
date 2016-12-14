import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, css } from 'aphrodite';
import AddPhoto from '../AddPhoto/addPhoto';
import { sortPhoto, addSortPlaceholder } from './photogridactions';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

class Photo extends React.Component {
    constructor (props) {
        super(props);
        this.setState({ id: this.props.photo.id, name: this.props.photo.fn, isEdting: false });
    }

    startEdit = () => {
        this.setState({'isEditing': true});
    }

    handleChange = (e) => {
        this.setState({name: e.target.value});
    }

    handleUpdate = (e) => {
        e.preventDefault();
        this.setState({'isEditing': false});
        this.props.onPhotoUpdate(this.props.photo.id, this.props.photo.fn);
    }

    handleDelete = (e) => {
        this.props.onPhotoDelete(this.props.photo.id);
    }

    dragStart = (e) => {
        e.stopPropagation();
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData("text", e.target.dataset.id);
    }

    render () {
        const props = this.props;

        if (this.state.isEditing) {
            return (
                <div className={css(styles.photo)}>
                    <input type="text" value={this.state.name} onChange={this.handleChange} />
                    <input type="submit" value="Change" onClick={this.handleUpdate} />
                </div>
            );
        } else if (props.photo.id === 'placeholder') {
            return (
                <div data-id="placeholder" className={css(styles.placeholder)}></div>
            );
        } else {
            return (
                <div data-id={props.photo.id} draggable="true" onDragStart={this.dragStart} className={css(styles.photo)}>
                    <img data-id={props.photo.id} src={'/images/photos/' + this.props.photo.sizes.thumb.uri} alt={this.props.photo.fn}/>
                    <a className={css(styles.photoDeleteButton)} onClick={this.handleDelete}>X</a>
                </div>
            );
        }
    }
}

class PhotoList extends React.Component {
    constructor (props) {
        super(props);
    }

    handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move"
        //e.target.style.paddingLeft = '10px';
        e.target.
        if (e.target.dataset.id !== 'placeholder') {
            this.props.addSortPlaceholder(e.target.dataset.id);
        }
    }

    handleDragLeave = (e) => {
        e.preventDefault();
        //e.target.style.paddingLeft = '0';
    }

    handleDrop = (e) => {
        e.preventDefault();
        const data = e.dataTransfer.getData("text");
        //e.target.style.paddingLeft = '0';
        this.props.sortPhoto(data, e.target.dataset.id);
    }

    render () {
        const props = this.props;

        const photos = props.data.map(function(photo, i) {
            return (
                <Photo key={photo.id} photo={photo} onPhotoUpdate={props.onPhotoUpdate} onPhotoDelete={props.onPhotoDelete}>
                </Photo>
            );
        });
        return (
            <div className="photo-list" onDragOver={this.handleDragOver} onDragLeave={this.handleDragLeave} onDrop={this.handleDrop}>
                {photos}
                <div className={css(styles.photoPlaceholder)} ref="photoPlaceholder"></div>
            </div>
        );
    }
}
PhotoList = connect(
    (state, ownProps) => ownProps,
    {sortPhoto, addSortPlaceholder}
)(PhotoList);

class PhotoGrid extends React.Component {
    constructor (props, context) {
        super(props, context);
        //this.props.actions.loadGallery(props.galleryId);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.galleryId !== this.props.galleryId) {
            this.props.actions.loadPhotos(nextProps.galleryId);
        }
    }

    handlePhotoUpdate = (id, name) => {
        this.props.actions.updatePhoto(id, name);
    }

    handlePhotoDelete = (id) => {
        this.props.actions.deletePhoto(id);
    }

    render () {
        return (
            <div id="photo-grid">
                <AddPhoto galleryId={this.props.galleryId} />
                <PhotoList data={this.props.photos} onPhotoUpdate={this.handlePhotoUpdate} onPhotoDelete={this.handlePhotoDelete} />
            </div>
        );
    }
}


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

export default PhotoGrid;
