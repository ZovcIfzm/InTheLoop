import React, { Component } from 'react';
import logo from './logo.gif';
import './App.css';
import SMSForm from './SMSForm';
import { GROUPME_ACCESS_TOKEN } from './env.js';
import { Button, Tooltip, TextField } from '@material-ui/core';

import styles from "./style.js";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";

class App extends Component {
  state = {
    data: [],
    selectedGroupId: null,
    selectedGroupName: "None",
    keywords: null,
    messages: [],
    submitting: null,
    error: null,
    lastAlertedText: null,
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
    fetch(fetchUrl, getGroupsOptions)
    .then((response) => {
        if (!response.ok) throw Error(response.statusText);
            response.json().then(data => {
              this.setState({
                messages: data.response.messages
              })
            })
        })
    .catch((error) => console.log(error));
  }
  
  //This checks if any keyword is in the lastText, if so, it prints to console log
  notifyIfFlagRaised = () => {
    if(this.state.selectedGroupId){
      this.checkGroupMeMessages()
    }
    if(this.state.messages.length !== 0){
      let lastText = this.state.messages[this.state.messages.length -1].text;
      let wordIndex;
      if (lastText){
        for(wordIndex in this.state.keywords){
          if (lastText.includes(this.state.keywords[wordIndex])){

            //If the flag was raised for the lastText, it'll send you a text message- then say that no more messages can be sent for this particular lastText
            if (this.state.lastAlertedText !== lastText){
              console.log("lastText flag raised! ", this.state.keywords[wordIndex])
              this.setState({ submitting: true, lastAlertedText: lastText });
              fetch('/api/messages', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  to: '+15178993829',
                  body: 'alert: ' + lastText,
                })
              })
                .then(res => res.json())
                .then(data => {
                  if (data.success) {
                    this.setState({
                      error: false,
                      submitting: false,
                      message: {
                        to: '+15178993829',
                        body: 'alert: ' + lastText,
                      }
                    });
                  } else {
                    this.setState({
                      error: true,
                      submitting: false
                    });
                  }
                });
            }
          }
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
            <img src={logo} className={classes.logo} />
            <div style={{height: 10}}/>
            <Button
                variant="contained"
                component="label"
                color="green"
                className={classes.analyzeButton}
              >
              Selected group: {this.state.selectedGroupName}
            </Button>
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
            <div style={{height: 10}}/>
            <Button
                variant="contained"
                component="label"
                color="green"
                className={classes.analyzeButton}
              >
                  
              Select a Group Chat
            </Button>
            <div style={{height: 10}}/>
            <div className={classes.row}>
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
            <div style={{height: 10}}/>
            <div style={{textAlign: "left"}}>
              <Button
                variant="contained"
                component="label"
                color="green"
                className={classes.analyzeButton}
              >
                Group chat messages:
              </Button>
              <div style={{height: 10}}/>
              {this.state.messages.map((msg, i)=>(
                <div style={{color: "white"}} key={i}>{msg.name}: {msg.text}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default withStyles(styles)(App);