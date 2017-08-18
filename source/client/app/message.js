import React from 'react';

import { trim } from '../funcs';
import { messageDate } from '../funcs';

export class Message extends React.Component {

    render = () => {
        let message = this.props.message;
        return (
            <div className='_row message'>
                <div className='_col _spc-right message-info'>
                    <span>{trim(message.userName, 15)}</span>
                    <small><span>{messageDate(message.time)}</span></small>
                </div>
                <div className='_stretch message-message'>{message.message}</div>
            </div>
        );
    };
}