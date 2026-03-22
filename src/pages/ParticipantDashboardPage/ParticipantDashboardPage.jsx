import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import './ParticipantDashboardPage.css';

function ParticipantDashboardPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const stored = localStorage.getItem('userInfo');
    if (!stored) {
      navigate('/login');
      return;
    }

    const userInfo = JSON.parse(stored);
    if (userInfo.role !== 'Innovator' && userInfo.role !== 'Startup') {
      navigate('/');
      return;
    }

    fetch(`http://localhost:5000/api/users/participant-projects/${userInfo._id}`)
      .then(res => res.json())
      .then(data => {
        setProjects(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching participant projects:", err);
        setLoading(false);
      });
  }, [navigate]);



  return (
    <div className="participant-dashboard-page">
      <Header />
      <main className="dashboard-content">
        <header className="dashboard-header">
          <h2>My Submitted Projects</h2>
          <p>Manage and share the innovations you've brought to life on the platform.</p>
        </header>

        {loading ? (
          <h3 className="loading-state">Loading your innovations...</h3>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <h3 style={{ marginBottom: '0.5rem' }}>No projects submitted yet.</h3>
            <p style={{ color: '#94a3b8' }}>You haven't uploaded any cutting-edge solutions.</p>
            <button onClick={() => navigate('/data-entry')} className="create-btn">Submit First Project</button>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => (
              <div 
                className="dashboard-project-card clickable" 
                key={project._id || project.id}
                onClick={() => navigate(`/project/${project._id}/${project.slug}`)}
              >
                <div className="card-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span className="category-badge">{project.type}</span>
                </div>
                <h3>{project.title}</h3>
                <div className="submitted-by">
                  <span className="badge">Affiliation</span>
                  <strong>{project.affiliation}</strong>
                </div>
                <p className="description">
                  {project.description && project.description.length > 130 
                    ? project.description.substring(0, 130) + '...' 
                    : project.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default ParticipantDashboardPage;
