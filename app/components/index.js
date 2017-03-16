import React from 'react';
import { Link } from 'react-router';
import { DragDropContext } from 'react-dnd';
import { Grid, Row, Col, Glyphicon } from 'react-bootstrap';
import HTML5Backend from 'react-dnd-html5-backend';

class AppView extends React.Component {
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
                        {content}
                    </Col>
                </Row>
            </Grid>
        );
    }
}
export default DragDropContext(HTML5Backend)(AppView);
