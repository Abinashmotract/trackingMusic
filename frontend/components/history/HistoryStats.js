export default function HistoryStats({ sessions }) {
  // Calculate statistics from sessions
  const totalSessions = sessions.length;
  const totalMilk = sessions.reduce((sum, session) => sum + parseFloat(session.milk_quantity || 0), 0);
  const averageMilk = totalSessions > 0 ? (totalMilk / totalSessions).toFixed(2) : 0;
  const totalDuration = sessions.reduce((sum, session) => sum + (session.duration || 0), 0);
  const averageDuration = totalSessions > 0 ? Math.round(totalDuration / totalSessions) : 0;

  // Format duration
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const stats = [
    {
      icon: '📋',
      label: 'Total Sessions',
      value: totalSessions,
      suffix: ''
    },
    {
      icon: '🥛',
      label: 'Total Milk Collected',
      value: totalMilk.toFixed(2),
      suffix: 'L'
    },
    {
      icon: '📈',
      label: 'Average per Session',
      value: averageMilk,
      suffix: 'L'
    },
    {
      icon: '⏱️',
      label: 'Avg Duration',
      value: formatDuration(averageDuration),
      suffix: ''
    }
  ];

  return (
    <section className="history-stats-section">
      <div className="history-stats-container">
        {stats.map((stat, index) => (
          <div key={index} className="history-stat-card">
            <div className="history-stat-icon">{stat.icon}</div>
            <div className="history-stat-value">
              {stat.value}{stat.suffix && <span className="history-stat-suffix">{stat.suffix}</span>}
            </div>
            <div className="history-stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
