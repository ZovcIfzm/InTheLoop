import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import SMSForm from './SMSForm';
import { GROUPME_ACCESS_TOKEN } from './env.js';
import { Button, Checkbox, Tooltip, TextField } from '@material-ui/core';

class App extends Component {
  state = {
    data: []
  }
  componentDidMount(){
    //https://api.groupme.com/v3/groups?token=YOUR_ACCESS_TOKEN
    let baseUrl = "https://api.groupme.com/v3";
    /*
    let form = new FormData();
    form.append("wakeup", "wakeup server");
    let analyze_options = {
        method: "POST",
        headers: {
          Accept: 'application/json',
                  'Content-Type': 'application/json',
        },
        body: form,
    };*/

    let getGroupsOptions = {
      method: "GET",
      headers: {
        Accept: 'application/json',
                'Content-Type': 'application/json',
      },
    }
    fetch(baseUrl + "/groups?token=" + GROUPME_ACCESS_TOKEN, getGroupsOptions)
    .then((response) => {
        if (!response.ok) throw Error(response.statusText);
            response.json().then(data => {
              this.setState({
                data: data.response
              })
            })
        })
    .catch((error) => console.log(error));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <SMSForm />
          {this.state.data.map((group)=>(
            <b>{group.name}</b>
          ))}
        </header>
      </div>
    );
  }
}

export default App;
