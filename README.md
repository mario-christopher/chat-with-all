# Chat with ALL
**Chat with ALL** is a simple chat application built using :
* React - *to create the front end.*
* Redux - *used for client side state management.*
* Node - *to handle the server stuff.*
* Express - *as the web framework, and for RESTApi.*
* Redis - *used for server side session management, data storage and pub-sub for messages.*
* Socket.io - *used for realtime messaging.*

## Try it out:
https://chat-with-all.herokuapp.com/

## Setup
* `git clone https://gitlab.com/mario-christopher/chat-with-all.git`
* `cd chat-with-all`
* `npm install`
* Edit the file `source\server\redis\config.js` to add your redis server url (REDIS_URL) and password (REDIS_DB_PWD), or, alternatively, edit the `package.json` scripts to send them in as env variables. The app will not work without Redis configured.
* `npm run server` - *runs server on port 3000.*
* `npm run client` - *runs client on port 3001 (on another terminal).*
* Browse to http://localhost:3001 *( tested on Chrome and IE.11 ).*

*Note : To simulate multiple clients chatting on the same computer, open the client (http://localhost:3001) in different browsers ( eg.: Client1 on Chrome, Client2 on IE etc ).*


##  Application features:

* User-name to identify the user in the chat session.
* Broadcast a message to connected users when someone connects or disconnects.
* After joing the chat, see who else is on the chat.
* Rejoin the chat from where you left off automatically, if server crashes and/or restarts.
* Rejoin the chat from where you left off automatically, if browser crashes and/or refreshes.
* User is remembered (messages) until they explicitly leave the chat.
* User sessions and app data are stored externally, on a Redis server, to allow for recoveries on crashes, multiple servers, load balancing, scaling etc.
* Use of `socket.io-express-session` to share session with socket.io, so user information is safe in single source within session.
* Use of ES6 features and Promises on Server and Client.

##   License

Shared under MIT License.