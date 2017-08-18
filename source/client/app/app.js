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
        this.props.dispatch(asyncAction(ChatActions.JOINED, '/hasjoined', null, Method.GET))
            .then(resultData => {
                if (resultData.joined)
                    this.socketHandler.connect();
            })
    }

    onJoinChat = (userName) => {
        this.props.dispatch(asyncAction(ChatActions.JOINED, '/join', { userName }, Method.POST))
            .then(() => {
                this.socketHandler.connect();
            });
    };

    onLeaveChat = () => {
        this.props.dispatch(asyncAction(ChatActions.LEFT, '/leave', null, Method.POST))
            .then(() => {
                this.socketHandler.disconnect();
            });
    }

    onSendMessage = (message) => {
        this.socketHandler.sendMessage(message);
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
                    {user.joined &&
                        <ChatWindow
                            sendMessage={this.onSendMessage}
                            items={this.props.items} />
                    }
                    {user.joined &&
                        <OtherUsers others={this.props.others} />
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
        items: state.messages.items
    };
}
App = connect(mapStateToProps)(App);