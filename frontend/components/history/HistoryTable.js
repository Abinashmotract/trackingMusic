import { formatDate, formatTime, formatDuration } from '../../utils/dateFormatters';

export default function HistoryTable({ sessions, pagination, onPageChange }) {
  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      onPageChange(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPrevious = () => {
    if (pagination.hasPreviousPage) {
      goToPage(pagination.currentPage - 1);
    }
  };

  const goToNext = () => {
    if (pagination.hasNextPage) {
      goToPage(pagination.currentPage + 1);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const totalPages = pagination.totalPages;
    const currentPage = pagination.currentPage;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  if (sessions.length === 0) {
    return null;
  }

  const startIndex = (pagination.currentPage - 1) * pagination.limit + 1;
  const endIndex = startIndex + sessions.length - 1;

  return (
    <div>
      <div className="table-wrapper">
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Duration</th>
                <th>Milk Collected (L)</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session, index) => (
                <tr key={session.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                  <td className="table-cell-date">{formatDate(session.start_time)}</td>
                  <td className="table-cell-time">{formatTime(session.start_time)}</td>
                  <td className="table-cell-time">{formatTime(session.end_time)}</td>
                  <td className="table-cell-duration">{formatDuration(session.duration)}</td>
                  <td className="table-cell-quantity">
                    <span className="quantity-badge">{parseFloat(session.milk_quantity).toFixed(2)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {pagination.totalPages > 1 && (
        <div className="pagination">
          <div className="pagination-info">
            Showing {startIndex} to {endIndex} of {pagination.totalSessions} sessions
          </div>
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              onClick={goToPrevious}
              disabled={!pagination.hasPreviousPage}
            >
              Previous
            </button>
            <div className="pagination-numbers">
              {getPageNumbers().map((page, index) => (
                page === '...' ? (
                  <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
                ) : (
                  <button
                    key={page}
                    className={`pagination-number ${pagination.currentPage === page ? 'active' : ''}`}
                    onClick={() => goToPage(page)}
                  >
                    {page}
                  </button>
                )
              ))}
            </div>
            <button
              className="pagination-btn"
              onClick={goToNext}
              disabled={!pagination.hasNextPage}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
