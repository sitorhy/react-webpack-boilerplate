import React from "react";
import {Link} from "react-router";

class Home extends React.Component
{
    render()
    {
        return (
            <div>
                <div>
                    <p>Home Page</p>
                    <div>
                        <Link to={"/home/welcome"}>Welcome</Link>
                    </div>
                    <div>
                        <Link to={"/home/about"}>About</Link>
                    </div>
                    <div>
                        <Link to={"/home/todo"}>ToDo</Link>
                    </div>
                    <div>
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;