import { useState } from 'react';
import { motion } from 'framer-motion';
import SmokeBackground from '../components/SmokeBackground';
import PublicNavbar from '../components/PublicNavbar';
import CourseCard from '../components/CourseCard';
import { courses, externalResources } from '../data/courses';

const filters = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Trending'];

export default function Subjects() {
  const [filter, setFilter] = useState('All');

  const filtered = courses.filter((course) => {
    if (filter === 'All') return true;
    if (filter === 'Trending') return course.trending;
    return course.difficulty === filter;
  });

  return (
    <>
      <SmokeBackground />
      <PublicNavbar />
      <main className="page subjects-page">
        <div className="container container-wide">
          <motion.header
            className="page-header"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <h1 className="page-title">Courses</h1>
            <p className="page-subtitle">
              {filtered.length} learning paths — pick a course and level up your skills
            </p>
          </motion.header>

          <div className="courses-toolbar">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                className={`filter-chip${filter === f ? ' active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="grid grid-3 courses-grid">
            {filtered.map((course, index) => (
              <CourseCard key={course.slug} course={course} index={index} />
            ))}
          </div>

          <motion.section
            style={{ marginTop: '4rem' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '2rem' }}>
              External Resources
            </h2>
            <div className="grid grid-4">
              {externalResources.map((resource, i) => (
                <motion.a
                  key={resource.url}
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer"
                  className="card interactive-card"
                  style={{ textAlign: 'center' }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ scale: 1.03, boxShadow: '0 0 28px var(--accent-glow)' }}
                >
                  <i
                    className="fas fa-external-link-alt"
                    style={{ fontSize: '2rem', color: 'var(--accent-primary)', marginBottom: '1rem' }}
                  />
                  <h4>{resource.name}</h4>
                  <p className="card-description">{resource.description}</p>
                </motion.a>
              ))}
            </div>
          </motion.section>
        </div>
      </main>
    </>
  );
}
