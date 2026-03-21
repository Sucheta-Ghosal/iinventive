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

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    fetch(`http://localhost:5000/api/projects/profile/${projectSlug}`)
      .then(res => res.json())
      .then(data => {
        // If data returns successfully and isn't a 404 message object
        if (!data.message) {
          setProject(data);
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
      </main>
    </div>
  );
}

export default ProjectProfilePage;
