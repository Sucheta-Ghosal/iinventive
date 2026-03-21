import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CategoryCard.css';

function CategoryCard({ title, institute, bgImage, index }) {
  const navigate = useNavigate();
  const cardStyle = {
    animationDelay: `${(index + 1) * 0.1}s`,
    backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.5), rgba(15, 23, 42, 0.95)), url(${bgImage})`
  };

  const handleCardClick = () => {
    navigate(`/category/${encodeURIComponent(title)}`);
  };

  return (
    <div className="category-card" style={cardStyle} onClick={handleCardClick}>
      <h3>{title}</h3>
      <div className="institute">{institute}</div>
    </div>
  );
}

export default CategoryCard;
