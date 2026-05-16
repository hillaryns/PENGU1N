import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { getVideoById, videos } from '../data/videos';
import VideoCard from '../components/VideoCard';
import { useProgress } from '../context/ProgressContext';

export default function VideoWatch() {
  const { videoId } = useParams();
  const { recordVideoWatch, progress } = useProgress();
  const video = getVideoById(videoId);

  useEffect(() => {
    if (video) recordVideoWatch(video.id, 100);
  }, [video, recordVideoWatch]);

  if (!video) {
    return (
      <div className="quiz-empty">
        <h2>Video not found</h2>
        <Link to="/classes" className="btn btn-primary">Back to Classes</Link>
      </div>
    );
  }

  const related = videos
    .filter((v) => v.category === video.category && v.id !== video.id)
    .slice(0, 3);
  const recent = Object.entries(progress.videosWatched || {})
    .sort((a, b) => (b[1].lastWatched || 0) - (a[1].lastWatched || 0))
    .slice(0, 4)
    .map(([id]) => getVideoById(id))
    .filter(Boolean);

  return (
    <motion.div className="video-watch-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Link to="/classes" className="quiz-back"><i className="fas fa-arrow-left" /> Classes</Link>
      <motion.h1 className="welcome-text" layout>{video.title}</motion.h1>
      <p className="welcome-subtitle">{video.instructor} · {video.duration} · {video.level}</p>

      <motion.div className="video-player-wrap" initial={{ scale: 0.98 }} animate={{ scale: 1 }}>
        <iframe
          title={video.title}
          src={`https://www.youtube.com/embed/${video.videoId}?rel=0`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </motion.div>

      <div className="course-tags" style={{ marginTop: '1rem' }}>
        {video.tags?.map((t) => (
          <span key={t} className="course-tag">{t}</span>
        ))}
      </div>

      {recent.length > 0 && (
        <section style={{ marginTop: '2.5rem' }}>
          <h2 className="section-title">Continue Watching</h2>
          <div className="grid grid-3">
            {recent.map((v, i) => (
              <VideoCard key={v.id} video={v} index={i} progress={progress.videosWatched[v.id]?.percent} />
            ))}
          </div>
        </section>
      )}

      <section style={{ marginTop: '2.5rem' }}>
        <h2 className="section-title">Recommended</h2>
        <motion.div className="grid grid-3">
          {related.map((v, i) => (
            <VideoCard key={v.id} video={v} index={i} />
          ))}
        </motion.div>
      </section>
    </motion.div>
  );
}
