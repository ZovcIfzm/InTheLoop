import React, { Component } from 'react';
import logo from './logo.gif';
import './App.css';
import SMSForm from './SMSForm';
import { GROUPME_ACCESS_TOKEN } from './env.js';
import { Button, Checkbox, Tooltip, TextField } from '@material-ui/core';

import styles from "./style.js";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";

class App extends Component {
  state = {
    data: [],
    selectedGroupId: null,
    selectedGroupName: null,
    keywords: null,
    messages: [],
  }

  //ComponentDidMount runs each time the page is reloaded
  componentDidMount(){
    //Causes the notifyIfFlagRaised function to run every second
    this.interval = setInterval(() => this.notifyIfFlagRaised(), 1000);

    //This fetches all the group chats the user is in
    let baseUrl = "https://api.groupme.com/v3";
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
              console.log(data.response)
              this.setState({
                data: data.response
              })
            })
        })
    .catch((error) => console.log(error));
  }
        
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  //This handles updating the keywords value in state when editing the "Flagged Keywords" textfield
  handleKeywordChange = (event) => {
    this.setState({
        keywords: event.target.value.toLowerCase().replace(/\s/g, '').split(','),
    });
  };

  //This retrieves the selected group chat's groupme messages
  checkGroupMeMessages = () => {
    let baseUrl = "https://api.groupme.com/v3";
    let getGroupsOptions = {
      method: "GET",
      headers: {
        Accept: 'application/json',
                'Content-Type': 'application/json',
      },
    }
    let fetchUrl = baseUrl + "/groups/" + this.state.selectedGroupId + "/messages?token=" + GROUPME_ACCESS_TOKEN
    console.log("fetchUrl:", fetchUrl) 
    fetch(fetchUrl, getGroupsOptions)
    .then((response) => {
        if (!response.ok) throw Error(response.statusText);
            response.json().then(data => {
              console.log(data.response)
              this.setState({
                messages: data.response.messages
              })
            })
        })
    .catch((error) => console.log(error));
  }
  
  //This checks if any keyword is in the lastText, if so, it prints to console log
  notifyIfFlagRaised = () => {
    if(this.state.messages.length != 0){
      let lastText = this.state.messages[this.state.messages.length -1].text;
      let flagRaised = false;
      let wordIndex;
      for(wordIndex in this.state.keywords){
        console.log("lastText", lastText)
        if (lastText.includes(this.state.keywords[wordIndex])){
          console.log("lastText flag raised! ", this.state.keywords[wordIndex])
        }
      }
    }
    
  }

  render() {
    
    const { classes } = this.props;
    return (
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div className={classes.container}>
          <div className={classes.column}>
            <img src={logo} className="App-logo" alt="logo" />
            <SMSForm />
            <div>
              Selected group: {this.state.selectedGroupName}
            </div>
            <div className={classes.column}>
              <Tooltip title="Enter the keywords you want to be notified for (separate by comma)" placement="top-start">
              <TextField
                  id="standard-number"
                  label="Flagged keywords"
                  color="secondary"
                  defaultValue={this.state.keywords}
                  InputProps={{
                    onChange: this.handleKeywordChange,
                  }}
              />
              </Tooltip>
            </div>
            <div className={classes.column}>
              Current Group Chats
              {this.state.data.map((group, i)=>(
                <Button
                  key={i}
                  variant="contained"
                  component="label"
                  color="primary"
                  className={classes.analyzeButton}
                  onClick={()=>{
                    this.setState({
                      selectedGroupId: group.id,
                      selectedGroupName: group.name
                    })
                  }}
                >
                  {group.name}
                </Button>
              ))}
            </div>
            <Button
              variant="contained"
              component="label"
              color="primary"
              className={classes.analyzeButton}
              onClick={()=>this.checkGroupMeMessages()}
              >
                Manually check group message
            </Button>
            <div>
              Group chat messages:
              {this.state.messages.map((msg, i)=>(
                <div key={i}>{msg.text}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default withStyles(styles)(App);