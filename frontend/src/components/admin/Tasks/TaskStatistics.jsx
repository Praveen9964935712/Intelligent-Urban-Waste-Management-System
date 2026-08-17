import { useState, useEffect } from "react";
import { getTaskStats } from "../../../services/dashboardService";
import "./TaskStatistics.css";

function TaskStatistics() {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    pendingTasks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getTaskStats();
        setStats({
          totalTasks: data.totalTasks || 0,
          completedTasks: data.completedTasks || 0,
          inProgressTasks: data.inProgressTasks || 0,
          pendingTasks: data.pendingTasks || 0,
        });
      } catch (err) {
        console.error("Error fetching task stats:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (error) {
    return <div className="task-stats-error">Error loading stats: {error}</div>;
  }

  if (loading) {
    return <div className="task-stats-loading">Loading...</div>;
  }

  const taskStatCards = [
    {
      title: "Total Tasks",
      value: stats.totalTasks,
      icon: "📌",
      color: "#3b82f6",
    },
    {
      title: "Completed",
      value: stats.completedTasks,
      icon: "✅",
      color: "#10b981",
    },
    {
      title: "In Progress",
      value: stats.inProgressTasks,
      icon: "⏳",
      color: "#f59e0b",
    },
    {
      title: "Pending",
      value: stats.pendingTasks,
      icon: "📋",
      color: "#ef4444",
    },
  ];

  return (
    <div className="task-statistics">
      <h3>Task Statistics</h3>
      <div className="task-stats-grid">
        {taskStatCards.map((card, index) => (
          <div key={index} className="task-stat-card" style={{ borderTopColor: card.color }}>
            <div className="task-stat-icon">{card.icon}</div>
            <div className="task-stat-content">
              <p className="task-stat-title">{card.title}</p>
              <p className="task-stat-value">{card.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskStatistics;
