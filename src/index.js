import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {createHashHistory} from "history";
import store from "./store";

import App from "./components/App";

import "./common/styles/app.less"

const HistoryContext = React.createContext({
    history: createHashHistory()
});

ReactDOM.render(
    (
        <Provider store={store}>
            <HistoryContext.Provider>
                <App/>
            </HistoryContext.Provider>
        </Provider>
    ),
    document.getElementById("app")
);