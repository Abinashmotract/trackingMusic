import { useRouter } from 'next/router';

export default function CTASection() {
  const router = useRouter();

  return (
    <section className="cta-section">
      <div className="cta-content">
        <h2 className="cta-title">Ready to Improve Your Dairy Operations?</h2>
        <p className="cta-subtitle">Start tracking your milking sessions today and experience the difference</p>
        <button className="btn btn-primary btn-large" onClick={() => router.push('/milking')}>
          Get Started Now
        </button>
      </div>
    </section>
  );
}
