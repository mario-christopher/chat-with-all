import path from 'path';
import socketio from 'socket.io';
import express from 'express';

import {setupChat} from './chat-room';

let PORT = process.env.PORT || 3000;
let staticPath = path.resolve(__dirname, '../../');
let staticPathBuild = path.resolve(__dirname, '../../public/build');

let app = express();
app.use(express.static(staticPath));
app.use(express.static(staticPathBuild));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(staticPathBuild, 'index.html'));
});

let server = app.listen(PORT, () => {
    console.log(`Listening on port : ${PORT}`)
});

setupChat(socketio(server));