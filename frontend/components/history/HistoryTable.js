import { formatDate, formatTime, formatDuration } from '../../utils/dateFormatters';

export default function HistoryTable({ sessions }) {
  return (
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
  );
}
