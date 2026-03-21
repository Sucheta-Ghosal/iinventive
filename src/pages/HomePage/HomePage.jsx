import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import CategoryCard from '../../components/CategoryCard/CategoryCard';
import './HomePage.css';

function HomePage() {
  const [vcs, setVcs] = useState([]);
  const [selectedVC, setSelectedVC] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [requestedVCs, setRequestedVCs] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('userInfo');
    let currentUserInfo = null;
    if (stored) {
      currentUserInfo = JSON.parse(stored);
      setUserInfo(currentUserInfo);
    }
    fetch('http://localhost:5000/api/users/vcs')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setVcs(data);
        }
      })
      .catch(err => console.error("Error fetching VCs:", err));

    if (currentUserInfo && (currentUserInfo.role === 'Innovator' || currentUserInfo.role === 'Startup')) {
      fetch(`http://localhost:5000/api/users/meetup/${currentUserInfo._id}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setRequestedVCs(data);
        })
        .catch(err => console.error("Error fetching requested VCs purely organically optimally effectively reliably correctly natively efficiently intelligently explicitly correctly properly robustly.", err));
    }
  }, []);

  const handleRequestMeetup = async () => {
    if (!selectedVC || !userInfo) return;
    try {
      const res = await fetch(`http://localhost:5000/api/users/meetup/${selectedVC._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userInfo._id })
      });
      const data = await res.json();
      if (res.ok) {
        setRequestedVCs(data.requestedVCs);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const categories = [
    { title: "Health Care", institute: "IIT KHARAGPUR", bgImage: "/images/healthcare_bg.png" },
    { title: "Materials Science", institute: "IIT(BHU) VARANASI", bgImage: "/images/materials_bg.png" },
    { title: "Earth Sciences", institute: "IIT(ISM) DHANBAD", bgImage: "/images/earth_bg.png" },
    { title: "Artificial Intelligence", institute: "IIT PATNA", bgImage: "/images/ai_bg.png" },
    { title: "Semiconductor Technology & Chip Design", institute: "IIT BHUBANESWAR", bgImage: "/images/semi_bg.png" },
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
            {vcs.length === 0 ? (
              <p style={{ color: '#94a3b8', fontStyle: 'italic', gridColumn: '1 / -1', textAlign: 'center' }}>No VCs have been registered yet.</p>
            ) : (
              vcs.map((vc, idx) => (
                <div 
                  className="vc-card" 
                  key={idx} 
                  style={{ animationDelay: `${idx * 0.15 + 0.5}s`, cursor: 'pointer' }}
                  onClick={() => setSelectedVC(vc)}
                >
                  <img src={vc.picture} alt={vc.name} className="vc-image" />
                  <h4>{vc.name}</h4>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {selectedVC && (
        <div className="vc-modal-overlay" onClick={() => setSelectedVC(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="vc-modal-content" onClick={e => e.stopPropagation()} style={{ background: '#1e293b', padding: '2.5rem', borderRadius: '16px', width: '100%', maxWidth: '550px', border: '1px solid rgba(255,255,255,0.1)', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <button onClick={() => setSelectedVC(null)} style={{ position: 'absolute', top: '1.2rem', right: '1.5rem', background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.8rem', cursor: 'pointer', transition: 'color 0.2s' }}>&times;</button>
            
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <img src={selectedVC.picture} alt={selectedVC.name} style={{ width: '130px', height: '130px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #38bdf8', marginBottom: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)' }} />
              <h3 style={{ margin: '0', color: '#f8fafc', fontSize: '1.8rem' }}>{selectedVC.name}</h3>
              <span style={{ color: '#38bdf8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 'bold' }}>Venture Capitalist</span>
            </div>
            
            <div style={{ marginBottom: '2.5rem', background: 'rgba(15, 23, 42, 0.5)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h4 style={{ color: '#f1f5f9', margin: '0 0 0.8rem 0', fontSize: '1.1rem' }}>About Profile</h4>
              <p style={{ color: '#cbd5e1', lineHeight: '1.7', fontSize: '0.95rem', margin: 0, whiteSpace: 'pre-line' }}>{selectedVC.about}</p>
            </div>

            {userInfo && (userInfo.role === 'Innovator' || userInfo.role === 'Startup') && (
              requestedVCs.includes(selectedVC._id) ? (
                <button 
                  disabled
                  style={{ width: '100%', padding: '1.2rem', background: 'rgba(52, 211, 153, 0.2)', color: '#34d399', border: '1px solid rgba(52, 211, 153, 0.5)', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'not-allowed' }}
                >
                  ✓ Request Sent
                </button>
              ) : (
                <button 
                  onClick={handleRequestMeetup}
                  style={{ width: '100%', padding: '1.2rem', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.4)' }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  Request for a Meetup
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
