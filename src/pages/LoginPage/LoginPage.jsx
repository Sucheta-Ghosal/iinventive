import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import './LoginPage.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate login for now
    alert(`Logged in as ${username}`);
    navigate('/');
  };

  return (
    <div className="login-page">
      <Header />
      <main className="login-content">
        <div className="login-card">
          <h2>Welcome Back</h2>
          <p>Please enter your credentials to access your account.</p>
          
          <form className="login-form" onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input 
                type="text" 
                id="username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username" 
                required 
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password" 
                required 
              />
            </div>

            <button type="submit" className="login-submit-btn">
              Sign In
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
