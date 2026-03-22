import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import './ReviewProjectsPage.css';

function ReviewProjectsPage() {
  const { participantId } = useParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [participantName, setParticipantName] = useState('');
  const [acceptedProjects, setAcceptedProjects] = useState([]);
  const [rejectedProjects, setRejectedProjects] = useState([]);

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

    fetchProjects();
    fetchAcceptedMeetings(currentInfo._id);
  }, [participantId, navigate]);

  const fetchProjects = () => {
    fetch(`http://localhost:5000/api/users/participant-projects/${participantId}`)
      .then(res => res.json())
      .then(data => {
        setProjects(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching projects:", err);
        setLoading(false);
      });
  };

  const fetchAcceptedMeetings = (vcUserId) => {
    fetch(`http://localhost:5000/api/users/participant-meetings/${participantId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const acceptedIds = data.filter(m => m.vcId === vcUserId && m.projectId).map(m => m.projectId);
          setAcceptedProjects(acceptedIds);
        }
      })
      .catch(err => console.error("Error fetching meetings:", err));
  };

  const handleAcceptProject = async (projectId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/accept-project-meetup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vcUserId: userInfo._id,
          participantUserId: participantId,
          projectId
        })
      });
      if (res.ok) {
        setAcceptedProjects(prev => [...prev, projectId]);
        // Remove from rejected if it was there (just in case)
        setRejectedProjects(prev => prev.filter(id => id !== projectId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectProject = (projectId) => {
    setRejectedProjects(prev => [...prev, projectId]);
    // Note: This is local-only for now as requested. 
    // If persistent rejection is needed, a backend endpoint would be required.
  };

  return (
    <div className="review-projects-page">
      <Header />
      <main className="dashboard-content">
        <header className="dashboard-header">
          <button onClick={() => navigate(-1)} className="back-btn">← Back to Requests</button>
          <h2>Review Projects</h2>
          <p>Carefully evaluate and accept specific projects for connection.</p>
        </header>

        {loading ? (
          <h3 className="loading-state">Loading projects...</h3>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <h3>No projects found for this participant.</h3>
          </div>
        ) : (
          <div className="projects-list">
            {projects.map((project) => (
              <div className="project-review-card" key={project._id}>
                <div className="project-info">
                  <h3 
                    className="project-title-link" 
                    onClick={() => navigate(`/project/${project.slug}`)}
                  >
                    {project.title}
                  </h3>
                  <p className="project-excerpt">{project.description.substring(0, 150)}...</p>
                </div>
                
                <div className="project-actions">
                  {acceptedProjects.includes(project._id) ? (
                    <span className="accepted-label">✓ Accepted</span>
                  ) : rejectedProjects.includes(project._id) ? (
                    <span className="rejected-label" style={{ color: '#ef4444', fontWeight: 'bold' }}>✕ Declined</span>
                  ) : (
                    <>
                      <button className="accept-project-btn" onClick={() => handleAcceptProject(project._id)}>Accept</button>
                      <button className="reject-project-btn" onClick={() => handleRejectProject(project._id)}>Decline</button>
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

export default ReviewProjectsPage;
