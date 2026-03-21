import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import './DataEntryPage.css';

function CreateParticipantPage() {
  const navigate = useNavigate();
  const [participantData, setParticipantData] = useState({
    role: 'Innovator', // or Startup
    username: '', password: '', email: '', phone: '',
    projectTitle: '', projectType: 'Health Care', projectDescription: '', affiliation: ''
  });

  const handleParticipantSubmit = (e) => {
    e.preventDefault();
    console.log("Participant Data Submitted:", participantData);
    alert("Participant & Project Data Submitted Successfully!");
    navigate('/data-entry');
  };

  return (
    <div className="data-entry-page">
      <Header />
      <main className="data-entry-content">
        <div className="form-container">
          <button className="back-btn" onClick={() => navigate('/data-entry')}>← Back to Options</button>
          <h2>Register Participant & Innovation</h2>
          <form onSubmit={handleParticipantSubmit} className="data-form">
            <div className="form-section">
              <h3>User Details</h3>
              <div className="form-group">
                <label>Role</label>
                <select value={participantData.role} onChange={(e) => setParticipantData({...participantData, role: e.target.value})}>
                  <option value="Innovator">Innovator</option>
                  <option value="Startup">Startup</option>
                </select>
              </div>
              <div className="form-group row">
                <div className="half">
                  <label>Username</label>
                  <input type="text" value={participantData.username} onChange={(e) => setParticipantData({...participantData, username: e.target.value})} required />
                </div>
                <div className="half">
                  <label>Password</label>
                  <input type="password" value={participantData.password} onChange={(e) => setParticipantData({...participantData, password: e.target.value})} required />
                </div>
              </div>
              <div className="form-group row">
                <div className="half">
                  <label>Email</label>
                  <input type="email" value={participantData.email} onChange={(e) => setParticipantData({...participantData, email: e.target.value})} required />
                </div>
                <div className="half">
                  <label>Phone</label>
                  <input type="tel" value={participantData.phone} onChange={(e) => setParticipantData({...participantData, phone: e.target.value})} />
                </div>
              </div>
            </div>

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
              <div className="form-group">
                <label>Affiliation (Institute / Startup Name)</label>
                <input type="text" value={participantData.affiliation} onChange={(e) => setParticipantData({...participantData, affiliation: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Project Description</label>
                <textarea rows="6" maxLength="5000" value={participantData.projectDescription} onChange={(e) => setParticipantData({...participantData, projectDescription: e.target.value})} required></textarea>
              </div>
            </div>

            <button type="submit" className="submit-btn">Create Participant & Project</button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default CreateParticipantPage;
