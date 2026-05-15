import { Link } from 'react-router-dom';
import StarBackground from '../components/StarBackground';
import PublicNavbar from '../components/PublicNavbar';
import { useHeroEffects } from '../hooks/useHeroEffects';

export default function Home() {
  useHeroEffects();

  return (
    <>
      <StarBackground shooting />
      <PublicNavbar />
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title edge-sparks" data-text="LEARNING HUB">
            LEARNING HUB
          </h1>
          <p className="hero-subtitle">
            Learn. Practice. Grow. Your journey to excellence starts here.
          </p>
          <Link to="/about" className="btn btn-large btn-glow">
            GET STARTED
          </Link>
        </div>
        <div className="hero-particles" id="particles" />
      </section>
      <footer className="footer">
        <div className="footer-content">
          <Link to="/contact" className="contact-link">
            Contact Us
          </Link>
          <div className="social-icons">
            <a href="https://www.linkedin.com/in/ksh-halcyon-548432376/" target="_blank" rel="noreferrer" className="social-icon">
              <i className="fab fa-linkedin-in" />
            </a>
            <a href="https://www.instagram.com/itshalcyoninsta/" target="_blank" rel="noreferrer" className="social-icon">
              <i className="fab fa-instagram" />
            </a>
            <a href="https://wa.me/919366530914" target="_blank" rel="noreferrer" className="social-icon">
              <i className="fab fa-whatsapp" />
            </a>
            <a href="https://www.facebook.com/KSPengu1n/" target="_blank" rel="noreferrer" className="social-icon">
              <i className="fab fa-facebook-f" />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
