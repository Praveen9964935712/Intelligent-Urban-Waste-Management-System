import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./TaskStatusOverview.css";

function TaskStatusOverview() {
  const [data, setData] = useState([
    {
      status: "Completed",
      tasks: 45,
      fill: "#10b981",
    },
    {
      status: "In Progress",
      tasks: 28,
      fill: "#f59e0b",
    },
    {
      status: "Pending",
      tasks: 15,
      fill: "#ef4444",
    },
    {
      status: "On Hold",
      tasks: 8,
      fill: "#8b5cf6",
    },
  ]);
  const [loading, setLoading] = useState(false);

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
