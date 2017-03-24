import React from 'react';
import { Button, Modal } from 'react-bootstrap';

class Confirm extends React.Component {
    constructor () {
        super();
    }

    render () {
        return (
            <Modal show={this.props.show} onHide={this.props.toggleAddGalleryModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.props.body}
                </Modal.Body>

                <Modal.Footer>
                    <Button>Cancel</Button>
                    <Button bsStyle="primary">Continue</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}
