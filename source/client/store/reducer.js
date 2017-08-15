import { ChatActions, ItemType } from './action';

const initState = {
    others: [],
    userInfo: {
        socketId: null,
        connected: false,
        reason: null
    },
    items: []
}

export const messageReducer = (state = initState, action) => {

    switch (action.type) {

        case (ChatActions.CONNECTION):
            {
                let userInfo = { socketId: action.socketId, connected: action.connection, reason: action.reason };
                return { ...state, userInfo }
            }

        case (ChatActions.ADD_MESSAGE):
            {
                let items = [...state.items, { type: ItemType.MESSAGE, content: action.message }];
                return { ...state, items }
            }

        case (ChatActions.ADD_NOTIFICATION):
            {
                let items = [...state.items, { type: ItemType.NOTIFICATION, content: action.notification }];
                return { ...state, items }
            }

        case (ChatActions.CLEAR_MESSAGES):
            {
                return { ...state, items: [] }
            }

        case (ChatActions.OTHERS):
            {
                return { ...state, others: action.others }
            }
            
        default:
            return state;
    }
}