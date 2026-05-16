import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { VIDEO_CATEGORIES, videos } from '../data/videos';
import VideoCard from '../components/VideoCard';
import { useProgress } from '../context/ProgressContext';

const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function Classes() {
  const [category, setCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('All');
  const [search, setSearch] = useState('');
  const { progress } = useProgress();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return videos.filter((v) => {
      if (category !== 'all' && v.category !== category) return false;
      if (difficulty !== 'All' && v.level !== difficulty) return false;
      if (q && !v.title.toLowerCase().includes(q) && !v.instructor.toLowerCase().includes(q) && !v.tags?.some((t) => t.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [category, difficulty, search]);

  const continueList = useMemo(() => {
    return Object.entries(progress.videosWatched || {})
      .filter(([, data]) => data.percent > 0 && data.percent < 100)
      .sort((a, b) => (b[1].lastWatched || 0) - (a[1].lastWatched || 0))
      .map(([id]) => videos.find((v) => v.id === id))
      .filter(Boolean)
      .slice(0, 3);
  }, [progress.videosWatched]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="dashboard-header">
        <h1 className="welcome-text">Video Classes 🎥</h1>
        <p className="welcome-subtitle">{filtered.length} lessons — real YouTube embeds</p>
      </div>

      <div className="search-container">
        <i className="fas fa-search search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search videos, instructors, tags..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="courses-toolbar">
        {VIDEO_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`filter-chip${category === cat ? ' active' : ''}`}
            onClick={() => setCategory(cat)}
          >
            {cat === 'all' ? 'All' : cat.replace('-', '/').toUpperCase()}
          </button>
        ))}
      </div>

      <motion.div className="courses-toolbar" style={{ marginTop: '0.5rem' }}>
        {DIFFICULTIES.map((d) => (
          <button
            key={d}
            type="button"
            className={`filter-chip${difficulty === d ? ' active' : ''}`}
            onClick={() => setDifficulty(d)}
          >
            {d}
          </button>
        ))}
      </motion.div>

      {continueList.length > 0 && (
        <section style={{ marginBottom: '2rem' }}>
          <h2 className="section-title">Continue Watching</h2>
          <div className="grid grid-3">
            {continueList.map((v, i) => (
              <VideoCard key={v.id} video={v} index={i} progress={progress.videosWatched[v.id]?.percent} />
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-3 courses-grid">
        {filtered.map((video, index) => (
          <VideoCard
            key={video.id}
            video={video}
            index={index}
            progress={progress.videosWatched[video.id]?.percent || 0}
          />
        ))}
      </div>
    </motion.div>
  );
}
