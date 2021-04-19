import React, { Component } from 'react';
import logo from './logo.gif';
import './App.css';
import SMSForm from './SMSForm';
import { Button, Tooltip, TextField, Checkbox } from '@material-ui/core';
import * as qs from 'qs'
import styles from "./style.js";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";

let GROUPME_ACCESS_TOKEN = null

class App extends Component {
  state = {
    data: [],
    selectedGroupId: null,
    groupToIndexMap: {},
    selectedGroupName: "None",
    keywords: [],
    potentialKeyword: null,
    messages: [],
    submitting: null,
    error: null,
    lastAlertedText: null,
    boxes: [[[false, "test"], [false, "hw"], [false, "exam"], [false, "ia"], [false, "study"], [false, "grades"]]],
  }

  //ComponentDidMount runs each time the page is reloaded
  componentDidMount(){
    GROUPME_ACCESS_TOKEN = qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).access_token
    console.log("token:", GROUPME_ACCESS_TOKEN)
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
              let response = data.response
              let curBoxes = this.state.boxes
              let curGroupIdToIndexMap = this.state.groupToIndexMap
              for (var i = 0; i < response.length; i++){
                if (i != 0){
                  let newBoxes = []
                  for (var j = 0; j < curBoxes[0].length; j++){
                    newBoxes.push([...curBoxes[0][j]])
                  }
                  curBoxes.push(newBoxes)
                }
                curGroupIdToIndexMap[response[i].id] = i
              }
              this.setState({
                data: response,
                boxes: curBoxes,
                groupToIndexMap: curGroupIdToIndexMap
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
      potentialKeyword: event.target.value.toLowerCase()
    });
  };

  handleNewFlag = () => {
    if (this.state.potentialKeyword != null){
      let curBoxes = this.state.boxes
      let groupIndex = this.state.groupToIndexMap[this.state.selectedGroupId]
      curBoxes[groupIndex].push([false, this.state.potentialKeyword])
      this.setState({
        boxes: curBoxes,
        potentialKeyword: null
      })
    }
  }

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
              let curMessages = data.response.messages
              for (var i = 0; i < curMessages.length; i++){
                if (curMessages[i].text != null){
                  curMessages[i].text = curMessages[i].text.toLowerCase()
                }
              }
              this.setState({
                messages: curMessages
              })
            })
        })
    .catch((error) => console.log(error));
  }
  
  //This checks if any keyword is in the lastText, if so, it prints to console log
  notifyIfFlagRaised = () => {
    console.log("keywords", this.state.keywords)
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

  handleCheck = (id) => {
    
    let groupIndex = this.state.groupToIndexMap[this.state.selectedGroupId]

    let curState = this.state.boxes
    curState[groupIndex][id][0] = !curState[groupIndex][id][0]
    
    let curWords = this.state.keywords
    let word = this.state.boxes[groupIndex][id][1].toLowerCase()
    let wordIndex = curWords.indexOf(word)
    if (wordIndex == -1){
      curWords.push(word)
    }
    else{
      curWords.splice(wordIndex, 1)
    }

    this.setState({
      boxes: curState,
      keywords: curWords
    })
  }

  render() {
    
    const { classes } = this.props;
    return (
      <div>
        {GROUPME_ACCESS_TOKEN ? 
          <div className={classNames(classes.main, classes.mainRaised)}>
            <div className={classes.container}>
              <div className={classes.row}>
                <img src={logo} className={classes.logo} />
                <div className={classes.column}>
                  <Button
                      variant="contained"
                      component="label"
                      color="green"
                      className={classes.analyzeButton}
                    >
                    Select a Group Chat
                  </Button>
                  <div style={{height: 10}}/>
                  <div className={classes.column}>
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
                </div>
                <div className={classes.column}>
                  { this.state.selectedGroupId ?
                  <div className={classes.column}>
                    <div className={classes.row}>
                      <Tooltip title="Enter a single word representing the new flag you want, it will not be case-sensitive" placement="top-start">
                      <TextField
                          id="standard-number"
                          label="Add new flag"
                          color="secondary"
                          defaultValue={this.state.keywords}
                          InputProps={{
                            onChange: this.handleKeywordChange,
                          }}
                      />
                      </Tooltip>
                      <Button
                          variant="contained"
                          component="label"
                          color="primary"
                          className={classes.deleteButton}
                          onClick={this.handleNewFlag}
                        >
                          Add
                      </Button>
                    </div>
                    {this.state.boxes[this.state.groupToIndexMap[this.state.selectedGroupId]].map((group, i) => (
                      <div className={classes.row}>
                        <Checkbox
                          color="white"
                          inputProps={{ 'aria-label': 'secondary checkbox' }}
                          checked={group[0]}
                          onChange={() => this.handleCheck(i)}
                        />
                        <div className={classes.textBox}>
                          {group[1]}
                        </div>
                        <Button
                          key={i}
                          variant="contained"
                          component="label"
                          color="primary"
                          className={classes.deleteButton}
                          onClick={()=>{
                            
                            
                            //handle keyword removal
                            let curWords = this.state.keywords
                            let groupIndex = this.state.groupToIndexMap[this.state.selectedGroupId]
                            let word = this.state.boxes[groupIndex][i][1].toLowerCase()
                            let wordIndex = curWords.indexOf(word)
                            if (wordIndex != -1){
                              curWords.splice(wordIndex, 1)
                            }

                            // handle box removal
                            let curBoxes = this.state.boxes
                            curBoxes[groupIndex].splice(i,1)
                            
                            this.setState({
                              boxes: curBoxes,
                              keywords: curWords
                            })
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    ))
                    }

                  </div> : null}
                </div>
              </div>
              <div style={{height: 10}}/>
              <div className={classes.leftColumn}>
                { this.state.selectedGroupId ?
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
                </div> : null}
              </div>
            </div>
          </div>
          :
          <div>
            <div className={classNames(classes.main, classes.mainRaised)}>
              <div className={classes.container}>
                <div className={classes.column}>
                  <img src={logo} className={classes.logo} />
                  <Button
                    variant="contained"
                    component="label"
                    color="green"
                    className={classes.loginButton}
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href='https://oauth.groupme.com/oauth/authorize?client_id=TVKKkI1pOw2vyhtoXYGpkQ8GNGodU8mxNXxfS2juUt2vOVFg';
                      }}
                  >
                    Login to GroupMe
                  </Button>
                  </div>
              </div>
            </div>
          </div>
          }
        </div>
    );
  }
}


export default withStyles(styles)(withRouter(App));