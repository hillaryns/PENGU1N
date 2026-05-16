import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getYouTubeThumb } from '../data/videos';

export default function VideoCard({ video, index = 0, progress = 0 }) {
  return (
    <motion.div
      className="video-card interactive-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      whileHover={{ scale: 1.02 }}
    >
      <Link to={`/classes/watch/${video.id}`} className="video-card-link">
        <span className="interactive-card-glow" aria-hidden="true" />
        <div className="video-thumb-wrap">
          <img
            src={getYouTubeThumb(video.videoId)}
            alt={video.title}
            loading="lazy"
            onError={(e) => {
              e.target.src = getYouTubeThumb(video.videoId, 'mqdefault');
            }}
          />
          <motion.span className="video-play-btn" whileHover={{ scale: 1.15 }}>
            <i className="fas fa-play" />
          </motion.span>
          {progress > 0 && (
            <motion.div className="video-progress-overlay" style={{ width: `${progress}%` }} />
          )}
        </div>
        <div className="video-card-body">
          <span className="video-cat">{video.category}</span>
          <h3>{video.title}</h3>
          <p>{video.duration} · {video.level} · ⭐ {video.rating}</p>
          <span className="video-instructor"><i className="fas fa-user" /> {video.instructor}</span>
        </div>
      </Link>
    </motion.div>
  );
}
