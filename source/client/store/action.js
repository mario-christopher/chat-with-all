import axios from 'axios';

export const ChatActions = {
    ADD_MESSAGE: 'Add Message.',
    ADD_NOTIFICATION: 'Add Notification.',
    CLEAR_MESSAGES: 'Clear all messages.',
    OTHERS: 'Other users.',

    JOINED: 'Joined Chat.',
    LEFT: 'Left Chat.',
    ERR: 'Error Occured.'
}

export const ItemType = {
    MESSAGE: 'Message',
    NOTIFICATION: 'Notification'
}

export const Method = {
    GET: 'get',
    POST: 'post'
}

export const actionCreator = (type, data, err) => {
    return {
        type, data, err
    };
}

export const asyncAction = (type, url, data, method) => {

    let _url = `api/${url}`;

    return (dispatch, state) => {
        return makeAsyncCall(_url, data, method)
            .then(resultData => {
                dispatch(actionCreator(type, resultData, null));
                return resultData;
            })
            .catch(err => {
                dispatch(actionCreator(ChatActions.ERR, null, err));
                console.error('Async call error : ', err);
            })
    }
}

const makeAsyncCall = (url, data, method) => {

    return axios({
        url, data, method,
    })
        .then(result => {
            return result.data;
        })
        .catch(err => {
            throw err;
        })
}