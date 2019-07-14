import {createStore, applyMiddleware} from "redux";
import thunkMiddleware from "redux-thunk";

import env from "./modules/env";

const store = createStore(env, applyMiddleware(thunkMiddleware));

export default store;