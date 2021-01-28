import React, { Component } from 'react';
import LoginForm from './components/LoginForm';
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
  }

  componentDidMount() {
    const script = document.createElement("script");

    script.src = "https://cdn.jsdelivr.net/combine/npm/tone@14.7.58,npm/@magenta/music@1.21.0/es6/core.js,npm/focus-visible@5,npm/html-midi-player@1.1.0";
    script.async = true;

    document.body.appendChild(script);    
    document.title = "Daily Clef"

    if (this.state.logged_in || this.state.api.demo) {
      this.timer = setInterval(this.refreshStatus, 3000);
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null;
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
    this.state.api.handle_logout()
    this.setState({ logged_in: false, username: '' });
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
      <Navbar bg="light" expand="lg" className="panel-body">
        <Navbar.Brand href="/daily-clef">Daily Clef</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        {this.state.logged_in || this.state.api.demo
          ? <React.Fragment><Nav className="mr-auto">
            <Upload api={this.state.api} />
            <Nav.Link onClick={this.onRecord}>Record</Nav.Link>
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
          <Nav.Link onClick={this.handle_logout}>Logout</Nav.Link>
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
            : <LoginForm handle_login={this.handle_login} />
      }
      </Container>
      </div>
      );
    }
  }

  export default App;