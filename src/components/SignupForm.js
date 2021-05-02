import PropTypes from 'prop-types';
import React from 'react';

class SignupForm extends React.Component {
  state = {
    username: '',
    password: ''
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
      .then(res => {
        this.props.api.handle_login(data)
          .then(username => {
            window.location.reload()
            // this.setState({
            // logged_in: true,
            // displayed_form: '',
            // username: username,
            // api: new APIService()
            // });
          });
      })
  };

  handle_change = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(prevstate => {
      const newState = { ...prevstate };
      newState[name] = value;
      return newState;
    });
  };

  render() {
    return (
      <form onSubmit={e => this.handle_signup(e, this.state)}>
        <h4>Sign Up</h4>
        <br /><label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          value={this.state.username}
          onChange={this.handle_change}
        />
        <br /><label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          value={this.state.password}
          onChange={this.handle_change}
        />
        <br /><input type="submit" value="Sign Up" />
      </form>
    );
  }
}

export default SignupForm;

SignupForm.propTypes = {
  handle_signup: PropTypes.func.isRequired
};