import { useState, useEffect } from 'react';

export function useSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/sessions`);
      
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
        setError(null);
      } else {
        setError('Failed to fetch sessions');
      }
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError('Error loading sessions. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return { sessions, loading, error, refetch: fetchSessions };
}
