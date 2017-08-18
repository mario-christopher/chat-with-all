import { redisClient } from './redis-config';

const Schema = {
    DB: 'cwa',
    USERS: 'users',
    MSGS_TO_USER: 'msgs_to_user',
    MSGS: 'messages',
    IDS: 'ids',
    LISTS: 'lists'
}

export const addUser = (userName) => {

    return new Promise((resolve, reject) => {

        let listOfUsersKey = getKeyListOfUsers();
        redisClient.sadd(listOfUsersKey, userName, (err, reply) => {
            if (err)
                reject(err);
            else
                if (reply === 1) {      //Proceed only if userName does not exist and is added.
                    let newUser = {
                        userName,
                        time: new Date()
                    };
                    let userKey = getKeyUsers(userName);
                    redisClient.set(userKey, JSON.stringify(newUser), (err, reply) => {
                        if (err)
                            reject(err);
                        else
                            resolve(newUser);
                    })
                }
                else if (reply === 0)
                    resolve(null);
        })
    });
}

export const removeUser = (userName) => {

    return new Promise((resolve, reject) => {

        let listOfUsersKey = getKeyListOfUsers();
        redisClient.srem(listOfUsersKey, userName, (err, reply) => {
            if (err)
                reject(err);
            else
                if (reply === 1) {      //Proceed only if userName is found and removed.
                    let userKey = getKeyUsers(userName);
                    redisClient.del(userKey, (err, reply) => {
                        if (err)
                            reject(err);
                        else {
                            let msgsToUserKey = getKeyMessageToUser(userName);
                            redisClient.del(msgsToUserKey, (err, reply) => {
                                if (err)
                                    reject(err);
                                else {
                                    removeAllMessages();
                                    resolve();
                                }
                            })
                        }
                    })
                }
        })
    });
}

export const getAllUsers = () => {

    return new Promise((resolve, reject) => {
        let listOfUsersKey = getKeyListOfUsers();
        redisClient.smembers(listOfUsersKey, (err, reply) => {
            if (err)
                reject(err);
            else
                resolve(reply);
        })
    });
}

export const addMessage = (message, userName, type) => {

    return new Promise((resolve, reject) => {

        let listOfUsersKey = getKeyListOfUsers();
        redisClient.scard(listOfUsersKey, (err, count) => {
            if (err)
                reject(err);
            else {
                if (count > 0) {
                    newMsgId()
                        .then(id => {
                            let messageKey = getKeyMessages(id);
                            let newMessage = {
                                id,
                                userName,
                                message,
                                type,
                                time: new Date(),
                            };
                            redisClient.set(messageKey, JSON.stringify(newMessage), (err, reply) => {
                                if (err)
                                    reject(err);
                                else {
                                    addMessageToList(id);
                                    addMessageToUsers(id);
                                    resolve(newMessage);        //No need to wait for the prev Promise to resolve.
                                }
                            });
                        });
                }
            }
        });
    });
}

export const addMessageToUsers = (messageId) => {

    return new Promise((resolve, reject) => {

        getAllUsers()
            .then(userNameList => {
                userNameList && userNameList.forEach(userName => {
                    let msgsToUserKey = getKeyMessageToUser(userName);
                    redisClient.rpush(msgsToUserKey, messageId, (err, reply) => {
                    })
                });
                resolve();
            })
    });
}

export const addMessageToList = (messageId) => {

    return new Promise((resolve, reject) => {
        let listOfMessagesKey = getKeyListOfMessages();
        redisClient.sadd(listOfMessagesKey, messageId, (err, reply) => {
            if (err)
                reject(err);
            else
                resolve(reply);
        });
    });
}

export const getUserMessages = (userName) => {

    return new Promise((resolve, reject) => {

        let msgsToUserKey = getKeyMessageToUser(userName);
        redisClient.llen(msgsToUserKey, (err, count) => {
            if (err)
                reject(err);
            else {
                redisClient.lrange(msgsToUserKey, 0, count, (err, msgIds) => {
                    if (err)
                        reject(err);
                    else {
                        let msgIdKeys = msgIds.map(id => getKeyMessages(id));
                        if (msgIds.length > 0) {
                            redisClient.mget(msgIdKeys, (err, messages) => {
                                if (err) {
                                    reject(err);
                                }

                                else {
                                    let messageArray = messages.map(message => JSON.parse(message));
                                    resolve(messageArray);
                                }
                            })
                        }
                        else {
                            resolve([]);
                        }
                    }
                })
            }
        })
    });
}

export const removeAllMessages = () => {

    return new Promise((resolve, reject) => {
        let listOfUsersKey = getKeyListOfUsers();
        redisClient.scard(listOfUsersKey, (err, count) => {
            if (err)
                reject(err);
            else {
                if (count == 0) {        //No more users, so delete all messages, and reset Msg ID = 0
                    let listOfMessagesKey = getKeyListOfMessages();
                    redisClient.smembers(listOfMessagesKey, (err, messageIds) => {
                        if (err)
                            reject(err);
                        else {
                            let messageIdKeys = messageIds.map(id => getKeyMessages(id));
                            let idMsgs = getKeyIds(Schema.MSGS);
                            let allKeysToDel = [...messageIdKeys, listOfMessagesKey, idMsgs];
                            redisClient.del(allKeysToDel, (err, reply) => {
                            })
                        }
                    })
                }
            }
        })
    });
}

export const newMsgId = () => {

    return new Promise((resolve, reject) => {
        let idMsgs = getKeyIds(Schema.MSGS);
        redisClient.incr(idMsgs, (err, newId) => {
            if (err)
                reject(err);
            else
                resolve(newId);
        })
    });
}

export const resetMsgId = () => {

    return new Promise((resolve, reject) => {
        let idMsgs = getKeyIds(Schema.MSGS);
        redisClient.set(idMsgs, 0, (err, newId) => {
            if (err)
                reject(err);
            else
                resolve(newId);
        })
    });
}

export const getKeyUsers = (userName) => {
    return `${Schema.DB}:${Schema.USERS}:${userName}`;
}

export const getKeyMessageToUser = (userName) => {
    return `${Schema.DB}:${Schema.MSGS_TO_USER}:${userName}`;
}

export const getKeyListOfUsers = () => {
    return `${Schema.DB}:${Schema.LISTS}:${Schema.USERS}`;
}

export const getKeyListOfMessages = () => {
    return `${Schema.DB}:${Schema.LISTS}:${Schema.MSGS}`;
}

export const getKeyMessages = (messageId) => {
    return `${Schema.DB}:${Schema.MSGS}:${messageId}`;
}

export const getKeyIds = (idType) => {
    return `${Schema.DB}:${Schema.IDS}:${idType}`;
}