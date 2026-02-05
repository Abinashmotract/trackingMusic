export default function StatsSection({ stats }) {
  return (
    <section className="stats-section">
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-number">{stats.totalSessions.toLocaleString()}+</div>
          <div className="stat-label">Total Sessions</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🥛</div>
          <div className="stat-number">{stats.totalMilkCollected.toLocaleString()}L</div>
          <div className="stat-label">Milk Collected</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-number">{stats.averagePerSession}L</div>
          <div className="stat-label">Avg per Session</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-number">{stats.farmersUsing}+</div>
          <div className="stat-label">Active Farmers</div>
        </div>
      </div>
    </section>
  );
}
