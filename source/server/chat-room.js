import socketIoExpressSession from 'socket.io-express-session';

import { addMessage } from './redis/data';
import { ItemType } from '../client/store/action';

export const setupChat = (io, session) => {

    io.use(socketIoExpressSession(session));

    io.on('connection', socket => {

        if (socket.handshake.session && socket.handshake.session.user) {
            let userName = socket.handshake.session.user.userName;

            socket.on('joined', () => {
                let message = `${userName} just joined the chat.`;
                addMessage(message, userName, ItemType.NOTIFICATION)
                    .then(message => {
                        socket.broadcast.emit('message', { message });
                    })
                    .catch(err => {
                        console.error('On Joined :', err);
                    })
            })

            socket.on('leaving', () => {
                let message = `${userName} just left the chat.`;
                addMessage(message, userName, ItemType.NOTIFICATION)
                    .then(message => {
                        socket.broadcast.emit('message', { message });
                    })
                    .catch(err => {
                        console.error('On Leaving :', err);
                    })
            })

            socket.on('message', message => {
                addMessage(message, userName, ItemType.MESSAGE)
                    .then(message => {
                        io.emit('message', { message });
                    });
            })

            socket.on('disconnect', (reason) => {
                console.warn('On Disconnect :', reason);
            })
        }
        else {
            console.log('Unauthorized socket access. Closing socket.');
            socket.disconnect(true);
        }
    });
}