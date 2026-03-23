import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import './DataEntryPage.css';

function DataEntryPage() {
  const navigate = useNavigate();

  React.useEffect(() => {
    const stored = localStorage.getItem('userInfo');
    if (!stored) {
      navigate('/login');
      return;
    }
    const userInfo = JSON.parse(stored);
    if (userInfo.role !== 'Superadmin') {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="data-entry-page">
      <Header />
      <main className="data-entry-content">
        <div className="selection-container">
          <h2>Data Entry Portal</h2>
          <p>Select the type of profile you want to create:</p>
          <div className="options-grid">
            <button className="option-btn vc-btn" onClick={() => navigate('/data-entry/vc')}>
              <h3>Create a VC</h3>
              <p>Register a new Venture Capitalist profile into the database.</p>
            </button>
            <button className="option-btn participant-btn" onClick={() => navigate('/data-entry/participant')}>
              <h3>Create a Participant</h3>
              <p>Register an Innovator or Startup and capture their complete project data.</p>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DataEntryPage;
