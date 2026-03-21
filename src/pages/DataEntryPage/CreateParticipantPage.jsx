import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import './DataEntryPage.css';

function CreateParticipantPage() {
  const navigate = useNavigate();
  const [participantData, setParticipantData] = useState({
    role: 'Innovator', // or Startup
    username: '', password: '', email: '', phone: '',
    projectTitle: '', projectType: 'Health Care', projectDescription: '', affiliation: '', picture: ''
  });
  
  const [usernameStatus, setUsernameStatus] = useState('idle'); // idle, checking, exists, new
  const [checkingError, setCheckingError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkUsername = async () => {
    if (!participantData.username) return;
    setUsernameStatus('checking');
    try {
      const res = await fetch(`http://localhost:5000/api/users/check/${participantData.username}`);
      const data = await res.json();
      if (data.exists) {
        if (data.role !== participantData.role) {
          setCheckingError(`This username is already registered as a ${data.role}. Please change your role selection or choose another username.`);
          setUsernameStatus('error');
        } else {
          setCheckingError('');
          setUsernameStatus('exists');
          setParticipantData(prev => ({ ...prev, affiliation: data.affiliation || '' }));
        }
      } else {
        setCheckingError('');
        setUsernameStatus('new');
      }
    } catch (err) {
      console.error(err);
      setUsernameStatus('idle');
    }
  };

  const handleParticipantSubmit = async (e) => {
    e.preventDefault();
    if (usernameStatus === 'checking' || usernameStatus === 'error') {
       alert("Please resolve username issues first.");
       return;
    }
    if (usernameStatus === 'idle') {
      alert("Please verify the username first by clicking 'Check Username'.");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    // Prepare payload
    const payload = {
      role: participantData.role,
      username: participantData.username,
      title: participantData.projectTitle,
      type: participantData.projectType,
      affiliation: participantData.affiliation,
      description: participantData.projectDescription,
      picture: participantData.picture
    };
    
    if (usernameStatus === 'new') {
      payload.password = participantData.password;
      payload.email = participantData.email;
      payload.phone = participantData.phone;
    }

    try {
      const response = await fetch('http://localhost:5000/api/participants/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      
      if (response.ok) {
        alert("Participant & Project Registered Successfully!");
        navigate('/');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error connecting to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="data-entry-page">
      <Header />
      <main className="data-entry-content">
        <div className="form-container">
          <button className="back-btn" onClick={() => navigate('/data-entry')}>← Back to Options</button>
          <h2>Register Participant & Innovation</h2>
          {error && <div style={{color: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem'}}>{error}</div>}
          <form onSubmit={handleParticipantSubmit} className="data-form">
            <div className="form-section">
              <h3>User Details</h3>
              <div className="form-group row">
                <div className="half">
                  <label>Role</label>
                  <select value={participantData.role} onChange={(e) => {
                    setParticipantData({...participantData, role: e.target.value});
                    setUsernameStatus('idle');
                  }}>
                    <option value="Innovator">Innovator</option>
                    <option value="Startup">Startup</option>
                  </select>
                </div>
                <div className="half">
                  <label>Username</label>
                  <div style={{display: 'flex', gap: '0.5rem'}}>
                    <input type="text" value={participantData.username} onChange={(e) => {
                      setParticipantData({...participantData, username: e.target.value});
                      setUsernameStatus('idle');
                    }} required style={{flex: 1}}/>
                    <button type="button" onClick={checkUsername} style={{padding: '0.5rem 1rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'}}>
                      {usernameStatus === 'checking' ? '...' : 'Verify'}
                    </button>
                  </div>
                  {usernameStatus === 'exists' && <small style={{color: '#34d399', fontWeight: 600}}>User explicitly exists! Password & Contact hidden.</small>}
                  {usernameStatus === 'new' && <small style={{color: '#fbbf24', fontWeight: 600}}>New Identity securely confirmed! Please enter your details below.</small>}
                  {usernameStatus === 'error' && <small style={{color: '#ef4444', fontWeight: 600}}>{checkingError}</small>}
                </div>
              </div>
              
              {usernameStatus === 'new' && (
                <>
                  <div className="form-group row" style={{marginTop: '1rem'}}>
                    <div className="half">
                      <label>Password</label>
                      <input type="password" value={participantData.password} onChange={(e) => setParticipantData({...participantData, password: e.target.value})} required />
                    </div>
                  </div>
                  <div className="form-group row" style={{marginTop: '1rem'}}>
                    <div className="half">
                      <label>Email</label>
                      <input type="email" value={participantData.email} onChange={(e) => setParticipantData({...participantData, email: e.target.value})} required />
                    </div>
                    <div className="half">
                      <label>Phone</label>
                      <input type="tel" value={participantData.phone} onChange={(e) => setParticipantData({...participantData, phone: e.target.value})} />
                    </div>
                  </div>
                </>
              )}
            </div>

            {(usernameStatus === 'exists' || usernameStatus === 'new') && (
              <div className="form-section">
                <h3>Innovation Details</h3>
                <div className="form-group">
                  <label>Project Title</label>
                  <input type="text" value={participantData.projectTitle} onChange={(e) => setParticipantData({...participantData, projectTitle: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Project Category Type</label>
                  <select value={participantData.projectType} onChange={(e) => setParticipantData({...participantData, projectType: e.target.value})}>
                    <option value="Health Care">Health Care</option>
                    <option value="Materials Science">Materials Science</option>
                    <option value="Earth Sciences">Earth Sciences</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Semiconductor Technology & Chip Design">Semiconductor Technology & Chip Design</option>
                  </select>
                </div>
                {usernameStatus === 'new' && (
                  <div className="form-group">
                    <label>Affiliation (Institute / Startup Name)</label>
                    <input type="text" value={participantData.affiliation} onChange={(e) => setParticipantData({...participantData, affiliation: e.target.value})} required />
                  </div>
                )}
                <div className="form-group">
                  <label>Project Picture URL (Optional)</label>
                  <input type="url" value={participantData.picture} onChange={(e) => setParticipantData({...participantData, picture: e.target.value})} placeholder="https://example.com/image.jpg" />
                </div>
                <div className="form-group">
                  <label>Project Description</label>
                  <textarea rows="6" maxLength="5000" value={participantData.projectDescription} onChange={(e) => setParticipantData({...participantData, projectDescription: e.target.value})} required></textarea>
                </div>
              </div>
            )}

            <button type="submit" className="submit-btn" disabled={loading || (usernameStatus !== 'exists' && usernameStatus !== 'new')}>
              {loading ? 'Registering...' : 'Create Participant & Project'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default CreateParticipantPage;
