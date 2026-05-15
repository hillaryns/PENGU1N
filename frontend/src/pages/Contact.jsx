import SmokeBackground from '../components/SmokeBackground';
import PublicNavbar from '../components/PublicNavbar';
import { showToast } from '../utils/toast';

export default function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    showToast('Message sent! We will get back to you soon.');
    e.target.reset();
  };

  return (
    <>
      <SmokeBackground />
      <PublicNavbar />
      <main className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <header className="page-header">
            <h1 className="page-title">Contact Us</h1>
            <p className="page-subtitle">Have questions? We&apos;d love to hear from you!</p>
          </header>
          <div className="form-container" style={{ maxWidth: '100%' }}>
            <form id="contactForm" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input type="text" className="form-input" placeholder="Your name" required />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-input" placeholder="you@example.com" required />
              </div>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <input type="text" className="form-input" placeholder="How can we help?" required />
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea className="form-input" rows={5} placeholder="Your message..." required style={{ resize: 'vertical' }} />
              </div>
              <button type="submit" className="btn btn-primary form-btn">Send Message</button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
