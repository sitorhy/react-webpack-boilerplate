import React from "react";

class Home extends React.Component
{
    about=()=>{
        this.props.history.push("/about");
    };

    render()
    {
        return (
            <div>
                <button className="primary-btn" onClick={this.about}>BasicTest</button>
            </div>
        );
    }
}

export default Home;