import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Navbar() {
  const router = useRouter();

  const isActive = (path) => {
    return router.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/" className="navbar-brand">
          <span className="navbar-icon">🐄</span>
          <span className="navbar-title">Milking Tracker</span>
        </Link>
        <div className="navbar-menu">
          <Link href="/" className={`navbar-link ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>
          <Link href="/milking" className={`navbar-link ${isActive('/milking') ? 'active' : ''}`}>
            Start Milking
          </Link>
          <Link href="/history" className={`navbar-link ${isActive('/history') ? 'active' : ''}`}>
            History
          </Link>
        </div>
      </div>
    </nav>
  );
}
