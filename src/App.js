import React, { Component } from 'react';
import LoginContainer from './components/LoginContainer';
import { Alert, Container, Navbar, Nav } from 'react-bootstrap';
import './App.css';
import LabelBar from './components/LabelBar'

import MusicLog from './components/MusicLog';
import APIService from './services/APIService';
import Upload from './components/Upload'
import Recorder from './components/Recorder'
import Player from './components/Player'
import PlayCalendar from './components/PlayCalendar'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayed_form: '',
      logged_in: localStorage.getItem('token') ? true : false,
      username: '',
      api: new APIService(),
      clipgroupsets: [],
      playingItem: null,
      record: false,
      status: "",
    };
    this.refreshStatus = this.refreshStatus.bind(this);
    this.timer = null

    this.loadClips = this.loadClips.bind(this);
    this.onPlay = this.onPlay.bind(this);
    this.onRecord = this.onRecord.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.endTimer = this.endTimer.bind(this);
  }

  componentDidMount() {

    const scripts_srcs = [
      "https://cdn.jsdelivr.net/combine/npm/tone@14.7.58,npm/focus-visible@5",
      "https://midi-practice.s3-us-west-1.amazonaws.com/js/core.js",
      "https://midi-practice.s3-us-west-1.amazonaws.com/js/midi-player.js",
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
      (task_count.conversion_tasks > 0 ? " Converting ":"" )
      + (task_count.transcription_tasks > 0 ? " Transcribing ":"" )
      + (task_count.segmentation_tasks > 0 ? " Segmenting ":"" )
      + (task_count.classification_tasks > 0 ? " Classifying ":"" )
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

  loadClipsForLabel = (label) => {
    this.state.api.loadClipsForLabel(label)
    this.state.api.clipGetter.loadClips().then((clipgroupsets) => {
      this.setState({
        clipgroupsets: clipgroupsets
      })      
    })
  }

  loadClips = () => {
    this.state.api.clipGetter.loadClips().then((clipgroupsets) => {
      this.setState({
        clipgroupsets: clipgroupsets
      })
    })
  }

  onPlay = (item) => {
      this.setState({
        playingItem: item
      })
  }

  onRecord = () => {
    this.setState({
      record: true
    })
  }

  render() {
    return (
      <div className="App">
      <Navbar bg="light" expand="lg" className="panel-body" sticky="top">
        <Navbar.Brand href="/daily-clef">Daily Clef</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        {this.state.logged_in || this.state.api.demo
          ? <React.Fragment><Nav className="mr-auto">
          {
            this.state.logged_in
            ? <React.Fragment>
                <Upload api={this.state.api} />
                <Nav.Link onClick={this.onRecord}>Record</Nav.Link>
              </React.Fragment>
            : ""
          }
            <LabelBar api={this.state.api} loadClipsForLabel={this.loadClipsForLabel} />
            <Player playingItem={this.state.playingItem} />
            {
              this.state.status.length > 0
              ? <Alert key={0} variant='secondary'>
                {this.state.status}
                </Alert>
              : <br/>
            }
          </Nav>
          {
            this.state.logged_in
            ? <Nav.Link onClick={this.handle_logout}>Logout</Nav.Link>
            : ""
          }          
          </React.Fragment>
          :""
        }
        </Navbar.Collapse>
      </Navbar>
      <Container>
      {this.state.record
        ?  <Recorder api={this.state.api}/>
        : this.state.logged_in || this.state.api.demo
            ? <React.Fragment><PlayCalendar api={this.state.api}/><MusicLog onPlay={this.onPlay} items={this.state.clipgroupsets} api={this.state.api} loadClips={this.loadClips}/></React.Fragment>
            : <LoginContainer handle_login={this.handle_login}/>
      }
      </Container>
      </div>
      );
    }
  }

  export default App;