export const ADD_TO_DO = "ADD_TO_DO";
export const DEL_TO_DO = "DEL_TO_DO";
export const SEND_TO_DO = "SEND_TO_DO";

export function addToDo(text) {
    return {type: ADD_TO_DO, payload: {text}};
}

export function delToDo(index) {
    return {type: DEL_TO_DO, payload: {index}};
}

export function sendToDo(text) {
    return (dispatch, getState) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                dispatch(addToDo(text));
                resolve({text});
            }, 3000);
        });
    };
}