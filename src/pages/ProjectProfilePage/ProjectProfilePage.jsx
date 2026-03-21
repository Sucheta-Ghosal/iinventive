import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { categoryBackgrounds } from '../../data/projectsData';
import './ProjectProfilePage.css';

function ProjectProfilePage() {
  const { projectSlug } = useParams();
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [interested, setInterested] = useState(false);

  const handleToggleInterest = async () => {
    if (!userInfo || !project) return;
    try {
      const res = await fetch(`http://localhost:5000/api/users/interest/${project._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userInfo._id })
      });
      const data = await res.json();
      if (res.ok) {
        setInterested(data.interested);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleShareURL = () => {
    const projectUrl = window.location.href;
    navigator.clipboard.writeText(projectUrl).then(() => {
      alert("Project URL copied to clipboard! Share it with your network.");
    }).catch(err => {
      console.error("Failed to copy URL:", err);
      alert("Failed to copy URL. Please try again.");
    });
  };

  useEffect(() => {
    const stored = localStorage.getItem('userInfo');
    let currentUserInfo = null;
    if (stored) {
      currentUserInfo = JSON.parse(stored);
      setUserInfo(currentUserInfo);
    }

    window.scrollTo(0, 0);
    setLoading(true);
    fetch(`http://localhost:5000/api/projects/profile/${projectSlug}`)
      .then(res => res.json())
      .then(data => {
        // If data returns successfully and isn't a 404 message object
        if (!data.message) {
          setProject(data);
          
          if (currentUserInfo && currentUserInfo.role === 'VC') {
            fetch(`http://localhost:5000/api/users/interest/${currentUserInfo._id}`)
              .then(res => res.json())
              .then(interests => {
                if (Array.isArray(interests) && interests.includes(data._id)) {
                  setInterested(true);
                } else {
                  setInterested(false);
                }
              })
              .catch(err => console.error("Error connecting explicitly to interests endpoints natively.", err));
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [projectSlug]);

  if (loading) {
    return (
      <div className="profile-page">
        <Header />
        <main className="profile-content not-found">
          <h2>Loading Project Details...</h2>
        </main>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="profile-page">
        <Header />
        <main className="profile-content not-found">
          <h2>Project Not Found</h2>
          <button onClick={() => navigate(-1)} className="back-btn">Go Back</button>
        </main>
      </div>
    );
  }

  const bgImage = categoryBackgrounds[project.type];
  const pageStyle = bgImage ? {
    backgroundImage: `linear-gradient(to bottom, rgba(248, 250, 252, 0.35), rgba(248, 250, 252, 0.95)), url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed'
  } : {};

  return (
    <div className="profile-page" style={pageStyle}>
      <Header />
      
      <main className="profile-content">
        <button onClick={() => navigate(-1)} className="back-btn">← Back to Category</button>
        
        <header className="profile-header">
          <h1>{project.title}</h1>
          <div className="submitted-by-large">
            <span className="badge">Affiliation</span>
            <h2>{project.affiliation}</h2>
          </div>
        </header>

        <section className="profile-description">
          <h3>Project Description</h3>
          <p>{project.description}</p>
        </section>

        {project.picture && project.picture.length > 0 && (
          <section className="profile-gallery">
            <h3>Gallery</h3>
            <div className="gallery-grid">
              {project.picture.map((imgUrl, idx) => (
                <div className="gallery-image-wrapper" key={idx}>
                  <img src={imgUrl} alt={`${project.title} - view ${idx + 1}`} />
                </div>
              ))}
            </div>
          </section>
        )}

        {userInfo && userInfo.role === 'VC' && project && (
          <div className="interest-section" style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'rgba(255, 255, 255, 0.5)', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h4 style={{ margin: 0, color: '#0f172a', fontSize: '1.1rem' }}>Interested in funding or mentoring this project?</h4>
              <p style={{ margin: '0.3rem 0 0 0', color: '#475569', fontSize: '0.9rem' }}>Express your interest to formally connect with these innovators.</p>
            </div>
            <button 
              onClick={handleToggleInterest}
              style={{
                background: interested ? 'transparent' : 'linear-gradient(90deg, #3b82f6, #6366f1)',
                color: interested ? '#0284c7' : 'white',
                border: interested ? '1px solid #0284c7' : 'none',
                padding: '0.8rem 1.5rem',
                fontSize: '1.05rem',
                fontWeight: '600',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {interested ? '✓ Expressed Interest' : '★ Express Interest'}
            </button>
          </div>
        )}

        {userInfo && project.userId && userInfo._id === project.userId && (
          <div style={{ marginTop: '3rem', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <button className="share-btn" onClick={handleShareURL}>
              🔗 Share Project Link
            </button>
          </div>
        )}

      </main>
    </div>
  );
}

export default ProjectProfilePage;
