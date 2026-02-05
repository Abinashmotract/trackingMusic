export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">Milking Tracker</h3>
            <p className="footer-description">
              Enhance your dairy farming with stress-free milking sessions.
            </p>
          </div>
          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/milking">Start Milking</a></li>
              <li><a href="/history">History</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4 className="footer-heading">Features</h4>
            <ul className="footer-links">
              <li>Calming Music</li>
              <li>Session Timer</li>
              <li>Track History</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} Milking Tracker. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
