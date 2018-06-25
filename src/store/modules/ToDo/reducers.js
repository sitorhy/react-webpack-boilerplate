import {ADD_TO_DO, DEL_TO_DO, SEND_TO_DO} from "./actions";

import {combineReducers} from "redux";

const todos = function (state = [], action) {
    let length = state.length;
    let payload = action.payload;

    switch (action.type) {
        case ADD_TO_DO: {
            return [
                ...state,
                {
                    index: length,
                    text: payload.text
                }
            ];
        }
            break;
        case DEL_TO_DO: {
            return state.filter((i) => i.index !== payload.index);
        }
            break;
        default: {
            return state;
        }
    }
};

export default combineReducers({
    todos
});