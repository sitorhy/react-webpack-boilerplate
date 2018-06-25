import {createStore, applyMiddleware} from "redux";
import thunkMiddleware from "redux-thunk";

import ToDo from "./modules/ToDo";

const store = createStore(ToDo, applyMiddleware(thunkMiddleware));

export default store;