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
            <div>
                <header className='header-bg text-center'>
                    <span className='header-title _stretch'>Chat with ALL ! </span>
                </header>
                <User
                    joinChat={this.onJoinChat}
                    leaveChat={this.onLeaveChat}
                    connected={userInfo.connected} />
                <div className='_row message-window'>
                    {userInfo.connected &&
                        <ChatWindow
                            sendMessage={this.onSendMessage}
                            items={this.props.items} />
                    }
                    {userInfo.connected &&
                        <OtherUsers others={this.props.others} />
                    }

                </div>
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