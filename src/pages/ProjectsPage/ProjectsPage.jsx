import React, { useEffect, useState } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { categoryBackgrounds } from '../../data/projectsData';
import './ProjectsPage.css';

function ProjectsPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  
  const categoryTitle = decodeURIComponent(categoryId);
  const bgImage = categoryBackgrounds[categoryTitle];

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    fetch(`http://localhost:5000/api/projects/category/${encodeURIComponent(categoryTitle)}`)
      .then(res => res.json())
      .then(data => {
        setProjects(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [categoryTitle]);

  if (!categoryBackgrounds[categoryTitle]) {
    return <Navigate to="/" />;
  }

  const pageStyle = bgImage ? {
    backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.82), rgba(15, 23, 42, 0.98)), url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed'
  } : {};

  return (
    <div className="projects-page" style={pageStyle}>
      <Header />
      <main className="projects-content">
        <div className="projects-header">
          <h2>{categoryTitle} - Innovator Projects</h2>
          <p>Discover the groundbreaking solutions and ideas submitted under this theme.</p>
        </div>

        {loading ? (
          <h3 style={{ color: '#f8fafc' }}>Loading projects...</h3>
        ) : projects.length === 0 ? (
          <h3 style={{ color: '#f8fafc', fontStyle: 'italic', textAlign: 'center', marginTop: '2rem' }}>This category currently has no projects submitted.</h3>
        ) : (
          <div className="projects-list">
            {projects.map((project) => (
              <div 
                className="project-card clickable" 
                key={project._id || project.id}
                onClick={() => navigate(`/project/${project.slug}`)}
              >
                <h3>{project.title}</h3>
                <div className="submitted-by">
                  <span className="badge">Affiliation</span>
                  <strong>{project.affiliation}</strong>
                </div>
                <p className="description">{project.description && project.description.length > 130 ? project.description.substring(0, 130) + '...' : project.description}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default ProjectsPage;
