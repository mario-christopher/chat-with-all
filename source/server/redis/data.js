import { redisClient } from './config';

const Schema = {
    APP: 'cwa',
    ID: 'id',
    USER: 'user',
    MESSAGE: 'message',
    SET_OF: 'set_of',
    MSG_TO_USER: 'msg_to_user'
}

export const addUser = (userName) => {

    return new Promise((resolve, reject) => {

        let setOfUsersKey = getKeySetOfUsers();
        redisClient.sadd(setOfUsersKey, userName, (err, reply) => {
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

        let setOfUsersKey = getKeySetOfUsers();
        redisClient.srem(setOfUsersKey, userName, (err, reply) => {
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
        let setOfUsersKey = getKeySetOfUsers();
        redisClient.smembers(setOfUsersKey, (err, reply) => {
            if (err)
                reject(err);
            else
                resolve(reply);
        })
    });
}

export const addMessage = (message, userName, type) => {

    return new Promise((resolve, reject) => {

        let setOfUsersKey = getKeySetOfUsers();
        redisClient.scard(setOfUsersKey, (err, count) => {
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
        let setOfMessagesKey = getKeySetOfMessages();
        redisClient.sadd(setOfMessagesKey, messageId, (err, reply) => {
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
        let setOfUsersKey = getKeySetOfUsers();
        redisClient.scard(setOfUsersKey, (err, count) => {
            if (err)
                reject(err);
            else {
                if (count == 0) {        //No more users, so delete all messages, and reset Msg ID = 0
                    let setOfMessagesKey = getKeySetOfMessages();
                    redisClient.smembers(setOfMessagesKey, (err, messageIds) => {
                        if (err)
                            reject(err);
                        else {
                            let messageIdKeys = messageIds.map(id => getKeyMessages(id));
                            let idMsgs = getKeyIds(Schema.MESSAGE);
                            let allKeysToDel = [...messageIdKeys, setOfMessagesKey, idMsgs];
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
        let idMsgs = getKeyIds(Schema.MESSAGE);
        redisClient.incr(idMsgs, (err, newId) => {
            if (err)
                reject(err);
            else
                resolve(newId);
        })
    });
}

export const getKeyUsers = (userName) => {
    return `${Schema.APP}:${Schema.USER}:${userName}`;
}

export const getKeyMessageToUser = (userName) => {
    return `${Schema.APP}:${Schema.MSG_TO_USER}:${userName}`;
}

export const getKeySetOfUsers = () => {
    return `${Schema.APP}:${Schema.SET_OF}:${Schema.USER}`;
}

export const getKeySetOfMessages = () => {
    return `${Schema.APP}:${Schema.SET_OF}:${Schema.MESSAGE}`;
}

export const getKeyMessages = (messageId) => {
    return `${Schema.APP}:${Schema.MESSAGE}:${messageId}`;
}

export const getKeyIds = (idType) => {
    return `${Schema.APP}:${Schema.ID}:${idType}`;
}