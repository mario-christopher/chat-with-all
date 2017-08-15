import React from 'react';
import io from 'socket.io-client';

export class User extends React.Component {

    onJoinChatClicked = () => {
        if (this.inp.value.length > 0) {
            this.props.joinChat(this.inp.value);
        }
    }

    onLeaveChatClicked = () => {
        this.props.leaveChat();
    }

    render = () => {
        let isConnected = this.props.connected;

        return (
            <div className='_row'>
                <input autoFocus
                    ref={inp => { this.inp = inp; }}
                    disabled={isConnected} className='form-control _spc'
                    placeholder='Enter your chat user name' 
                    maxLength='50'/>
                {!isConnected ?
                    <button className='btn _spc btn-success' onClick={this.onJoinChatClicked} >Join Chat</button>
                    :
                    <button className='btn _spc btn-warning' onClick={this.onLeaveChatClicked} >Leave Chat</button>
                }
            </div>
        );
    }
}