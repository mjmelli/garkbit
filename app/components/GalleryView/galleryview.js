import React from 'react';
import PhotoGridContainer from '../PhotoGrid/photogridcontainer';

class GalleryHeader extends React.Component {
    constructor (props) {
        super(props);
        this.state = { isEditing: false };
        this.startEdit = this.startEdit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }
    
    startEdit () {
        this.setState({'name': this.props.gallery.name, 'isEditing': true});
    }
    
    handleChange (e) {
        this.setState({'name': e.target.value});
    }
    
    handleUpdate (e) {
        e.preventDefault();
        this.props.onGalleryUpdate(this.props.gallery.id, this.state.name);
        this.setState({'isEditing': false});
    }
    
    handleDelete (e) {
        this.props.onGalleryDelete(this.props.gallery.id);
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

class GalleryView extends React.Component {
    constructor (props, context) {
        super(props, context);
        this.handleGalleryUpdate = this.handleGalleryUpdate.bind(this);
        this.props.actions.loadGallery(props.params.galleryId);
    }
    
    componentWillReceiveProps(nextProps) {
        if (nextProps.params.galleryId !== this.props.params.galleryId) {
            this.props.actions.loadGallery(nextProps.params.galleryId);
        }
    }    
    
    handleGalleryUpdate (id, name) {
        this.props.actions.updateGallery(id, name);
    }    
    
    render () {
        return (
            <div id="gallery-view">
                <GalleryHeader gallery={this.props.gallery} onGalleryUpdate={this.handleGalleryUpdate} />
                <PhotoGridContainer />
            </div>
        );
    }
}

export default GalleryView;