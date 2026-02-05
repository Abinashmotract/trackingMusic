import { useState } from 'react';
import Head from 'next/head';
import { useSessions } from '../hooks/useSessions';
import HistoryHero from '../components/history/HistoryHero';
import HistoryStats from '../components/history/HistoryStats';
import HistoryTable from '../components/history/HistoryTable';
import EmptyState from '../components/history/EmptyState';
import HistoryActions from '../components/history/HistoryActions';

export default function History() {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const { sessions, loading, error, pagination } = useSessions(currentPage, limit);

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
        ) : sessions.length > 0 ? (
          <>
            <HistoryStats sessions={sessions} />
            <div className="history-content">
              <div className="card">
                <HistoryTable 
                  sessions={sessions} 
                  pagination={pagination}
                  onPageChange={setCurrentPage}
                />
                <HistoryActions />
              </div>
            </div>
          </>
        ) : (
          <div className="history-content">
            <div className="card">
              <EmptyState type="empty" />
              <HistoryActions />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
