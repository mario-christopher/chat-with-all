import socketIoExpressSession from 'socket.io-express-session';

const chatSession = {
    users: {},
    messages: []
}

export const setupChat = (io, session) => {

    io.use(socketIoExpressSession(session));

    io.on('connection', socket => {

        if (socket.handshake.session && socket.handshake.session.user){
            let userName = socket.handshake.session.user.name;

            chatSession.users[socket.id] = {
                userName,
                active: true
            };
            socket.broadcast.emit('joined', { message: `${userName} just joined the chat.` });
            io.emit('others', { others: userList(chatSession.users) });

            socket.on('disconnect', () => {
                let user = chatSession.users[socket.id];
                user.active = false;
                socket.broadcast.emit('left', { message: `${user.userName} just left the chat.` });
                io.emit('others', { others: userList(chatSession.users) });
            });

            socket.on('message', text => {
                let message = {
                    user: chatSession.users[socket.id],
                    text,
                    time: new Date()
                };
                chatSession.messages.push(message);
                io.emit('message', { message });
            });
        }
        else{
            console.log('Unauthorized socket access. Closing socket.');
            socket.disconnect(true);
        }
            
    });
}

const userList = (users) => {
    console.log('Users : ', users)
    let userList = [];
    Object.keys(users).forEach(key => {
        if (users[key].active)
            userList.push({
                socketId: key,
                userName: users[key].userName
            })
    })
    return userList;
}