import React from 'react';

export class Notification extends React.Component {

    render = () => {
        let notification = this.props.notification;

        return (
            <div>{notification}</div>
        );
    }
}