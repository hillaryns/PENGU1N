import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import notesContent from '../data/notesData';
import { lessonCatalog, getLesson, getAdjacentTopics } from '../data/notes/lessons';
import LessonView from '../components/notes/LessonView';
import { useProgress } from '../context/ProgressContext';
import { showToast } from '../utils/toast';

export default function Notes() {
  const [activeTopic, setActiveTopic] = useState('html-intro');
  const [search, setSearch] = useState('');
  const [collapsed, setCollapsed] = useState({});
  const { recordNoteRead, progress } = useProgress();

  const lesson = getLesson(activeTopic);
  const legacyHtml = notesContent[activeTopic];
  const { prev, next } = getAdjacentTopics(activeTopic);

  const filteredTopics = useMemo(() => {
    if (!search.trim()) return lessonCatalog;
    const q = search.toLowerCase();
    return lessonCatalog
      .map((cat) => ({
        ...cat,
        topics: cat.topics.filter(
          (t) => t.label.toLowerCase().includes(q) || cat.category.toLowerCase().includes(q),
        ),
      }))
      .filter((cat) => cat.topics.length > 0);
  }, [search]);

  useEffect(() => {
    recordNoteRead(activeTopic);
  }, [activeTopic, recordNoteRead]);

  const toggleCat = (cat) => {
    setCollapsed((c) => ({ ...c, [cat]: !c[cat] }));
  };

  const readCount = progress.notesRead?.length || 0;
  const totalTopics = lessonCatalog.reduce((s, c) => s + c.topics.length, 0);
  const notesPct = Math.round((readCount / totalTopics) * 100);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="dashboard-header">
        <h1 className="welcome-text">Notes 📒</h1>
        <p className="welcome-subtitle">Documentation-style learning · {notesPct}% explored · +15 XP per new topic</p>
      </div>

      <nav className="breadcrumbs notes-bc">
        <Link to="/dashboard">Dashboard</Link> / <span>Notes</span> / <span>{lesson.title}</span>
      </nav>

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

      <div className="notes-container notes-enhanced">
        <aside className="notes-sidebar collapsible">
          {filteredTopics.map((category) => (
            <div key={category.category} className="notes-category">
              <button
                type="button"
                className="category-toggle"
                onClick={() => toggleCat(category.category)}
              >
                <i className={`fas fa-chevron-${collapsed[category.category] ? 'right' : 'down'}`} />
                {category.category}
              </button>
              {!collapsed[category.category] && category.topics.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  className={`topic-link${activeTopic === topic.id ? ' active' : ''}${progress.notesRead?.includes(topic.id) ? ' read' : ''}`}
                  onClick={() => setActiveTopic(topic.id)}
                >
                  {topic.label}
                  {progress.notesRead?.includes(topic.id) && <i className="fas fa-check read-icon" />}
                </button>
              ))}
            </div>
          ))}
        </aside>

        <div className="notes-main">
          {lesson.sections ? (
            <LessonView
              lesson={lesson}
              onQuizAnswer={(ok) => showToast(ok ? 'Correct! +10 XP' : 'Review the section above', ok ? 'success' : 'error')}
            />
          ) : (
            <motion.div
              className="notes-content"
              dangerouslySetInnerHTML={{ __html: lesson.legacyHtml || legacyHtml || '<p>Select a topic</p>' }}
            />
          )}

          <div className="lesson-nav">
            {prev ? (
              <button type="button" className="btn btn-ghost" onClick={() => setActiveTopic(prev.id)}>
                <i className="fas fa-chevron-left" /> {prev.label}
              </button>
            ) : <span />}
            {next ? (
              <button type="button" className="btn btn-primary" onClick={() => setActiveTopic(next.id)}>
                {next.label} <i className="fas fa-chevron-right" />
              </button>
            ) : <span />}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
