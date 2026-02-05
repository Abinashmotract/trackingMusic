import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => {
    return router.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/" className="navbar-brand" onClick={closeMenu}>
          <span className="navbar-icon">🐄</span>
          <span className="navbar-title">Milking Tracker</span>
        </Link>
        <button className="navbar-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          <span className={`navbar-toggle-icon ${isMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link 
            href="/" 
            className={`navbar-link ${isActive('/') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Home
          </Link>
          <Link 
            href="/milking" 
            className={`navbar-link ${isActive('/milking') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Start Milking
          </Link>
          <Link 
            href="/history" 
            className={`navbar-link ${isActive('/history') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            History
          </Link>
        </div>
      </div>
    </nav>
  );
}
