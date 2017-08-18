import io from 'socket.io-client';
import { ChatActions, actionCreator } from '../store/action';

export class SocketHandler {

    socket = null;
    dispatch = null;
    roomName = null;
    messages = [];

    constructor(dispatch) {
        this.dispatch = dispatch;
    }

    connect = () => {
        this.socket = io.connect();

        this.socket.on('connect', () => {
            this.setupEvents();
        });

        this.socket.on('connect_error', (err) => {
            this.dispatch(action_Connection(ChatActions.ERR, null, false, 'There was an error connecting to the chat.'));
            console.error('Connect Error :', err);
        });

        this.socket.on('connect_timeout', (timeout) => {
            this.dispatch(action_Connection(ChatActions.ERR, null, false, 'The connection to the chat timed out.'));
            console.error('Connection Timeout :', timeout);
        });

        this.socket.on('disconnect', (reason) => {
            console.log('Disconnected from chat.');
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
        this.dispatch(actionCreator(ChatActions.ADD_MESSAGE, data.message));
    }

    onLeft = (data) => {
        this.dispatch(actionCreator(ChatActions.ADD_NOTIFICATION, data.message));
        this.dispatch(actionCreator(ChatActions.CLEAR_MESSAGES));
    }

    onJoined = (data) => {
        this.dispatch(actionCreator(ChatActions.ADD_NOTIFICATION, data.message));
    }

    onOthers = (data) => {
        this.dispatch(actionCreator(ChatActions.OTHERS, data.others));
    }
}