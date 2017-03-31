import _ from 'lodash';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, Form, FormControl, FormGroup, ControlLabel, Grid, Row, Col } from 'react-bootstrap';
import { loginUser } from '../../modules/Auth/authactions.js';

class Login extends React.Component {
    constructor () {
        super();
        this.defaultState = {
            email: '',
            password: '',
        };
        this.state = this.defaultState;
    }

    handleInputChange = (e) => {
        const target = e.target;

        this.setState({
            [target.name]: target.value
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const email = this.state.email.trim();
        const password = this.state.password.trim();
        this.props.loginUser(email, password);
    }

    render () {
        return (
            <Grid>
                <Row className="row-full-height">
                    <Col sm={12} className="login">
                        <img className="logo" src="/images/gb_logo.png" alt="Garkbit"/>
                        <Form className="gallery-form" onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <ControlLabel>Email</ControlLabel>
                                <FormControl
                                    name="email"
                                    type="text"
                                    placeholder="Enter your email address"
                                    onChange={this.handleInputChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel>Password</ControlLabel>
                                <FormControl
                                    name="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    onChange={this.handleInputChange}
                                />
                            </FormGroup>
                            <Button type="submit" bsStyle="primary">Login</Button>
                        </Form>
                    </Col>
                </Row>
            </Grid>
        );
    }

}

Login = connect(
    (state, ownProps) => ownProps,
    { loginUser }
)(Login);

export default Login;
