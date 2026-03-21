import React, { useEffect } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { projectsData, categoryBackgrounds } from '../../data/projectsData';
import './ProjectsPage.css';

function ProjectsPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  
  // Need to decode since URLs will have '%20'
  const categoryTitle = decodeURIComponent(categoryId);
  const projects = projectsData[categoryTitle];

  const bgImage = categoryBackgrounds[categoryTitle];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categoryTitle]);

  if (!projects) {
    return <Navigate to="/" />; // Redirect if invalid category
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

        <div className="projects-list">
          {projects.map((project) => (
            <div 
              className="project-card clickable" 
              key={project.id}
              onClick={() => navigate(`/project/${project.id}`)}
            >
              <h3>{project.title}</h3>
              <div className="submitted-by">
                <span className="badge">Submitted By</span>
                <strong>{project.submittedBy}</strong>
              </div>
              <p className="description">{project.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default ProjectsPage;
