import { useRouter } from 'next/router';

export default function HeroSection() {
  const router = useRouter();

  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="landing-icon">🐄</div>
        <h1 className="landing-title">Milking Tracker</h1>
        <p className="landing-subtitle">
          Enhance your dairy farming with stress-free milking sessions. 
          Track, monitor, and optimize your milking operations with calming music.
        </p>
        
        <div className="landing-actions">
          <button className="btn btn-primary" onClick={() => router.push('/milking')}>
            Start Milking Session
          </button>
          <a className="link history-link" onClick={() => router.push('/history')} style={{ cursor: 'pointer' }}>
            View Milking History →
          </a>
        </div>
      </div>
    </section>
  );
}
