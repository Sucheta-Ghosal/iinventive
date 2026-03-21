import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { projectsData } from '../../data/projectsData';
import './ProjectsPage.css';

function ProjectsPage() {
  const { categoryId } = useParams();
  
  // Need to decode since URLs will have '%20'
  const categoryTitle = decodeURIComponent(categoryId);
  const projects = projectsData[categoryTitle];

  const categoryBackgrounds = {
    "Health Care": "/images/healthcare_bg.png",
    "Materials Science": "/images/materials_bg.png",
    "Earth Sciences": "/images/earth_bg.png",
    "Artificial Intelligence": "/images/ai_bg.png",
    "Semiconductor Technology & Chip Design": "/images/semi_bg.png"
  };
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
            <div className="project-card" key={project.id}>
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
