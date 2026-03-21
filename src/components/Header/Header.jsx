import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('userInfo');
    if (stored) {
      setUserInfo(JSON.parse(stored));
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    navigate('/');
  };

  return (
    <header className="header">
      <Link to="/" style={{ textDecoration: 'none' }}>
        <h1 className="logo">iinventive <span>2026</span></h1>
      </Link>
      <div className="nav-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {userInfo && userInfo.role === 'VC' ? (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.95rem' }}>VC Logged In: <strong>{userInfo.username}</strong></span>
            <button className="login-btn" onClick={handleLogout} style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', color: '#ef4444' }}>Logout</button>
          </div>
        ) : (
          <>
            <button className="login-btn" onClick={() => navigate('/data-entry')} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#f8fafc' }}>Data Entry</button>
            <button className="login-btn" onClick={() => navigate('/login')}>Login</button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
