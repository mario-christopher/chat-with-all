import React from 'react';

import { messageDate } from '../funcs';

export class Message extends React.Component {

    render = () => {
        let message = this.props.message;
        return (
            <div className='_row message'>
                <div className='_col _spc-right message-info'>
                    <span>{message.user.userName}</span>
                    <span>{messageDate(message.time)}</span>
                </div>
                <div className='_stretch message-message'>{message.message}</div>
            </div>
        );
    };
}