export default function EmptyState({ type, message }) {
  const defaultMessage = {
    loading: 'Loading sessions...',
    error: 'Error loading sessions. Please check if the backend is running.',
    empty: 'No milking sessions found. Start your first session!'
  };

  const displayMessage = message || defaultMessage[type] || defaultMessage.empty;
  const isError = type === 'error';

  return (
    <div className="empty-state" style={isError ? { color: '#dc3545' } : {}}>
      {displayMessage}
    </div>
  );
}
