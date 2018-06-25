import React from "react";
import {Router} from "react-router";

import routes from "../../routes";

class App extends React.Component
{
    render()
    {
        return (
            <Router routes={routes}>
                <div>
                    {this.props.children}
                </div>
            </Router>
        );
    }
}

export default App;