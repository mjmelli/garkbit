import React from 'react';
import { Router, Route, Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateGallery, deleteGallery } from './galleriespanelactions';

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
        this.props.updateGallery(this.props.gallery.id, this.state.name);
    }

    render () {
        const props = this.props;

        if (this.state.isEditing) {
            return (
                <div className="gallery">
                    <input type="text" value={this.state.name} onChange={this.handleChange}/>
                    <input type="submit" value="Change" onClick={this.handleUpdate} />
                </div>
            );
        } else {
            return (
                <div className="gallery">
                    <span onClick={this.startEdit}>{this.state.name}</span>
                    <Link to={"/gallery/" + props.gallery.id}>Go</Link>
                    <a className="galleryDelete" onClick={() => this.props.deleteGallery(props.gallery.id)}>x</a>
                </div>
            );
        }
    }
}
GalleryListItem = connect(
    (state, ownProps) => ownProps,
    {updateGallery, deleteGallery}
)(GalleryListItem);

class GalleryList extends React.Component {
    render () {
        let props = this.props;
        let galleries = this.props.data.map(function(gallery) {
            return (
                <GalleryListItem gallery={gallery} key={gallery.id}>
                </GalleryListItem>
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
    }

    handleSubmit = (e) => {
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

class GalleriesPanel extends React.Component {
    constructor (props) {
        super(props);
        this.handleGallerySubmit = this.handleGallerySubmit.bind(this);
    }

    handleGallerySubmit (name) {
        this.props.actions.addGallery(name);
    }

    render () {
        return (
            <div id="gallery-panel">
                <h1>Galleries</h1>
                <GalleryForm onGallerySubmit={this.handleGallerySubmit} />
                <GalleryList data={this.props.galleries} />
            </div>
        );
    }
}

export default GalleriesPanel;
