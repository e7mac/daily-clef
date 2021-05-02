import React from 'react';

class LoginForm extends React.Component {
  state = {
    username: '',
    password: ''
  };


  handle_login = (e, data) => {
    e.preventDefault();
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
      <form onSubmit={e => this.handle_login(e, this.state)}>
        <h4>Log In</h4>
        <label htmlFor="username">Username </label>
        <input
          type="text"
          name="username"
          autoCapitalize="none"
          value={this.state.username}
          onChange={this.handle_change}
        />
        <br /><label htmlFor="password">Password </label>
        <input
          type="password"
          name="password"
          value={this.state.password}
          onChange={this.handle_change}
        />
        <br /><input type="submit" value="Log in" />
      </form>
    );
  }
}

export default LoginForm;
