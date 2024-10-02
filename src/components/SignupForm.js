import React, { useState } from 'react';
import PropTypes from 'prop-types';

const SignupForm = ({ api }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://midi-practice.herokuapp.com/api/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await api.handle_login(formData);
        window.location.reload();
      } else {
        // Handle error (e.g., show error message to user)
        console.error('Signup failed');
      }
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <h4>Sign Up</h4>
      <div>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Sign Up</button>
    </form>
  );
};

SignupForm.propTypes = {
  api: PropTypes.shape({
    handle_login: PropTypes.func.isRequired
  }).isRequired
};

export default SignupForm;
