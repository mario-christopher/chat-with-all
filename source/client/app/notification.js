import React from 'react';

import { messageDate } from '../funcs';

export class Notification extends React.Component {

    render = () => {
        let message = this.props.message;

        return (
            <div>{message.message} : <small>{messageDate(message.time)}</small></div>
        );
    }
}