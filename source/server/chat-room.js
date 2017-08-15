const chatSession = {
    users: {},
    messages: []
}

export const setupChat = (io) => {

    io.on('connection', socket => {

        chatSession.users[socket.id] = {
            userName: socket.handshake.query.userName,
            active: true
        };
        socket.broadcast.emit('joined', { message: `${socket.handshake.query.userName} just joined the chat.` });
        io.emit('others', { others: userList(chatSession.users) });

        socket.on('disconnect', () => {
            let user = chatSession.users[socket.id];
            user.active = false;
            socket.broadcast.emit('left', { message: `${user.userName} just left the chat.` });
            io.emit('others', { others: userList(chatSession.users) });
        });

        socket.on('message', msg => {
            let newMessage = {
                socketId: socket.id,
                time: new Date(),
                message: msg,
                user: chatSession.users[socket.id]
            };
            chatSession.messages.push(newMessage);
            io.emit('message', { message: newMessage });
        });
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