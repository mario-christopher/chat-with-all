import io from 'socket.io-client';
import { ChatActions, action_AddMessage, action_AddNotification, action_Connection, action_ClearMessages, action_Others } from '../store/action';

export class SocketHandler {

    socket = null;
    dispatch = null;
    userName = null;
    roomName = null;
    messages = [];

    constructor(userName, roomName, dispatch) {
        this.userName = userName;
        this.roomName = roomName;
        this.dispatch = dispatch;
    }

    connect = () => {
        this.socket = io({
            query: {
                userName: this.userName
            }
        });

        this.socket.on('connect', () => {
            this.dispatch(action_Connection(ChatActions.CONNECTION, this.socket.id, true));
            this.setupEvents();
        });

        this.socket.on('connect_error', (err) => {
            this.dispatch(action_Connection(ChatActions.CONNECTION, this.socket.id, false, 'There was an error connecting to the chat.'));
            console.error('Connect Error :', err);
        });

        this.socket.on('connect_timeout', (timeout) => {
            this.dispatch(action_Connection(ChatActions.CONNECTION, this.socket.id, false, 'The connection to the chat timedout.'));
            console.error('Connection Timeout :', timeout);
        });

        this.socket.on('disconnect', (reason) => {
            this.dispatch(action_Connection(ChatActions.CONNECTION, this.socket.id, false, reason));
            this.dispatch(action_ClearMessages(ChatActions.CLEAR_MESSAGES));
        });
    }

    setupEvents = () => {
        this.socket.on('message', this.onMessage);
        this.socket.on('left', this.onLeft);
        this.socket.on('joined', this.onJoined);
        this.socket.on('others', this.onOthers);
    }

    disconnect = () => {
        this.socket.close();
    }

    sendMessage = (message) => {
        this.socket.send(message);
    }

    onMessage = (data) => {
        this.dispatch(action_AddMessage(ChatActions.ADD_MESSAGE, data.message));
    }

    onLeft = (data) => {
        this.dispatch(action_AddNotification(ChatActions.ADD_NOTIFICATION, data.message));
    }

    onJoined = (data) => {
        this.dispatch(action_AddNotification(ChatActions.ADD_NOTIFICATION, data.message));
    }

    onOthers = (data) => {
        this.dispatch(action_Others(ChatActions.OTHERS, data.others));
    }
}