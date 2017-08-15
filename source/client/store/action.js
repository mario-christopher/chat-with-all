export const ChatActions = {
    CONNECTION: 'User Connection.',
    ADD_MESSAGE: 'Add Message.',
    ADD_NOTIFICATION: 'Add Notification.',
    CLEAR_MESSAGES: 'Clear all messages.',
    OTHERS: 'Other users.',
}

export const ItemType = {
    MESSAGE: 'Message',
    NOTIFICATION: 'Notification'
}

export const action_Connection = (type, socketId, connection, reason) => {
    return {
        type, socketId, connection, reason
    };
}

export const action_AddMessage = (type, message) => {
    return {
        type, message
    };
}

export const action_AddNotification = (type, notification) => {
    return {
        type, notification
    };
}

export const action_ClearMessages = (type) => {
    return {
        type
    };
}

export const action_Others = (type, others) => {
    return {
        type, others
    };
}