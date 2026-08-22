import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getComplaintTrend } from "../../../services/dashboardService";
import "./ComplaintTrendChart.css";

function ComplaintTrendChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getComplaintTrend();
        setData(result || []);
      } catch (err) {
        console.error("Error fetching complaint trend:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div className="chart-error">Error loading data: {error}</div>;
  }

  if (loading) {
    return <div className="chart-loading">Loading...</div>;
  }

  if (!data || data.length === 0) {
    return <div className="chart-empty">No data available</div>;
  }

  return (
    <div className="complaint-trend-chart">
      <h3>Complaint Trend (Last 30 Days)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="date" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #475569",
              borderRadius: "8px",
              color: "#f1f5f9",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="count"
            name="complaints"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: "#3b82f6", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ComplaintTrendChart;
