import { useEffect, useMemo, useState } from 'react';
import notesContent, { notesTopics } from '../data/notesData';
import { showToast } from '../utils/toast';

export default function Notes() {
  const [activeTopic, setActiveTopic] = useState('html-intro');
  const [search, setSearch] = useState('');

  const filteredTopics = useMemo(() => {
    if (!search.trim()) return notesTopics;
    const query = search.toLowerCase();
    return notesTopics
      .map((category) => ({
        ...category,
        topics: category.topics.filter((topic) => topic.label.toLowerCase().includes(query)),
      }))
      .filter((category) => category.topics.length > 0);
  }, [search]);

  useEffect(() => {
    const handleCopy = (e) => {
      const btn = e.target.closest('.copy-btn');
      if (!btn) return;
      const code = btn.closest('.code-block')?.querySelector('code')?.textContent;
      if (code) {
        navigator.clipboard.writeText(code);
        showToast('Copied to clipboard!');
      }
    };
    document.addEventListener('click', handleCopy);
    return () => document.removeEventListener('click', handleCopy);
  }, [activeTopic]);

  return (
    <>
      <div className="dashboard-header">
        <h1 className="welcome-text">Notes 📒</h1>
        <p className="welcome-subtitle">Topic-wise organized learning material</p>
      </div>

      <div className="search-container">
        <i className="fas fa-search search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="notes-container">
        <div className="notes-sidebar">
          {filteredTopics.map((category) => (
            <div key={category.category} className="notes-category">
              <div className="category-title">{category.category}</div>
              {category.topics.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  className={`topic-link${activeTopic === topic.id ? ' active' : ''}`}
                  onClick={() => setActiveTopic(topic.id)}
                >
                  {topic.label}
                </button>
              ))}
            </div>
          ))}
        </div>
        <div
          className="notes-content"
          dangerouslySetInnerHTML={{ __html: notesContent[activeTopic] || '<p>Select a topic</p>' }}
        />
      </div>
    </>
  );
}
