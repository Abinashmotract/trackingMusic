import { useState, useEffect } from 'react';
import axios from 'axios';

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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://trackingmusic.onrender.com';
      const { data: result } = await axios.get(`${apiUrl}/sessions`, {
        params: { page: currentPage, limit: currentLimit },
      });

      if (result.success) {
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
