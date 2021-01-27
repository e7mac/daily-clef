import React, { Component } from 'react';
import Nav from './components/Nav';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import './App.css';

import MusicLog from './components/MusicLog';
import APIService from './services/APIService';

class App extends Component {
  constructor(props) {
    super(props);
    const urlParams = new URLSearchParams(window.location.search);
    const u = urlParams.get('user');
    this.state = {
      displayed_form: '',
      logged_in: localStorage.getItem('token') ? true : false,
      username: '',
      api: new APIService()
    };
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
      this.setState({
        logged_in: true,
        displayed_form: '',
        username: username,
        api: new APIService()
      });
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

  render() {
    return (
      <div className="App">
      <h3>
      {this.state.logged_in || this.state.api.demo
        ? <MusicLog api={this.state.api} handle_logout={this.handle_logout} />
        : <LoginForm handle_login={this.handle_login} />
      }
      </h3>
      </div>
      );
  }
}

export default App;