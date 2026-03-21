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
      <button className="login-btn" onClick={() => navigate('/login')}>Login</button>
    </header>
  );
}

export default Header;
