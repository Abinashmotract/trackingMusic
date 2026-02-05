import Head from 'next/head';
import { useSessions } from '../hooks/useSessions';
import HistoryHero from '../components/history/HistoryHero';
import HistoryStats from '../components/history/HistoryStats';
import HistoryTable from '../components/history/HistoryTable';
import EmptyState from '../components/history/EmptyState';
import HistoryActions from '../components/history/HistoryActions';

export default function History() {
  const { sessions, loading, error } = useSessions();

  // Static fallback data for demonstration when no sessions
  const staticSessions = [
    {
      id: '1',
      start_time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      end_time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString(),
      duration: 900,
      milk_quantity: 6.5
    },
    {
      id: '2',
      start_time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      end_time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 18 * 60 * 1000).toISOString(),
      duration: 1080,
      milk_quantity: 7.2
    },
    {
      id: '3',
      start_time: new Date().toISOString(),
      end_time: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
      duration: 1200,
      milk_quantity: 8.1
    }
  ];

  const displaySessions = sessions.length > 0 ? sessions : staticSessions;
  const showStaticData = !loading && !error && sessions.length === 0;

  return (
    <>
      <Head>
        <title>Milking History - Milking Tracker</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="history-page">
        <HistoryHero />
        {loading ? (
          <div className="history-content">
            <div className="card">
              <EmptyState type="loading" />
            </div>
          </div>
        ) : error ? (
          <div className="history-content">
            <div className="card">
              <EmptyState type="error" message={error} />
              <HistoryActions />
            </div>
          </div>
        ) : (
          <>
            <HistoryStats sessions={displaySessions} />
            <div className="history-content">
              <div className="card">
                {showStaticData && (
                  <div className="static-data-notice">
                    <p>📌 Showing sample data. Start your first milking session to see your actual records!</p>
                  </div>
                )}
                <HistoryTable sessions={displaySessions} />
                <HistoryActions />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
