import React, { Component } from 'react';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import { Container, Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';
import './App.css';
import LabelBar from './components/LabelBar'

import MusicLog from './components/MusicLog';
import APIService from './services/APIService';
import Upload from './components/Upload'
import Player from './components/Player'
import PlayCalendar from './components/PlayCalendar'

class App extends Component {
  constructor(props) {
    super(props);
    const urlParams = new URLSearchParams(window.location.search);
    const u = urlParams.get('user');
    this.state = {
      displayed_form: '',
      logged_in: localStorage.getItem('token') ? true : false,
      username: '',
      api: new APIService(),
      clipgroupsets: [],
      playingItem: null
    };
    this.loadClips = this.loadClips.bind(this);
    this.onPlay = this.onPlay.bind(this);
  }

  componentDidMount() {
    const script = document.createElement("script");

    script.src = "https://cdn.jsdelivr.net/combine/npm/tone@14.7.58,npm/@magenta/music@1.21.0/es6/core.js,npm/focus-visible@5,npm/html-midi-player@1.1.0";
    script.async = true;

    document.body.appendChild(script);    
    document.title = "Daily Clef"
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

  render() {
    return (
      <div className="App">
      <Navbar bg="light" expand="lg" className="panel-body">
        <Navbar.Brand href="/">Daily Clef</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        {this.state.api.demo || !this.state.api.demo
          ? <React.Fragment><Nav className="mr-auto">
            <Upload api={this.state.api} />
            <Nav.Link onClick={this.handle_logout}>Record</Nav.Link>
            <LabelBar api={this.state.api} loadClipsForLabel={this.loadClipsForLabel} />
            <Player playingItem={this.state.playingItem} />
          </Nav>
          <Nav.Link onClick={this.handle_logout}>Logout</Nav.Link>
          </React.Fragment>
          :""
        }
        </Navbar.Collapse>
      </Navbar>
      <Container>
      {this.state.logged_in || this.state.api.demo
        ? <React.Fragment><PlayCalendar api={this.state.api}/><MusicLog onPlay={this.onPlay} items={this.state.clipgroupsets} api={this.state.api} loadClips={this.loadClips}/></React.Fragment>
        : <LoginForm handle_login={this.handle_login} />
      }
      </Container>
      </div>
      );
    }
  }

  export default App;