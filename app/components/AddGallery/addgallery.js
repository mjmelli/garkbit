import _ from 'lodash';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';
import { addGallery } from '../../modules/galleries/galleriesactions.js';

class AddGallery extends React.Component {
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
            <Modal show={props.show} onHide={props.onHide}>
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

AddGallery.PropTypes = {
    show: PropTypes.bool.isRequired,
    addSet: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    addGallery: PropTypes.func.isRequired,
};

AddGallery = connect(
    (state, ownProps) => ownProps,
    {addGallery}
)(AddGallery);

export default AddGallery;
