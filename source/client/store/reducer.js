import { ChatActions, ItemType } from './action';

const initState = {
    user: {
        name: null,
        joined: false,
        time: null
    },
    error: null,
    others: [],
    items: []
}

export const messageReducer = (state = initState, action) => {

    switch (action.type) {

        case (ChatActions.ERR):
            {
                return { ...state, error: action.err };
            }

        case (ChatActions.JOINED):
        case (ChatActions.LEFT):
            {
                let user = { name: action.data.name, joined: action.data.joined, time: action.data.time };
                return { ...state, user }
            }

        case (ChatActions.ADD_MESSAGE):
            {
                let items = [...state.items, { type: ItemType.MESSAGE, content: action.data }];
                return { ...state, items }
            }

        case (ChatActions.ADD_NOTIFICATION):
            {
                let items = [...state.items, { type: ItemType.NOTIFICATION, content: action.data }];
                return { ...state, items }
            }

        case (ChatActions.CLEAR_MESSAGES):
            {
                return { ...state, items: [] }
            }

        case (ChatActions.OTHERS):
            {
                return { ...state, others: action.data }
            }

        default:
            return state;
    }
}