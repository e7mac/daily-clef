import { Container, Collapse, Navbar, Nav } from 'react-bootstrap';
import { withRouter } from 'react-router-dom'
import React, { Component } from 'react';

import LoginContainer from './components/LoginContainer';

import './App.css';

import {
  HashRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import MusicLog from './components/MusicLog';
import Menubar from './components/Menubar';
import APIService from './services/APIService';
import Recorder from './components/Recorder'
import Player from './components/Player'
import Stats from './components/Stats'
import unmute from './lib/unmute'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayed_form: '',
      logged_in: localStorage.getItem('token') ? true : false,
      username: '',
      api: new APIService(),
      playingItem: null,
      status: "",
    };

    this.onPlay = this.onPlay.bind(this);
  }

  componentDidMount() {

    const scripts_srcs = [
      "https://cdn.jsdelivr.net/combine/npm/tone@14.7.58,gh/e7mac/js-dist@1.0.0/core.js,npm/focus-visible@5,gh/e7mac/js-dist@1.0.0/midi-player.min.js",
    ]

    for (const scripts_src of scripts_srcs) {
      const script = document.createElement("script");
      script.src = scripts_src;
      script.async = true;
      document.body.appendChild(script);
    }

    document.title = "Daily Clef"

    let context = (window.AudioContext || window.webkitAudioContext) ?
      new (window.AudioContext || window.webkitAudioContext)() : null;
    // Pass it to unmute if the context exists... ie WebAudio is supported
    if (context) unmute(context);
  }

  handle_login = (e, data) => {
    e.preventDefault();
    this.state.api.handle_login(data)
      .then(username => {
        window.location.reload()
        // this.setState({
        // logged_in: true,
        // displayed_form: '',
        // username: username,
        // api: new APIService()
        // });
      });
  };

  handle_signup = (e, data) => {
    e.preventDefault();
    fetch('https://midi-practice.herokuapp.com/api/users/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(json => {
        localStorage.setItem('token', json.token);
        this.setState({
          logged_in: true,
          displayed_form: '',
          username: json.username
        });
      });
  };

  onPlay = (item) => {
    this.setState({
      playingItem: item
    })
  }

  onRelabel = (clip_id, label_name) => {
    console.log(clip_id, label_name)
  }

  setStatus = (status) => {
    this.setState({
      status: status
    })
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Menubar api={this.state.api} />
          <Container className="container-infinite-scroll">
            {this.state.logged_in || this.state.api.demo
              ? <Switch>
                <Route path="/record">
                  <Recorder api={this.state.api} />
                </Route>
                <Route path="/stats">
                  <Stats api={this.state.api} />
                </Route>
                <Route path="/">
                  <React.Fragment>
                    <MusicLog onPlay={this.onPlay} api={this.state.api} />
                  </React.Fragment>
                </Route>
              </Switch>
              : <LoginContainer handle_login={this.handle_login} />
            }
          </Container>
          <Collapse in={this.state.playingItem}>
            <Navbar bg="dark" className="panel-body" fixed="bottom">
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                  <Player playingItem={this.state.playingItem} />
                </Nav>
              </Navbar.Collapse>
            </Navbar>
          </Collapse>
        </div>
      </Router >
    );
  }
}

export default withRouter(App);