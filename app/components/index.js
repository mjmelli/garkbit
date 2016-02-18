import React from 'react';

export default class AppView extends React.Component {
    render () {
        const { content, sidebar } = this.props;
        return (
            <div>
                <div className="sidebar">
                    {sidebar}
                </div>
                <div className="content">
                    {content}
                </div>
            </div>
        );
    }
}