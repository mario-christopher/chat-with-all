import React from 'react';
import { connect } from 'react-redux';

import { User } from './user';
import { OtherUsers } from './other-users';
import { ChatWindow } from './chat-window';
import { SocketHandler } from './socket-handler';
import { asyncAction, Method, ChatActions } from '../store/action';

export class App extends React.PureComponent {

    socketHandler = null;

    componentDidMount = () => {
        this.socketHandler = new SocketHandler(this.props.dispatch);
        this.props.dispatch(asyncAction(ChatActions.JOINED, 'hasjoined', null, Method.GET))
            .then(resultData => {
                if (resultData)
                    this.connected();
            })
    }

    onJoinChat = (userName) => {
        this.props.dispatch(asyncAction(ChatActions.JOINED, 'join', { userName }, Method.POST))
            .then(() => {
                this.connected();
                this.socketHandler.joined();
            });
    };

    onLeaveChat = () => {
        this.props.dispatch(asyncAction(ChatActions.LEFT, 'leave', null, Method.POST))
            .then(() => {
                this.socketHandler.disconnect();
            });
    }

    onSendMessage = (message) => {
        this.socketHandler.sendMessage(message);
    }

    connected = () => {
        this.socketHandler.connect();
        this.props.dispatch(asyncAction(ChatActions.OTHERS, 'users', null, Method.GET));
        this.props.dispatch(asyncAction(ChatActions.ADD_MESSAGES, 'messages', null, Method.GET))
    }

    render() {
        let user = this.props.user;

        return (
            <div>
                <header className='header-bg text-center'>
                    <span className='header-title _stretch'>Chat with ALL ! </span>
                </header>

                <User
                    user={user}
                    joinChat={this.onJoinChat}
                    leaveChat={this.onLeaveChat} />

                <div className='_row message-window'>
                    {user &&
                        <ChatWindow
                            sendMessage={this.onSendMessage}
                            messages={this.props.messages} />
                    }
                    {user &&
                        <OtherUsers others={this.props.others}
                            user={user} />
                    }

                </div>
            </div>
        );
    };
}

const mapStateToProps = (state) => {
    return {
        user: state.messages.user,
        others: state.messages.others,
        messages: state.messages.messages
    };
}
App = connect(mapStateToProps)(App);