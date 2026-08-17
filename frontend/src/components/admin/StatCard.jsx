import "./StatCard.css";

function StatCard({ title, value, icon, loading }) {
  return (
    <div className="stat-card">
      {icon && <div className="stat-card-icon">{icon}</div>}
      <div className="stat-card-content">
        <h3 className="stat-card-title">{title}</h3>
        <h2 className="stat-card-value">
          {loading ? <span className="stat-card-skeleton"></span> : value}
        </h2>
      </div>
    </div>
  );
}

export default StatCard;