import React from 'react';
import { Link } from 'react-router';
import { StyleSheet, css } from 'aphrodite';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

class AppView extends React.Component {
    render () {
        const { content, sidebar } = this.props;
        return (
            <div>
                <div className={css(styles.sidebar)}>
                    <Link to={"/photos"}>All Photos</Link>
                    {sidebar}
                </div>
                <div className={css(styles.content)}>
                    {content}
                </div>
            </div>
        );
    }
}
export default DragDropContext(HTML5Backend)(AppView);

const styles = StyleSheet.create({
    sidebar: {
        float: 'left',
        width: '20%',
    },

    content: {
        float: 'left',
        width: '80%',
    },
});
