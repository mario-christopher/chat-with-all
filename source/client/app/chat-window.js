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

    onKeyPress = (e) => {
        if (e.charCode == 13)
            this.sendMessageClicked();
    }

    componentDidUpdate = () => {
        //Scoll the message list always to bottom.
        this.div.scrollTop = this.div.scrollHeight;
    }

    render = () => {
        let messages = this.props.messages;

        return (
            <div className='_col _stretch'>
                <div className='_stretch scroll-div'
                    ref={div => { this.div = div; }}>
                    <ul className="list-group">
                        {messages &&
                            messages.map((message) => {
                                if (message.type == ItemType.MESSAGE)
                                    return <li key={message.id}
                                        className="list-group-item less-pad">
                                        <Message message={message} /></li>

                                if (message.type == ItemType.NOTIFICATION)
                                    return <li key={message.id}
                                        className="list-group-item list-group-item-warning less-pad">
                                        <Notification message={message} /></li>
                            })
                        }
                    </ul>
                </div>
                <div className='_row new-message'>
                    <input autoFocus ref={inp => { this.inp = inp; }} className='_stretch _spc' maxLength='100' onKeyPress={this.onKeyPress} />
                    <button className='btn _spc btn-info' onClick={this.sendMessageClicked}>Send</button>
                </div>
            </div>
        );
    }
}