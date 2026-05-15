import { useMemo, useState } from 'react';
import { videos } from '../data/videos';

const FILTERS = ['all', 'html', 'css', 'js', 'python'];

export default function Classes() {
  const [filter, setFilter] = useState('all');
  const [activeVideo, setActiveVideo] = useState(null);

  const filtered = useMemo(
    () => (filter === 'all' ? videos : videos.filter((v) => v.subject === filter)),
    [filter],
  );

  return (
    <>
      <div className="dashboard-header">
        <h1 className="welcome-text">Video Classes 🎥</h1>
        <p className="welcome-subtitle">Learn from curated video playlists</p>
      </div>

      <div className="practice-filters">
        {FILTERS.map((item) => (
          <button
            key={item}
            type="button"
            className={`filter-btn${filter === item ? ' active' : ''}`}
            onClick={() => setFilter(item)}
          >
            {item === 'all' ? 'All' : item.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="grid grid-3" id="videosContainer">
        {filtered.map((video) => (
          <button
            key={video.id}
            type="button"
            className="card"
            style={{ textAlign: 'left', padding: 0, overflow: 'hidden' }}
            onClick={() => setActiveVideo(video)}
          >
            <img
              src={`https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`}
              alt={video.title}
              style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }}
            />
            <div style={{ padding: '1rem' }}>
              <h3 className="card-title">{video.title}</h3>
              <p className="card-description">{video.duration} · {video.level}</p>
            </div>
          </button>
        ))}
      </div>

      {activeVideo && (
        <div className="modal-overlay" style={{ display: 'flex' }} onClick={() => setActiveVideo(null)}>
          <div className="modal" style={{ maxWidth: '900px', padding: 0 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ padding: '1.5rem' }}>
              <h3 className="modal-title">{activeVideo.title}</h3>
              <button type="button" className="modal-close" onClick={() => setActiveVideo(null)}>
                <i className="fas fa-times" />
              </button>
            </div>
            <div style={{ aspectRatio: '16/9', background: '#000' }}>
              <iframe
                title={activeVideo.title}
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${activeVideo.videoId}`}
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
