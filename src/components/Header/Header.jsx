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
      <div className="nav-actions">
        {userInfo ? (
          <div className="nav-user-actions">
            <span className="user-role-badge">{userInfo.role} Logged In: <strong>{userInfo.username}</strong></span>
            {userInfo.role === 'VC' && (
              <>
                <button className="login-btn" onClick={() => navigate('/vc/meetups')} style={{ background: 'rgba(236, 72, 153, 0.15)', border: '1px solid rgba(236, 72, 153, 0.4)', color: '#ec4899' }}>Meetup Requests</button>
                <button className="login-btn" onClick={() => navigate('/vc/dashboard')} style={{ background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.4)', color: '#38bdf8' }}>My Interests</button>
              </>
            )}
            {(userInfo.role === 'Innovator' || userInfo.role === 'Startup') && (
              <>
                <button className="login-btn" onClick={() => navigate('/participant/timeline')} style={{ background: 'rgba(236, 72, 153, 0.15)', border: '1px solid rgba(236, 72, 153, 0.4)', color: '#ec4899' }}>Meetup Timeline</button>
                <button className="login-btn" onClick={() => navigate('/participant/dashboard')} style={{ background: 'rgba(52, 211, 153, 0.15)', border: '1px solid rgba(52, 211, 153, 0.4)', color: '#34d399' }}>My Projects</button>
              </>
            )}
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
