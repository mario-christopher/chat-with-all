import React from 'react';

import { Message } from './message';
import { Notification } from './notification';
import { ItemType } from '../store/action';

export class ChatWindow extends React.Component {

    sendMessageClicked = () => {
        let message = this.inp.value;
        if (message.length > 0) {
            this.props.sendMessage(message);
            this.inp.value = '';
            this.inp.focus();
        }
    }

    componentDidUpdate = () => {
        //Scoll the message list always to bottom.
        this.div.scrollTop = this.div.scrollHeight;
    }

    render = () => {
        let items = this.props.items;

        return (
            <div className='_col message-window'>
                <div className='_stretch message-list'
                    ref={div => { this.div = div; }}>
                    {items &&
                        items.map((item, i) => {
                            if (item.type == ItemType.MESSAGE)
                                return <Message key={i} message={item.content} />

                            if (item.type == ItemType.NOTIFICATION)
                                return <Notification key={i} notification={item.content} />
                        })
                    }
                </div>
                <div className='_row new-message'>
                    <input autoFocus ref={inp => { this.inp = inp; }} className='_stretch _spc' />
                    <button className='btn _spc' onClick={this.sendMessageClicked}>Send</button>
                </div>
            </div>
        );
    }
}