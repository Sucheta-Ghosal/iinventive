import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import './DataEntryPage.css';

function CreateVcPage() {
  const navigate = useNavigate();
  const [vcData, setVcData] = useState({
    username: '', password: '', email: '', phone: '', about: '', picture: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVcData(prev => ({ ...prev, picture: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVcSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/users/vc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(vcData)
      });

      const data = await response.json();

      if (response.ok) {
        alert("VC Profile Registered Successfully in the Database!");
        navigate('/');
      } else {
        setError(data.message || 'Failed to register VC');
      }
    } catch (err) {
      setError('Network error: Unable to reach the server.');
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
          <h2>Register Venture Capitalist</h2>
          {error && <div style={{color: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem'}}>{error}</div>}
          <form onSubmit={handleVcSubmit} className="data-form">
            <div className="form-section">
              <h3>Core User Identity (VC Role)</h3>
              <div className="form-group row">
                <div className="half">
                  <label>Username</label>
                  <input type="text" value={vcData.username} onChange={(e) => setVcData({...vcData, username: e.target.value})} required />
                </div>
                <div className="half">
                  <label>Password</label>
                  <input type="password" value={vcData.password} onChange={(e) => setVcData({...vcData, password: e.target.value})} required />
                </div>
              </div>
              <div className="form-group row">
                <div className="half">
                  <label>Contact Email</label>
                  <input type="email" value={vcData.email} onChange={(e) => setVcData({...vcData, email: e.target.value})} required />
                </div>
                <div className="half">
                  <label>Contact Phone (Optional)</label>
                  <input type="tel" value={vcData.phone} onChange={(e) => setVcData({...vcData, phone: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>VC Details Spec</h3>
              <div className="form-group">
                <label>Profile Picture (Browse files)</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="file-input"
                />
                {vcData.picture && (
                  <div className="image-preview" style={{ marginTop: '0.8rem' }}>
                    <img src={vcData.picture} alt="Preview" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #e2e8f0' }} />
                    <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>Picture ready</p>
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>About (Max 5000 Characters)</label>
                <textarea rows="6" maxLength="5000" value={vcData.about} onChange={(e) => setVcData({...vcData, about: e.target.value})} required></textarea>
              </div>
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Registering...' : 'Register VC Model'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default CreateVcPage;
