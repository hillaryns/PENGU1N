import SmokeBackground from '../components/SmokeBackground';
import PublicNavbar from '../components/PublicNavbar';
import { subjects, externalResources } from '../data/subjects';

export default function Subjects() {
  return (
    <>
      <SmokeBackground />
      <PublicNavbar />
      <main className="page">
        <div className="container">
          <header className="page-header">
            <h1 className="page-title">Subjects</h1>
            <p className="page-subtitle">Choose a subject to start learning and practicing</p>
          </header>

          <div className="grid grid-3">
            {subjects.map((subject) => (
              <div key={subject.slug} className="subject-card">
                <div className={`subject-banner ${subject.bannerClass}`}>
                  <i className={subject.icon} />
                </div>
                <div className="subject-content">
                  <h3 className="subject-title">{subject.title}</h3>
                  <p className="subject-description">{subject.description}</p>
                  <div className="subject-meta">
                    <span><i className="fas fa-file-alt" /> {subject.notes} Notes</span>
                    <span><i className="fas fa-question" /> {subject.questions} Questions</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <section style={{ marginTop: '4rem' }}>
            <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '2rem' }}>
              External Resources
            </h2>
            <div className="grid grid-4">
              {externalResources.map((resource) => (
                <a
                  key={resource.url}
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer"
                  className="card"
                  style={{ textAlign: 'center' }}
                >
                  <i className="fas fa-external-link-alt" style={{ fontSize: '2rem', color: 'var(--accent-primary)', marginBottom: '1rem' }} />
                  <h4>{resource.name}</h4>
                  <p className="card-description">{resource.description}</p>
                </a>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
