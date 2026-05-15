import { useMemo, useState } from 'react';
import { internships } from '../data/internships';
import { showToast } from '../utils/toast';

export default function Internships() {
  const [search, setSearch] = useState('');
  const [saved, setSaved] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('saved_internships') || '[]');
    } catch {
      return [];
    }
  });

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return internships.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.company.toLowerCase().includes(query) ||
        item.skills.some((skill) => skill.toLowerCase().includes(query)),
    );
  }, [search]);

  const toggleSave = (id) => {
    setSaved((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem('saved_internships', JSON.stringify(next));
      showToast(prev.includes(id) ? 'Removed from saved' : 'Saved to your list!');
      return next;
    });
  };

  return (
    <>
      <div className="dashboard-header">
        <h1 className="welcome-text">Internships 💼</h1>
        <p className="welcome-subtitle">Find opportunities to kickstart your career</p>
      </div>

      <div className="search-container" style={{ maxWidth: '100%' }}>
        <i className="fas fa-search search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search internships by title, company, or skills..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-2" id="internshipsContainer">
        {filtered.map((item) => (
          <div key={item.id} className="internship-card">
            <div className="internship-header">
              <div className="company-logo">{item.logo}</div>
              <div className="internship-info">
                <h3>{item.title}</h3>
                <p>{item.company}</p>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {item.description}
            </p>
            <div className="internship-details">
              <span className="detail-item"><i className="fas fa-map-marker-alt" /> {item.location}</span>
              <span className="detail-item"><i className="fas fa-calendar" /> {item.duration}</span>
              <span className="detail-item"><i className="fas fa-rupee-sign" /> {item.stipend}</span>
            </div>
            <div className="skills-required">
              {item.skills.map((skill) => (
                <span key={skill} className="skill-tag">{skill}</span>
              ))}
            </div>
            <div className="internship-actions">
              <button type="button" className="btn btn-primary" onClick={() => showToast(`Application for ${item.title} submitted!`)}>
                Apply Now
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => toggleSave(item.id)}>
                {saved.includes(item.id) ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
