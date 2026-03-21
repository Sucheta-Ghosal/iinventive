import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import './LoginPage.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('userInfo', JSON.stringify(data));
        navigate('/');
      } else {
        setError(data.message || 'Verification failed');
      }
    } catch (err) {
      setError('Network communication failed natively securely.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Header />
      <main className="login-content">
        <div className="login-card">
          <h2>Welcome Back</h2>
          <p>Please enter your credentials to access your account.</p>
          
          {error && <div style={{color: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)', padding: '0.8rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem'}}>{error}</div>}
          
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

            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
