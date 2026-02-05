import { useState, useEffect } from 'react';

export function useSessions(page = 1, limit = 10) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalSessions: 0,
    limit: 10,
    hasNextPage: false,
    hasPreviousPage: false
  });

  useEffect(() => {
    fetchSessions(page, limit);
  }, [page, limit]);

  const fetchSessions = async (currentPage = page, currentLimit = limit) => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/sessions?page=${currentPage}&limit=${currentLimit}`);
      
      const result = await response.json();
      
      if (result.success && response.ok) {
        setSessions(result.data.sessions);
        setPagination(result.data.pagination);
        setError(null);
      } else {
        setError(result.message || 'Failed to fetch sessions');
        setSessions([]);
      }
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError('Error loading sessions. Please check if the backend is running.');
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  return { 
    sessions, 
    loading, 
    error, 
    pagination,
    refetch: () => fetchSessions(page, limit)
  };
}
