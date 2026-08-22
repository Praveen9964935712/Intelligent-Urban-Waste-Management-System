import { useEffect, useEffectEvent, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./TaskStatusOverview.css";
import { getTaskManagementStats } from "../../../services/taskManagementService";

function TaskStatusOverview() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = async () => {
    try {
      const stats = await getTaskManagementStats();
      setData([
        { status: "Completed", tasks: stats.completedTasks || 0, fill: "#10b981" },
        { status: "In Progress", tasks: stats.inProgressTasks || 0, fill: "#f59e0b" },
        { status: "Pending", tasks: stats.pendingTasks || 0, fill: "#ef4444" },
      ]);
    } catch (requestError) {
      setError(requestError.message || "Unable to load task status.");
    } finally {
      setLoading(false);
    }
  };

  const loadStatsEvent = useEffectEvent(loadStats);
  useEffect(() => {
    const request = setTimeout(() => loadStatsEvent(), 0);
    return () => clearTimeout(request);
  }, []);

  if (error) {
    return <div className="chart-error">Error loading data: {error}</div>;
  }

  if (loading) {
    return <div className="chart-loading">Loading...</div>;
  }

  return (
    <div className="task-status-overview">
      <h3>Task Status Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="status" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #475569",
              borderRadius: "8px",
              color: "#f1f5f9",
            }}
          />
          <Bar dataKey="tasks" fill="#3b82f6" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Bar key={`bar-${index}`} dataKey="tasks" fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TaskStatusOverview;
