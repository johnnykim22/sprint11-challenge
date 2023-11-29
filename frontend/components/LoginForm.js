import React, { useState } from 'react';
import PT from 'prop-types';
import { useNavigate } from 'react-router-dom'; 
import axiosWithAuth from '../axios/axiosWithAuth'; 
import axios from 'axios';


const initialFormValues = {
  username: '',
  password: '',
};

export default function LoginForm({ login }) {
  const [values, setValues] = useState(initialFormValues);
  const navigate = useNavigate();
  
  const onChange = evt => {
    const { name, value } = evt.target; // use name attribute for inputs
    setValues({ ...values, [name]: value });
  };

  const onSubmit = evt => {
    evt.preventDefault();
  
    axios.post('http://localhost:9000/api/login', values)
      .then(res => {
        localStorage.setItem('token', res.data.token); 
        
        navigate('/articles');
        // if (login) login(res.data.message); // If login prop is a function, call it with the success message
      })
      .catch(err => {
        console.error(err); // Log or handle error as needed
      });
  };

  const isDisabled = values.username.trim().length < 3 || values.password.trim().length < 8; 

  return (
    <form id="loginForm" onSubmit={onSubmit}>
      <h2>Login</h2>
      <input
        maxLength={20}
        name="username" // change id to name
        value={values.username}
        onChange={onChange}
        placeholder="Enter username"
      />
      <input
        type="password" 
        maxLength={20}
        name="password" // change id to name
        value={values.password}
        onChange={onChange}
        placeholder="Enter password"
      />
      <button disabled={isDisabled} id="submitCredentials">Submit credentials</button>
    </form>
  );
}

LoginForm.propTypes = {
  login: PT.func, // login is not required if you don't use it, so it's not marked as .isRequired
};
