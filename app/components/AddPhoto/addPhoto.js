import React from 'react';
import { connect } from 'react-redux';
import { addPhoto } from './addPhotoActions';
import { canUseDOM } from '../../../lib/utils.js';

class AddPhoto extends React.Component {
    constructor (props) {
        super(props);
        this.state = {file: ''};
        if (canUseDOM) {
            this.reader = new FileReader();
            this.reader.onloadend = () => {
                this.setState({
                    file: this.reader.result
                });
            }
        }
    }

    handleChange = (e) => {
        e.preventDefault();

        const file = this.refs.photoInput.files[0];
        this.reader.readAsDataURL(file);
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const file = this.refs.photoInput.files[0];
        this.props.addPhoto(file, this.props.galleryId);
    }

    handleDrop = (e) => {
        e.preventDefault();

        const dt = e.dataTransfer;
        const files = dt.files;
        this.props.addPhoto(files, this.props.galleryId);
    }

    render () {
        return (
            <form className="photo-form" onSubmit={this.handleSubmit} type="multipart/form-data">
                <input type="file" onChange={this.handleChange} placeholder="Photo" ref="photoInput" />
                <input type="submit" value="Add Photo" />
                <img src={this.state.file} ref="previewImage" width="100"/>
                <div style={{width: '300px', height: '100px', border: '2px dashed black'}} ref="photoDrop" onDragOver={(e) => {e.stopPropagation(); e.preventDefault();}} onDrop={this.handleDrop}></div>
            </form>
        );
    }
}
export default AddPhoto = connect(
    (state, ownProps) => ownProps,
    {addPhoto}
)(AddPhoto);
