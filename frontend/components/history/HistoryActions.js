import { useRouter } from 'next/router';

export default function HistoryActions() {
  const router = useRouter();

  return (
    <a className="link" onClick={() => router.push('/')} style={{ cursor: 'pointer', marginTop: '20px' }}>
      Back to Home
    </a>
  );
}
