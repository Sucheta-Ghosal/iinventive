import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { getProjectById, categoryBackgrounds } from '../../data/projectsData';
import './ProjectProfilePage.css';

function ProjectProfilePage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  const project = getProjectById(projectId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [projectId]);

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

  const bgImage = categoryBackgrounds[project.category];
  const pageStyle = bgImage ? {
    backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.98)), url(${bgImage})`,
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
            <span className="badge">Submitted By</span>
            <h2>{project.submittedBy}</h2>
          </div>
        </header>

        <section className="profile-description">
          <h3>Project Overview</h3>
          <p>{project.longDescription}</p>
        </section>

        {project.images && project.images.length > 0 && (
          <section className="profile-gallery">
            <h3>Gallery</h3>
            <div className="gallery-grid">
              {project.images.map((imgUrl, idx) => (
                <div className="gallery-image-wrapper" key={idx}>
                  <img src={imgUrl} alt={`${project.title} - view ${idx + 1}`} />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default ProjectProfilePage;
