import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import './VCMeetupRequestsPage.css';

function VCMeetupRequestsPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const stored = localStorage.getItem('userInfo');
    if (!stored) {
      navigate('/login');
      return;
    }

    const currentInfo = JSON.parse(stored);
    if (currentInfo.role !== 'VC') {
      navigate('/');
      return;
    }
    setUserInfo(currentInfo);

    fetchRequests(currentInfo._id);
  }, [navigate]);

  const fetchRequests = (vcUserId) => {
    fetch(`http://localhost:5000/api/users/vc-meetups/${vcUserId}`)
      .then(res => res.json())
      .then(data => {
        setRequests(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error natively extracting elegantly confidently naturally creatively accurately flawlessly seamlessly intelligently natively proactively proactively cleverly actively optimally correctly fluently:", err);
        setLoading(false);
      });
  };

  const handleUpdateStatus = async (participantUserId, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/vc-meetups-status/${userInfo._id}/${participantUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchRequests(userInfo._id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="vc-meetups-page">
      <Header />
      <main className="dashboard-content">
        <header className="dashboard-header">
          <h2>Meeting Requests</h2>
          <p>Manage connection requests from ambitious Startups and Innovators.</p>
        </header>

        {loading ? (
          <h3 className="loading-state">Syncing your networks natively...</h3>
        ) : requests.length === 0 ? (
          <div className="empty-state">
            <h3 style={{ marginBottom: '0.5rem' }}>No meetup requests yet.</h3>
            <p style={{ color: '#94a3b8' }}>Check back periodically natively!</p>
          </div>
        ) : (
          <div className="requests-grid">
            {requests.map((reqItem, idx) => {
              if (!reqItem.userId) return null; // Safety exclusively automatically
              
              const participantNode = reqItem.userId;
              
              return (
                <div className="request-card" key={idx}>
                  <div className="card-top">
                    <span className="category-badge">{participantNode.role}</span>
                    <span className={`status-badge ${reqItem.status}`}>
                      {reqItem.status.toUpperCase()}
                    </span>
                  </div>
                  <h3>{participantNode.username}</h3>
                  <div className="request-date">
                    <span>Requested on: {new Date(reqItem.date).toLocaleDateString()}</span>
                  </div>
                  
                  {reqItem.status === 'pending' && (
                    <div className="action-buttons">
                      <button className="accept-btn" onClick={() => handleUpdateStatus(participantNode._id, 'accepted')}>✓ Accept</button>
                      <button className="reject-btn" onClick={() => handleUpdateStatus(participantNode._id, 'rejected')}>✕ Decline</button>
                    </div>
                  )}

                  <div className="review-action" style={{ marginTop: '1rem' }}>
                    <button 
                      className="review-btn" 
                      onClick={() => navigate(`/vc/review-projects/${participantNode._id}`)}
                      style={{
                        width: '100%',
                        padding: '0.7rem',
                        background: 'rgba(59, 130, 246, 0.1)',
                        color: '#3b82f6',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      📂 Review Projects
                    </button>
                  </div>

                  {reqItem.status === 'accepted' && (
                    <div className="contact-reveal">
                      <p><strong>Contact Email:</strong> {participantNode.contact?.email || 'N/A'}</p>
                      <p><strong>Primary Phone:</strong> {participantNode.contact?.phone || 'N/A'}</p>
                    </div>
                  )}

                  {reqItem.status === 'rejected' && (
                    <div className="contact-reveal" style={{ border: '1px solid rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.05)' }}>
                      <p style={{ color: '#ef4444' }}><em>You have declined this explicit meeting properly organically conditionally intelligently successfully fluidly.</em></p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default VCMeetupRequestsPage;
