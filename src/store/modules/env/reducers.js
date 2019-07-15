import {SET_PLATFORM, SET_REACT_VERSION, SET_USERAGENT} from "./actions";

import {combineReducers} from "redux";

const env = function (state = {}, action)
{
    const {type, payload={}} = action;
    const {
        platform,
        userAgent,
        reactVersion
    } = payload;

    switch (type)
    {
        case SET_PLATFORM:
        {
            return {
                ...state,
                platform
            };
        }
            break;
        case SET_USERAGENT:
        {
            return {
                ...state,
                userAgent
            };
        }
            break;
        case SET_REACT_VERSION:
        {
            return {
                ...state,
                reactVersion
            };
        }
            break;
        default:
        {
            return state;
        }
    }
};

export default combineReducers({
    env
});