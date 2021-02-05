import { Alert, Container, Collapse, Navbar, Nav } from 'react-bootstrap';
import { withRouter } from 'react-router-dom'
import React, { Component } from 'react';

import LabelBar from './components/LabelBar'
import LoginContainer from './components/LoginContainer';

import './App.css';

import {
  HashRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import MusicLog from './components/MusicLog';
import APIService from './services/APIService';
import Upload from './components/Upload'
import Recorder from './components/Recorder'
import Player from './components/Player'
import PlayCalendar from './components/PlayCalendar'
import Stats from './components/Stats'
import unmute from './lib/unmute'

import logo from './logo.svg'

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
    this.refreshStatus = this.refreshStatus.bind(this);
    this.timer = null

    this.onPlay = this.onPlay.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.endTimer = this.endTimer.bind(this);

    this.setStatus = this.setStatus.bind(this);

    this.musicLogRef = React.createRef()
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

    if (this.state.logged_in && !this.state.api.demo) {
      this.startTimer()
    }
    let context = (window.AudioContext || window.webkitAudioContext) ?
      new (window.AudioContext || window.webkitAudioContext)() : null;
    // Pass it to unmute if the context exists... ie WebAudio is supported
    if (context) unmute(context);
  }

  startTimer() {
    this.timer = setInterval(this.refreshStatus, 3000);
  }

  endTimer() {
    clearInterval(this.timer);
    this.timer = null;
  }

  componentWillUnmount() {
    this.endTimer()
  }

  refreshStatus() {
    this.state.api.getStatus().then((response) => {
      console.log(response)
      const task_count = response.response
      const status =
        (task_count.conversion_tasks > 0 ? " Converting " : "")
        + (task_count.transcription_tasks > 0 ? " Transcribing " : "")
        + (task_count.segmentation_tasks > 0 ? " Segmenting " : "")
        + (task_count.classification_tasks > 0 ? " Classifying " : "")
      this.setState({
        status: status
      })
    })
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

  handle_logout = () => {
    this.endTimer()
    this.state.api.handle_logout()
    this.setState({ logged_in: false, username: '' });
    window.location.reload()
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
          <Navbar bg="dark" variant="dark" expand="sm" className="panel-body">
            <Link to="/"><Navbar.Brand className="brand"><img src={logo} className="logo" alt="logo" />Daily Clef</Navbar.Brand></Link>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              {this.state.logged_in || this.state.api.demo
                ? <React.Fragment>
                  <Nav className="mr-auto">
                    {
                      this.state.logged_in
                        ? <React.Fragment>
                          <Upload api={this.state.api} setStatus={this.setStatus} />
                          <Nav.Link href="#record">Record</Nav.Link>
                        </React.Fragment>
                        : ""
                    }
                    <LabelBar api={this.state.api} loadAllClips={this.loadAllClips} loadClipsForLabel={this.loadClipsForLabel} />
                    <Nav.Link href="#stats">Stats</Nav.Link>
                    {
                      this.state.status.length > 0
                        ? <Alert key={0} variant='secondary'>
                          {this.state.status}
                        </Alert>
                        : <br />
                    }
                  </Nav>
                  {
                    this.state.logged_in
                      ? <Nav.Link onClick={this.handle_logout}>Logout</Nav.Link>
                      : ""
                  }
                </React.Fragment>
                : ""
              }
            </Navbar.Collapse>
          </Navbar>
          <Container className="container-infinite-scroll">
            {this.state.logged_in || this.state.api.demo
              ? <Switch>
                <Route path="/record">
                  <Recorder api={this.state.api} />
                </Route>
                <Route path="/stats">
                  <Stats />
                </Route>
                <Route path="/">
                  <React.Fragment>
                    <PlayCalendar api={this.state.api} />
                    <MusicLog ref={this.musicLogRef} onPlay={this.onPlay} items={this.state.clipgroupsets} api={this.state.api} loadClips={this.loadClips} />
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