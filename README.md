# Chat with ALL
A Simple chat application built using ReactJS, Node and Express. 
Redux is used for Client State Management. 
Redis is used for Server side session management.
Socket.io is used for realtime chat messaging.

## Try it out:
https://chat-with-all.herokuapp.com/

## Setup
1.    Open new terminal.
2.    `git clone https://gitlab.com/mario-christopher/chat-with-all.git`.
3.    The source code will be cloned in your local folder `chat-with-all`.
4.    `cd chat-with-all`
5.    `npm install`   _(to install npm dependencies)_
6.   `npm run server`    _(to start the Node server serving the API)_
7.   You should see `Running server at port 3000` as a confirmation that the server started and connected to mongoDb.
8.   Open a new terminal.
9.   `npm run client`   _(to start the webclient)_
10.   You should see `webpack: Compiled successfully` as a confirmation that the client code compiled without issues (it may take a few seconds).
11.   Open a Google Chrome Browser window and browse to `http://localhost:3001/`
12.   Note: The API is served from `http://localhost:3000/' and the web site runs from 'http://localhost:3001/' 

##  Application features:

1.  Use of nick-names for chat session.
2.  Broadcast a message to connected users when someone connects or disconnects
3.  Show who’s online.

###   License

Shared under MIT License.