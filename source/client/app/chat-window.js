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
        let items = this.props.items;

        return (
            <div className='_col _stretch'>
                <div className='_stretch scroll-div'
                    ref={div => { this.div = div; }}>
                    <ul className="list-group">
                        {items &&
                            items.map((item, i) => {
                                if (item.type == ItemType.MESSAGE)
                                    return <li key={i}
                                        className="list-group-item less-pad">
                                        <Message message={item.content} /></li>

                                if (item.type == ItemType.NOTIFICATION)
                                    return <li key={i}
                                        className="list-group-item list-group-item-warning less-pad">
                                        <Notification key={i} notification={item.content} /></li>
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