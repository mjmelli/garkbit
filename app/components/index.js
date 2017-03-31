import React from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import { DragDropContext } from 'react-dnd';
import { Grid, Row, Col, Glyphicon } from 'react-bootstrap';
import HTML5Backend from 'react-dnd-html5-backend';
import ErrorMessage from './ErrorMessage/errormessage';
import { clearError } from '../modules/Error/erroractions';

class AppView extends React.Component {
    componentWillMount() {
        if (!this.props.auth.isAuthenticated) this.context.router.push('/login');
    }

    componentWillUpdate(nextProps) {
        if (!nextProps.auth.isAuthenticated) this.context.router.push('/login');
    }

    render () {
        const { content, sidebar } = this.props;
        return (
            <Grid fluid>
                <Row className="row-full-height">
                    <Col sm={3} className="sidebar">
                        <Link to={"/"}><img className="logo" src="/images/gb_logo.png" alt="Garkbit"/></Link>
                        <h3><Link to={"/photos"}>All Photos</Link></h3>
                        {sidebar}
                    </Col>
                    <Col sm={9} className="content">
                        <ErrorMessage show={this.props.error.hasError} error={this.props.error} clearError={this.props.clearError} />
                        {content}
                    </Col>
                </Row>
            </Grid>
        );
    }
}

AppView.contextTypes = {
    router: React.PropTypes.object
};

AppView = connect(
    (state) => {
        return {
            auth: state.auth,
            error: state.error,
        };
    },
    { clearError }
)(AppView);

export default DragDropContext(HTML5Backend)(AppView);
