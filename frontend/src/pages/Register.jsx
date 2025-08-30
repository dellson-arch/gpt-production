import React, { useState } from 'react';
import ThemeToggle from '../components/ThemeToggle';
import { Link , useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/forms.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    console.log('Registration attempt:', formData);
    axios.post('http://localhost:3000/api/auth/register', {
      email: formData.email,
      fullname: {
        firstname: formData.firstname,
        lastname: formData.lastname
      },
      password: formData.password
    }, {
      withCredentials: true
    }).then((res) => {
      console.log(res);
      navigate('/');
    }).catch((err) => {
      console.log(err);
      if (err.response?.data?.message) {
        setErrors({ general: err.response.data.message });
      } else {
        setErrors({ general: 'Registration failed. Please try again.' });
      }
    }).finally(() => {
      console.log("Registration attempt completed");
    });
  };

  return (
    <div className="register-page">
      <div className="container">
        <div className="register-form-container">
          <ThemeToggle />
          <h1>Create Account</h1>
          <p>Join us and start your AI journey today</p>
          
          {errors.general && (
            <div className="error-message" style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>
              {errors.general}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstname">First Name</label>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="lastname">Last Name</label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
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
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                required
              />
              {errors.password && (
                <div className="error-message" style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  {errors.password}
                </div>
              )}
            </div>
            
            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" required /> I agree to the Terms of Service and Privacy Policy
              </label>
            </div>
            
            <button type="submit" className="btn btn-primary btn-full">
              Create Account
            </button>
          </form>
          
          <div className="login-link">
            <p>Already have an account? <a href="/login">Sign in here</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
