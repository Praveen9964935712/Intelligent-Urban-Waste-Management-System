import { useState, useEffect } from "react";
import { getActivity } from "../../../services/dashboardService";
import "./ActivityFeed.css";

function ActivityFeed() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getActivity();
        setData(result || []);
      } catch (err) {
        console.error("Error fetching activity:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case "complaint":
        return "📋";
      case "resolved":
        return "✅";
      case "assigned":
        return "👤";
      case "notification":
        return "🔔";
      default:
        return "📌";
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (error) {
    return <div className="activity-error">Error loading activity: {error}</div>;
  }

  if (loading) {
    return <div className="activity-loading">Loading...</div>;
  }

  if (!data || data.length === 0) {
    return <div className="activity-empty">No recent activity</div>;
  }

  return (
    <div className="activity-feed">
      <h3>Recent Activity</h3>
      <div className="activity-list">
        {data.map((activity, index) => (
          <div key={index} className="activity-item">
            <div className="activity-icon">
              {getActivityIcon(activity.type)}
            </div>
            <div className="activity-content">
              <p className="activity-title">{activity.title}</p>
              <p className="activity-description">{activity.description}</p>
              <p className="activity-time">{formatTime(activity.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActivityFeed;
