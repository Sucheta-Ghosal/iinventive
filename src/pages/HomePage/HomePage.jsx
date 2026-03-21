import React from 'react';
import Header from '../../components/Header/Header';
import CategoryCard from '../../components/CategoryCard/CategoryCard';
import './HomePage.css';

function HomePage() {
  const categories = [
    { title: "Health Care", institute: "IIT KHARAGPUR", bgImage: "/images/healthcare_bg.png" },
    { title: "Materials Science", institute: "IIT(BHU) VARANASI", bgImage: "/images/materials_bg.png" },
    { title: "Earth Sciences", institute: "IIT(ISM) DHANBAD", bgImage: "/images/earth_bg.png" },
    { title: "Artificial Intelligence", institute: "IIT PATNA", bgImage: "/images/ai_bg.png" },
    { title: "Semiconductor Technology & Chip Design", institute: "IIT BHUBANESWAR", bgImage: "/images/semi_bg.png" },
  ];

  const vcs = [
    { name: "Sarah Jenkins", firm: "Sequoia Capital", image: "https://i.pravatar.cc/150?img=5" },
    { name: "Michael Chang", firm: "Andreessen Horowitz", image: "https://i.pravatar.cc/150?img=11" },
    { name: "Elena Rostova", firm: "Lightspeed Ventures", image: "https://i.pravatar.cc/150?img=9" },
    { name: "David O'Connor", firm: "Accel Partners", image: "https://i.pravatar.cc/150?img=8" },
  ];

  return (
    <div className="home-page">
      <Header />
      <main className="main-content">
        <div className="hero">
          <h2>Thematic Areas & Coordinating Institutes</h2>
          <p>Discover groundbreaking research and advancements across multiple disciplines.</p>
        </div>
        
        <div className="categories-grid">
          {categories.map((cat, idx) => (
            <CategoryCard 
              key={idx}
              title={cat.title}
              institute={cat.institute}
              bgImage={cat.bgImage}
              index={idx}
            />
          ))}
        </div>

        <section className="vcs-section">
          <h2>Attending Venture Capitalists</h2>
          <p>Meet the top investors looking to fund the next big breakthrough.</p>
          <div className="vcs-grid">
            {vcs.map((vc, idx) => (
              <div className="vc-card" key={idx} style={{ animationDelay: `${idx * 0.15 + 0.5}s` }}>
                <img src={vc.image} alt={vc.name} className="vc-image" />
                <h4>{vc.name}</h4>
                <span className="vc-firm">{vc.firm}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage;
