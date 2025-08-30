import React, { useState } from 'react';
import ThemeToggle from '../components/ThemeToggle';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/forms.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
   const {name , value} = e.target;
   setFormData({...formData , [name] : value})
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement login logic
    console.log('Login attempt:', formData);
    axios.post('http://localhost:3000/api/auth/login', {
      email : formData.email,
      password : formData.password
    },
    {
      withCredentials : true
    }
  ).then((res)=>{
    console.log(res);
    navigate('/');
  }).catch((err)=>{
    console.log(err);
  }).finally(()=>{
    console.log("Login attempt completed");
  })
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-form-container">
          <ThemeToggle />
          <h1>Welcome Back</h1>
          <p>Sign in to your account to continue</p>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                // value={formData.email} // isko dene se kuch bhi paste nahi kar paa rahe hai
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                // value={formData.password} // isko dene se kuch bhi paste nahi kar paa rahe hai
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>
            
            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" /> Remember me
              </label>
              <a href="/forgot-password" className="forgot-link">Forgot Password?</a>
            </div>
            
            <button type="submit" className="btn btn-primary btn-full">
              Sign In
            </button>
          </form>
          
          <div className="signup-link">
            <p>Don't have an account? <a href="/register">Sign up here</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
