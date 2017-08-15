import React from 'react';
import { connect } from 'react-redux';

import { User } from './user';
import { OtherUsers } from './other-users';
import { ChatWindow } from './chat-window';
import { SocketHandler } from './socket-handler';

export class App extends React.PureComponent {

    socketHandler = null;

    onJoinChat = (userName) => {
        this.socketHandler = new SocketHandler(userName, 'room1', this.props.dispatch);
        this.socketHandler.connect();
    };

    onLeaveChat = () => {
        this.socketHandler.disconnect();
    }

    onSendMessage = (message) => {
        this.socketHandler.sendMessage(message);
    }

    render() {
        let userInfo = this.props.userInfo;

        return (
            <div className='_col'>
                <User
                    joinChat={this.onJoinChat}
                    leaveChat={this.onLeaveChat}
                    connected={userInfo.connected} />
                {userInfo.connected &&
                    <OtherUsers others={this.props.others} />
                }
                {userInfo.connected &&
                    <ChatWindow
                        sendMessage={this.onSendMessage}
                        items={this.props.items} />
                }
            </div>
        );
    };
}

const mapStateToProps = (state) => {
    return {
        others: state.messages.others,
        userInfo: state.messages.userInfo,
        items: state.messages.items
    };
}
App = connect(mapStateToProps)(App);