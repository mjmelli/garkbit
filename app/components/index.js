import React from 'react';
import { StyleSheet, css } from 'aphrodite';

export default class AppView extends React.Component {
    render () {
        const { content, sidebar } = this.props;
        return (
            <div>
                <div className={css(styles.sidebar)}>
                    {sidebar}
                </div>
                <div className={css(styles.content)}>
                    {content}
                </div>
            </div>
        );
    }
}

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