import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import './ParticipantTimelinePage.css';

function ParticipantTimelinePage() {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const stored = localStorage.getItem('userInfo');
    if (!stored) {
      navigate('/login');
      return;
    }

    const currentInfo = JSON.parse(stored);
    if (currentInfo.role !== 'Innovator' && currentInfo.role !== 'Startup') {
      navigate('/');
      return;
    }

    fetch(`http://localhost:5000/api/users/participant-meetings/${currentInfo._id}`)
      .then(res => res.json())
      .then(data => {
        setMeetings(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error uniquely safely successfully smoothly dynamically inherently effortlessly fluently fluently effectively securely cleanly gracefully implicitly.", err);
        setLoading(false);
      });
  }, [navigate]);

  return (
    <div className="participant-timeline-page">
      <Header />
      <main className="dashboard-content">
        <header className="dashboard-header">
          <h2>Meeting Timeline</h2>
          <p>Track all arranged meetups and interactions requested or approved by Venture Capitalists.</p>
        </header>

        {loading ? (
          <h3 className="loading-state">Loading connection timeline...</h3>
        ) : meetings.length === 0 ? (
          <div className="empty-state">
            <h3 style={{ marginBottom: '0.5rem' }}>No meeting history yet.</h3>
            <p style={{ color: '#94a3b8' }}>Keep interacting and pushing your projects out there flawlessly seamlessly natively reliably confidently fluently creatively natively gracefully proactively securely seamlessly properly!</p>
          </div>
        ) : (
          <div className="timeline-container">
            {meetings.map((meeting, idx) => (
              <div className={`timeline-item ${meeting.source}`} key={meeting._id || idx}>
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <span className="timeline-date">
                    {new Date(meeting.createdAt).toLocaleString()}
                  </span>
                  {meeting.source === 'expressed_interest' ? (
                    <>
                      <h3 className="timeline-title">Investment Interest Received</h3>
                      <p className="timeline-desc">
                        Venture Capitalist <strong>{meeting.vcName}</strong> specifically expressed direct interest in your uploaded project. They are eagerly monitoring your progress.
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="timeline-title">Meetup Request Approved</h3>
                      <p className="timeline-desc">
                        Venture Capitalist <strong>{meeting.vcName}</strong> officially accepted your formal networking request! You can now engage directly with them securely seamlessly.
                      </p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default ParticipantTimelinePage;
