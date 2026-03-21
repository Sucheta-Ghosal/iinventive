import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {
  const navigate = useNavigate();

  return (
    <header className="header">
      <Link to="/" style={{ textDecoration: 'none' }}>
        <h1 className="logo">iinventive <span>2026</span></h1>
      </Link>
      <div className="nav-actions" style={{ display: 'flex', gap: '1rem' }}>
        <button className="login-btn" onClick={() => navigate('/data-entry')} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#f8fafc' }}>Data Entry</button>
        <button className="login-btn" onClick={() => navigate('/login')}>Login</button>
      </div>
    </header>
  );
}

export default Header;
