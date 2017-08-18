import { ChatActions, ItemType } from './action';

const initState = {
    user: null,
    others: [],
    messages: [],
    error: null
}

export const messageReducer = (state = initState, action) => {

    switch (action.type) {

        case (ChatActions.ERR):
            {
                return { ...state, error: action.err };
            }

        case (ChatActions.JOINED):
            {
                let user = state.user;
                if (action.data)
                    user = { name: action.data.userName, time: action.data.time };
                return { ...state, user }
            }

        case (ChatActions.LEFT):
            {
                return { ...state, user: null }
            }

        case (ChatActions.ADD_MESSAGE):
            {
                let messages = [...state.messages, action.data];
                return { ...state, messages }
            }

        case (ChatActions.ADD_MESSAGES):
            {
                let messages = [...action.data];
                return { ...state, messages }
            }

        case (ChatActions.CLEAR_MESSAGES):
            {
                return { ...state, messages: [] }
            }

        case (ChatActions.OTHERS):
            {
                return { ...state, others: action.data }
            }

        default:
            return state;
    }
}