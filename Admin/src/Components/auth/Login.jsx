import React, { useState } from 'react';
import axios from 'axios'; // Import Axios
import './Login.css'; // Make sure to create and import a CSS file for styling
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for showing password

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://api.ssdipl.com/api/log-in', {
        email,
        password,
      });
      console.log(response)
      if (response.status === 200) {
        sessionStorage.setItem('token', response.data.token);
        sessionStorage.setItem('login', true);
        sessionStorage.setItem('role', response.data.data.role);
        sessionStorage.setItem('name', response.data.data.name);
        sessionStorage.setItem('teamLeaderId', response.data.data.teamLeaderId);
        window.location.href = '/dashboard';
      }
    } catch (error) {
      // Check if the error response exists
      console.log(error)
      if (error.response) {
        // Handle server errors (Invalid email/password)
        toast.error(error.response.data.message || 'Invalid email or password');
      } else {
        // Handle network or other errors
        toast.error('Server error. Please try again later.');
      }
    }
  };

  return (
    <>
      <div className="main-login">
        <div className="login-container">
          <h2 className="login-title">Admin Login</h2>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'} // Toggle input type
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                  required
                />
                <button 
                  type="button" 
                  className="show-password-button" 
                  onClick={() => setShowPassword(!showPassword)} // Toggle show/hide
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <button type="submit" className="login-button">Login</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
