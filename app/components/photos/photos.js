import React from 'react';

class Photo extends React.Component {
    constructor (props) {
        super(props);
        this.state = { id: this.props.photo.id, name: this.props.photo.fn, isEdting: false };
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
        this.props.onPhotoUpdate(this.props.photo.id, this.props.photo.fn);
    }
    
    handleDelete (e) {
        this.props.onPhotoDelete(this.props.photo.id);
    }
    
    render () {
        if (this.state.isEditing) {
            return (
                <div className="photo">
                    <input type="text" value={this.state.name} onChange={this.handleChange} />
                    <input type="submit" value="Change" onClick={this.handleUpdate} />
                </div>
            );
        } else { 
            return (    
                <div className="photo">
                    <img src={'/images/photos/' + this.props.photo.sizes.thumb.uri} alt={this.props.photo.fn}/>
                    <span onClick={this.startEdit}>{this.props.photo.fn}</span>
                    <a className="photoDelete" onClick={this.handleDelete}>x</a>
                </div>        
            );
        }
    }
}

class PhotoList extends React.Component {
    render () {
        let props = this.props;
        let photos = this.props.data.map(function(photo) {
            return (
                <Photo key={photo.id} photo={photo} onPhotoUpdate={props.onPhotoUpdate} onPhotoDelete={props.onPhotoDelete}>
                </Photo>
            );
        });
        return (
            <div className="photo-list">
                {photos}
            </div> 
        );
    }
}

class PhotoForm extends React.Component {
    constructor () {
        super();
        this.state = {file: '', imagePreviewUrl: ''};
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleSubmit (e) {
        e.preventDefault();
        
        let reader = new FileReader();
        let file = this.refs.photoInput.files[0];

        reader.onloadend = () => {
            this.setState({
                file: file,
                imagePreviewUrl: reader.result
            });
            this.props.onPhotoSubmit(file, this.props.galleryId);
        }

        reader.readAsDataURL(file);
    }
    
    render () {
        return (
            <form className="photo-form" onSubmit={this.handleSubmit} type="multipart/form-data">
                <input type="file" placeholder="Photo" ref="photoInput" />
                <input type="submit" value="Add Photo" />
            </form>
        );
    }
}

class Photos extends React.Component {
    constructor (props, context) {
        super(props, context);
        this.handlePhotoSubmit = this.handlePhotoSubmit.bind(this);
        this.handlePhotoUpdate = this.handlePhotoUpdate.bind(this);
        this.handlePhotoDelete = this.handlePhotoDelete.bind(this);
    }
    
    componentWillMount() {
        this.props.actions.loadGallery(nextProps.galleryId);
    }
    
    componentWillReceiveProps(nextProps) {
        if (nextProps.galleryId !== this.props.galleryId) {
            this.props.actions.loadGallery(nextProps.galleryId);
            this.props.actions.loadPhotos(nextProps.galleryId);
        }
    }    
    
    handlePhotoSubmit (file, galleryId) {    
        this.props.actions.addPhoto(file, galleryId);
    }
    
    handlePhotoUpdate (id, name) {
        this.props.actions.updatePhoto(id, name);
    }
    
    handlePhotoDelete (id) {
        this.props.actions.deletePhoto(id);
    }  
    
    render () {
        return (
            <div id="photos-panel">
                <h1>Gallery: {this.props.photos.gallery.name}</h1>
                <PhotoForm galleryId={this.props.galleryId} onPhotoSubmit={this.handlePhotoSubmit} />  
                <PhotoList galleryId={this.props.galleryId} data={this.props.photos.photos} onPhotoUpdate={this.handlePhotoUpdate} onPhotoDelete={this.handlePhotoDelete} />
            </div>
        );
    }
}

export default Photos;