import { Container, Collapse, Navbar, Nav } from 'react-bootstrap';
import React, { Component } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginContainer from './components/LoginContainer';
import './App.css';
import MusicLog from './components/MusicLog';
import Menubar from './components/Menubar';
import APIService from './services/APIService';
import Recorder from './components/Recorder'
import Player from './components/Player'
import Stats from './components/Stats'
import unmute from './lib/unmute'
import SignupForm from './components/SignupForm';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayed_form: '',
      logged_in: localStorage.getItem('access_token') ? true : false,
      username: '',
      api: new APIService(),
      playingItem: null,
      status: "",
    };
    this.onPlay = this.onPlay.bind(this);
  }

  componentDidMount() {
    const scripts_srcs = [
      "https://cdn.jsdelivr.net/combine/npm/tone@14.7.58,npm/@magenta/music@1.23.1/es6/core.js,npm/focus-visible@5,npm/html-midi-player@1.5.0",
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
              ? <Routes>
                  <Route path="/record" element={<Recorder api={this.state.api} />} />
                  <Route path="/stats" element={<Stats api={this.state.api} />} />
                  <Route path="/" element={
                    <React.Fragment>
                      <MusicLog onPlay={this.onPlay} api={this.state.api} playingItem={this.state.playingItem} />
                    </React.Fragment>
                  } />
                </Routes>
              : <Routes>
                  <Route path="/signup" element={<SignupForm api={this.state.api} />} />
                  <Route path="/" element={<LoginContainer api={this.state.api} />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
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

export default App;
