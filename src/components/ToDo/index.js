import React from "react";

import store from "../../store";
import {addToDo, delToDo, sendToDo} from "../../store/modules/ToDo/actions";

class Demo extends React.Component {
    constructor(props)
    {
        super(props);
        this.state={
            text:"",
            todos:[]
        };

        this.unsubscribe=store.subscribe(()=>
        {
            this.setState({todos:store.getState().todos});
        });
    }

    render() {
        return (
            <div>
                <div>
                    <p>What needs to be done</p>
                </div>
                <input onChange={(event)=>{
                    this.setState({text:event.target.value})
                }} type="text"/>
                <div>Inputing:{this.state.text}</div>
                <div>
                    <button onClick={this.onBtnAddSyncClick.bind(this)}>add sync</button>
                </div>
                <div>
                    <button onClick={this.onBtnAddASyncClick.bind(this)}>add async</button>
                </div>
                <ul>
                    {
                        this.state.todos.map((i)=>{
                          return (
                              <li key={i.index}>
                                  <span>{i.text}</span>
                                  <button onClick={()=>this.onBtnDelClick(i.index)}>del</button>
                              </li>
                          );
                        })
                    }
                </ul>
            </div>
        );
    }

    onBtnAddSyncClick() {
        if(this.state.text)
        {
            store.dispatch(addToDo(this.state.text));
        }
    }

    onBtnAddASyncClick() {
        if(this.state.text)
        {
            store.dispatch(sendToDo(this.state.text)).then(({text})=>
            {
                alert(`added the text:${text} after 3s.`);
            });
        }
    }

    onBtnDelClick(index) {
        store.dispatch(delToDo(index));
    }

    componentDidMount() {

    }

    componentWillUnmount() {
        this.unsubscribe();
    }
}

export default Demo;