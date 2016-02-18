import React from 'react';
import { Router, Route, Link } from 'react-router';

class Gallery extends React.Component {
    constructor (props) {
        super(props);
        this.state = { id: this.props.gallery.id, name: this.props.gallery.name, isEdting: false };
        this.startEdit = this.startEdit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }
    
    startEdit () {
        this.setState({'isEditing': true});
    }
    
    handleChange (e) {
        this.setState({name: e.target.value});
    }
    
    handleUpdate (e) {
        e.preventDefault();
        this.setState({'isEditing': false});
        this.props.onGalleryUpdate(this.state.id, this.state.name);
    }
    
    handleDelete (e) {
        this.props.onGalleryDelete(this.state.id);
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
                    <span onClick={this.startEdit}>{this.state.name}</span>
                    <Link to={"/gallery/" + this.state.id}>Go</Link>
                    <a className="galleryDelete" onClick={this.handleDelete}>x</a>
                </div>        
            );
        }
    }
}

class GalleryList extends React.Component {
    render () {
        let props = this.props;
        let galleries = this.props.data.map(function(gallery) {
            return (
                <Gallery gallery={gallery} key={gallery.id} onGalleryUpdate={props.onGalleryUpdate} onGalleryDelete={props.onGalleryDelete}>
                </Gallery>
            );
        });
        return (
            <div className="gallery-list">
                {galleries}
            </div> 
        );
    }
}

class GalleryForm extends React.Component {
    constructor () {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleSubmit (e) {
        e.preventDefault();
        let name = this.refs.galleryNameInput.value.trim();
        if (!name) {
            return;
        }
        this.refs.galleryNameInput.value = '';
        this.props.onGallerySubmit(name);
    }
    
    render () {
        return (
            <form className="gallery-form" onSubmit={this.handleSubmit}>
                <input type="text" placeholder="Gallery Name" ref="galleryNameInput" />
                <input type="submit" value="Add Gallery" />
            </form>
        );
    }
}

class Galleries extends React.Component {
    constructor (props, context) {
        super(props, context);
        this.handleGallerySubmit = this.handleGallerySubmit.bind(this);
        this.handleGalleryUpdate = this.handleGalleryUpdate.bind(this);
        this.handleGalleryDelete = this.handleGalleryDelete.bind(this);
    }
    
    handleGallerySubmit (name) {
        this.props.actions.addGallery(name);
    }
    
    handleGalleryUpdate (id, name) {
        this.props.actions.updateGallery(id, name);
    }
    
    handleGalleryDelete (id) {
        this.props.actions.deleteGallery(id);
    }  
    
    render () {
        return (
            <div id="gallery-panel">
                <h1>Galleries</h1>
                <GalleryForm onGallerySubmit={this.handleGallerySubmit} />  
                <GalleryList data={this.props.galleries} onGalleryUpdate={this.handleGalleryUpdate} onGalleryDelete={this.handleGalleryDelete} />
            </div>
        );
    }
}

export default Galleries;