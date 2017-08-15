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
                <span className='_spc user-name'>User Name :</span>
                <input autoFocus ref={inp => { this.inp = inp; }} disabled={isConnected} className='_stretch _spc' />
                {!isConnected ?
                    <button className='btn _spc' onClick={this.onJoinChatClicked} >Join Chat</button>
                    :
                    <button className='btn _spc' onClick={this.onLeaveChatClicked} >Leave Chat</button>
                }
            </div>
        );
    }
}