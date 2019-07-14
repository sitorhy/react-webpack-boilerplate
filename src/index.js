import React from "react";
import ReactDOM from "react-dom";
import {createHashHistory} from "history";

import App from "./components/App";

import "./common/styles/app.less"

const HistoryContext = React.createContext({
    history:createHashHistory()
});

ReactDOM.render(
    (
        <HistoryContext.Provider>
            <App/>
        </HistoryContext.Provider>
    ),
    document.getElementById("app")
);